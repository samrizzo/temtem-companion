import { useState, useCallback } from 'react';
import './TemtemItem.css';

const TemtemItem = ({ temtem, temtemTypes, isDetailView = false, onEvolutionSelect, evolutionLoading = false }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const formatTemtemNumber = (number) => {
    return number.toString().padStart(3, '0');
  };

  const getTypeIcon = (typeName) => {
    const typeData = temtemTypes.find(type => type.name === typeName);
    return typeData ? `https://temtem-api.mael.tech/${typeData.icon}` : '';
  };

  const getTypeMatchups = (weaknesses) => {
    const matchups = {
      weakTo: [],      // 2x+ damage
      resistantTo: [], // 0.5x damage
      immuneTo: []     // 0x damage
    };

    Object.entries(weaknesses || {}).forEach(([type, multiplier]) => {
      if (multiplier >= 2) {
        matchups.weakTo.push(type);
      } else if (multiplier === 0) {
        matchups.immuneTo.push(type);
      } else if (multiplier <= 0.5) {
        matchups.resistantTo.push(type);
      }
    });

    return matchups;
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const getEvolutionRequirements = (evolutionData) => {
    const requirements = [];
    
    if (evolutionData.levels) {
      requirements.push(`Level ${evolutionData.levels}`);
    }
    
    if (evolutionData.trading) {
      requirements.push('Trading');
    }
    
    if (evolutionData.item) {
      requirements.push(`Item: ${evolutionData.item}`);
    }
    
    return requirements.length > 0 ? requirements.join(', ') : 'Base form';
  };

  // Debounced evolution click handler
  const handleEvolutionClick = useCallback((evolution) => {
    // Prevent rapid clicking
    if (evolutionLoading) return;
    
    console.log('Evolution clicked:', evolution);
    console.log('Current temtem number:', temtem.number);
    
    if (evolution.number !== temtem.number && onEvolutionSelect) {
      console.log('Calling onEvolutionSelect with:', evolution.number);
      onEvolutionSelect(evolution.number);
    }
  }, [temtem.number, onEvolutionSelect, evolutionLoading]);

  const renderEvolutionChain = () => {
    if (!temtem.evolution || !temtem.evolution.evolves) {
      return (
        <div className="temtem-evolution">
          <h2 className="temtem-evolution-title">Evolution</h2>
          <p className="temtem-evolution-none">This Temtem does not evolve</p>
        </div>
      );
    }

    const { evolutionTree, stage } = temtem.evolution;
    const currentTemtem = evolutionTree.find(evo => evo.stage === stage);

    return (
      <div className="temtem-evolution">
        <h2 className="temtem-evolution-title">Evolution Chain</h2>
        {evolutionLoading && (
          <div className="evolution-loading">
            <div className="loading-spinner-small"></div>
            <span>Loading evolution...</span>
          </div>
        )}
        <div className="temtem-evolution-chain">
          {evolutionTree.map((evolution, index) => {
            const isCurrent = evolution.stage === stage;
            const isClickable = !isCurrent && onEvolutionSelect && !evolutionLoading;
            const temtemImageUrl = `/temtem-companion/TemtemSprites/${formatTemtemNumber(evolution.number)}.png`;
            
            return (
              <div key={evolution.number} className="temtem-evolution-wrapper">
                <div 
                  className={`temtem-evolution-card ${isCurrent ? 'current' : ''} ${isClickable ? 'clickable' : ''} ${evolutionLoading ? 'loading' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleEvolutionClick(evolution);
                  }}
                  style={{ 
                    cursor: isClickable ? 'pointer' : 'default',
                    opacity: evolutionLoading ? 0.6 : 1
                  }}
                >
                  <div className="temtem-evolution-image-container">
                    <img
                      src={temtemImageUrl}
                      alt={evolution.name}
                      className="temtem-evolution-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="temtem-evolution-image-error" style={{ display: 'none' }}>
                      <span>🔍</span>
                    </div>
                  </div>
                  <div className="temtem-evolution-info">
                    <div className="temtem-evolution-number">#{formatTemtemNumber(evolution.number)}</div>
                    <div className="temtem-evolution-name">{evolution.name}</div>
                    <div className="temtem-evolution-stage">Stage {evolution.stage}</div>
                    <div className="temtem-evolution-requirements">
                      {getEvolutionRequirements(evolution)}
                    </div>
                    {isCurrent && <div className="temtem-evolution-current-indicator">Current</div>}
                  </div>
                </div>
                
                {index < evolutionTree.length - 1 && (
                  <div className="temtem-evolution-arrow">
                    <span>→</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const temtemNumber = formatTemtemNumber(temtem.number);
  const matchups = getTypeMatchups(temtem.weaknesses);
  const temtemImageUrl = `/temtem-companion/TemtemSprites/${temtemNumber}.png`;

  // Render detailed view for battle companion
  if (isDetailView) {
    return (
      <div className="temtem-detail-card">
        {/* Header */}
        <div className="temtem-detail-header">
          <div className="temtem-detail-sprite-container">
            {imageLoading && (
              <div className="temtem-detail-image-loading">
                <div className="loading-spinner-small"></div>
              </div>
            )}
            {!imageError ? (
              <img
                className={`temtem-detail-sprite ${imageLoading ? 'loading' : ''}`}
                src={temtemImageUrl}
                alt={temtem.name}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            ) : (
              <div className="temtem-detail-image-error">
                <span>🔍</span>
                <p>Image not found</p>
              </div>
            )}
          </div>
          <div className="temtem-detail-number">
            #{temtemNumber}
          </div>
          <h1 className="temtem-detail-name">{temtem.name}</h1>
          <div className="temtem-detail-types">
            {temtem.types.map(type => (
              <div key={type} className="temtem-detail-type">
                <img
                  src={getTypeIcon(type)}
                  alt={type}
                  className="temtem-detail-type-icon"
                />
                <span>{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Battle Matchups */}
        <div className="temtem-matchups">
          <h2 className="temtem-matchups-title">Battle Matchups</h2>
          
          {/* Weaknesses */}
          <div className="temtem-matchup-section temtem-weaknesses">
            <div className="temtem-matchup-header">
              <span className="temtem-matchup-icon">🔥</span>
              <h3>Weak To (2x+ Damage)</h3>
            </div>
            {matchups.weakTo.length > 0 ? (
              <div className="temtem-matchup-types">
                {matchups.weakTo.map(type => (
                  <div key={type} className="temtem-matchup-type temtem-matchup-weak">
                    <img
                      src={getTypeIcon(type)}
                      alt={type}
                      className="temtem-matchup-type-icon"
                    />
                    <span>{type}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="temtem-matchup-none">No weaknesses</p>
            )}
          </div>

          {/* Resistances */}
          <div className="temtem-matchup-section temtem-resistances">
            <div className="temtem-matchup-header">
              <span className="temtem-matchup-icon">🛡️</span>
              <h3>Resistant To (0.5x Damage)</h3>
            </div>
            {matchups.resistantTo.length > 0 ? (
              <div className="temtem-matchup-types">
                {matchups.resistantTo.map(type => (
                  <div key={type} className="temtem-matchup-type temtem-matchup-resistant">
                    <img
                      src={getTypeIcon(type)}
                      alt={type}
                      className="temtem-matchup-type-icon"
                    />
                    <span>{type}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="temtem-matchup-none">No resistances</p>
            )}
          </div>

          {/* Immunities */}
          {matchups.immuneTo.length > 0 && (
            <div className="temtem-matchup-section temtem-immunities">
              <div className="temtem-matchup-header">
                <span className="temtem-matchup-icon">⚫</span>
                <h3>Immune To (0x Damage)</h3>
              </div>
              <div className="temtem-matchup-types">
                {matchups.immuneTo.map(type => (
                  <div key={type} className="temtem-matchup-type temtem-matchup-immune">
                    <img
                      src={getTypeIcon(type)}
                      alt={type}
                      className="temtem-matchup-type-icon"
                    />
                    <span>{type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Evolution Chain */}
        {renderEvolutionChain()}

      </div>
    );
  }

  // Original card view (kept for backward compatibility)
  return (
    <section className="temtem">
      <section className="temtem-image-container">
        {imageLoading && (
          <div className="temtem-image-loading">
            <div className="loading-spinner-small"></div>
          </div>
        )}
        {!imageError ? (
          <img
            className={`temtem-image ${imageLoading ? 'loading' : ''}`}
            src={temtemImageUrl}
            alt={temtem.name}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="temtem-image-error">
            <span>🔍</span>
            <p>Image not found</p>
          </div>
        )}
      </section>

      <section className="temtem-attributes">
        <section className="temtem-name-container">
          <p>#{temtemNumber}</p>
          <p>{temtem.name}</p>
        </section>

        <section className="temtem-type-container">
          {temtem.types.map(type => (
            <img
              key={type}
              className="temtem-type"
              src={getTypeIcon(type)}
              title={type}
              alt={type}
            />
          ))}
          <p>
            ({temtem.types.map((type, index) => (
              <span key={type}>
                {type}
                {index < temtem.types.length - 1 ? ', ' : ''}
              </span>
            ))})
          </p>
        </section>

        <div className="divider"></div>

        <section className="temtem-weaknesses-container">
          <p>Weaknesses</p>
          <section className="temtem-weaknesses">
            {matchups.weakTo.map(type => (
              <img
                key={type}
                className="temtem-type"
                src={getTypeIcon(type)}
                title={type}
                alt={type}
              />
            ))}
            <p>
              ({matchups.weakTo.map((type, index) => (
                <span key={type}>
                  {type}
                  {index < matchups.weakTo.length - 1 ? ', ' : ''}
                </span>
              ))})
            </p>
          </section>
        </section>
      </section>
    </section>
  );
};

export default TemtemItem;