import { useState } from 'react';
import './TemtemItem.css';

const TemtemItem = ({ temtem, temtemTypes, isDetailView = false }) => {
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

        {/* Battle Tips */}
        <div className="temtem-battle-tips">
          <div className="temtem-battle-tip">
            <span className="tip-icon">💡</span>
            <p>
              Use attacks that are <strong className="text-weakness">weak to</strong> for maximum damage, 
              avoid attacks that are <strong className="text-resistance">resistant to</strong>
            </p>
          </div>
        </div>
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