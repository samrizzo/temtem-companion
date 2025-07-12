import { useState, useEffect, useMemo } from 'react';
import './TemtemApp.css';
import TemtemItem from './TemtemItem';

const TemtemApp = () => {
  const [temtemData, setTemtemData] = useState([]);
  const [temtemTypes, setTemtemTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedTemtem, setSelectedTemtem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [temtemsResponse, typesResponse] = await Promise.all([
          fetch('https://temtem-api.mael.tech/api/temtems?fields=number,name,types,portraitWikiUrl&weaknesses=true'),
          fetch('https://temtem-api.mael.tech/api/types')
        ]);

        if (!temtemsResponse.ok || !typesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const temtemsData = await temtemsResponse.json();
        const typesData = await typesResponse.json();

        setTemtemData(temtemsData.sort((a, b) => a.number - b.number));
        setTemtemTypes(typesData.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Scroll to top when selectedTemtem changes
  useEffect(() => {
    if (selectedTemtem) {
      window.scrollTo(0, 0);
    }
  }, [selectedTemtem]);

  // Filter results based on search term and selected types
  const filteredResults = useMemo(() => {
    let results = temtemData;

    // Filter by search term
    if (searchTerm.trim()) {
      results = results.filter(temtem =>
        temtem.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected types
    if (selectedTypes.length > 0) {
      results = results.filter(temtem =>
        selectedTypes.every(selectedType =>
          temtem.types.includes(selectedType)
        )
      );
    }

    return results;
  }, [temtemData, searchTerm, selectedTypes]);

  // Helper function to format Temtem number
  const formatTemtemNumber = (number) => {
    return number.toString().padStart(3, '0');
  };

  // Helper function to get sprite URL
  const getTemtemSpriteUrl = (number) => {
    const formattedNumber = formatTemtemNumber(number);
    return `/temtem-companion/TemtemSprites/${formattedNumber}.png`;
  };

  // Helper function to get type icon
  const getTypeIcon = (typeName) => {
    const typeData = temtemTypes.find(type => type.name === typeName);
    return typeData ? `https://temtem-api.mael.tech/${typeData.icon}` : '';
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedTemtem(null);
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSearchTerm('');
  };

  const toggleTypeFilter = (typeName) => {
    setSelectedTypes(prev => {
      if (prev.includes(typeName)) {
        return prev.filter(type => type !== typeName);
      } else {
        return [...prev, typeName];
      }
    });
  };

  const handleTemtemSelect = (temtem) => {
    setSelectedTemtem(temtem);
  };

  const handleBackToSearch = () => {
    setSelectedTemtem(null);
  };

  const hasActiveFilters = searchTerm || selectedTypes.length > 0;

  if (loading) {
    return (
      <div className="temtem-app temtem-app-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Temtem data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="temtem-app temtem-app-error">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p>Failed to load data: {error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="temtem-app">
      {/* Header */}
      {!selectedTemtem && (
      <header className="temtem-app-header">
        <h1>Temtem Battle Companion</h1>
        
        {/* Search Bar */}
        <div className="temtem-search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search Temtem name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="temtem-search-input"
              autoComplete="off"
            />
            {searchTerm && (
              <button onClick={clearSearch} className="clear-search-btn">
                ×
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="filter-controls">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
          >
            🔽 Filter by Type
            {selectedTypes.length > 0 && (
              <span className="filter-badge">{selectedTypes.length}</span>
            )}
          </button>
          
          {hasActiveFilters && (
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear All
            </button>
          )}
        </div>

        {/* Type Filter Grid */}
        {showFilters && (
          <div className="type-filter-section">
            <div className="type-filter-grid">
              {temtemTypes.map(type => (
                <button
                  key={type.name}
                  onClick={() => toggleTypeFilter(type.name)}
                  className={`type-filter-btn ${selectedTypes.includes(type.name) ? 'active' : ''}`}
                >
                  <img
                    src={`https://temtem-api.mael.tech/${type.icon}`}
                    alt={type.name}
                    className="type-filter-icon"
                  />
                  <span className="type-filter-name">{type.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
      )}

      <main className="temtem-app-main">
        {/* Temtem List */}
        {!selectedTemtem && (
          <section className="temtem-list-section">
            <div className="temtem-list-header">
              <h2>
                {hasActiveFilters ? (
                  <>
                    Filtered Results ({filteredResults.length})
                    {selectedTypes.length > 0 && (
                      <div className="active-type-filters">
                        {selectedTypes.map(typeName => (
                          <span key={typeName} className="active-type-filter">
                            <img
                              src={getTypeIcon(typeName)}
                              alt={typeName}
                              className="active-type-icon"
                            />
                            {typeName}
                            <button
                              onClick={() => toggleTypeFilter(typeName)}
                              className="remove-type-filter"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  `All Temtem (${temtemData.length})`
                )}
              </h2>
            </div>
            
            {filteredResults.length > 0 ? (
              <div className="temtem-grid">
                {filteredResults.map(temtem => (
                  <button
                    key={temtem.number}
                    onClick={() => handleTemtemSelect(temtem)}
                    className="temtem-grid-item"
                  >
                    <div className="temtem-grid-sprite">
                      <img
                        src={getTemtemSpriteUrl(temtem.number)}
                        alt={temtem.name}
                        className="temtem-sprite"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="temtem-sprite-fallback" style={{ display: 'none' }}>
                        <span className="temtem-sprite-placeholder">#{formatTemtemNumber(temtem.number)}</span>
                      </div>
                    </div>
                    
                    <div className="temtem-grid-info">
                      <div className="temtem-grid-number">
                        #{formatTemtemNumber(temtem.number)}
                      </div>
                      <h3 className="temtem-grid-name">{temtem.name}</h3>
                      <div className="temtem-grid-types">
                        {temtem.types.map(type => (
                          <div key={type} className="temtem-grid-type">
                            <img
                              src={getTypeIcon(type)}
                              alt={type}
                              className="temtem-grid-type-icon"
                            />
                            <span className="temtem-grid-type-name">{type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <section className="temtem-no-results">
                <div className="no-results-icon">🔍</div>
                <p>
                  {hasActiveFilters ? (
                    <>No Temtem found matching your search and filters</>
                  ) : (
                    <>No Temtem found matching "{searchTerm}"</>
                  )}
                </p>
              </section>
            )}
          </section>
        )}

        {/* Selected Temtem Details */}
        {selectedTemtem && (
          <section className="temtem-details">
            <button onClick={handleBackToSearch} className="back-btn">
              ← Back to list
            </button>
            <TemtemItem 
              temtem={selectedTemtem} 
              temtemTypes={temtemTypes}
              isDetailView={true}
            />
          </section>
        )}
      </main>
    </div>
  );
};

export default TemtemApp;