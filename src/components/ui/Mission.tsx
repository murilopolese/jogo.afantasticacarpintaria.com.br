// Mission.tsx
import React from 'react';
import './Mission.css';

import corner1 from '../../assets/corner1.png';
import corner2 from '../../assets/corner2.png';
import corner3 from '../../assets/corner3.png';
import corner4 from '../../assets/corner4.png';
import Rugged from './Rugged';

export type MissionProps = {
  onNavigate: () => void;

  illustrationSrc: string;
  illustrationAlt?: string;

  title: string;
  callToAction: string;
  description: string;
  buttonLabel?: string;
};

const Mission: React.FC<MissionProps> = ({
  onNavigate,
  illustrationSrc,
  illustrationAlt = '',
  title,
  callToAction,
  description,
  buttonLabel='CONTINUAR'
}) => {
  const [visible, setVisible] = React.useState(true);

  const handleClick = () => {
    setVisible(false);
  };

  React.useEffect(() => {
    if (!visible) {
      const timer = setTimeout(onNavigate, 500); // 500 ms matches the CSS transition
      return () => clearTimeout(timer);
    }
  }, [visible, onNavigate]);

  const fadeClass = visible ? '' : 'out';

  return (
    <div className={`mission-container ${fadeClass}`}>
      <img src={corner1} className="shape top-left" />
      <img src={corner2} className="shape top-right" />
      <img src={corner4} className="shape bottom-left" />
      <img src={corner3} className="shape bottom-right" />

      <div className="content">
        <div className="text-section">
          <h1 className="title">{title}</h1>

          <p className="bold-text">{callToAction}</p>

          <p className="description">{description}</p>
        </div>

        <div className="illustration">
          <img src={illustrationSrc} alt={illustrationAlt} className="rectangle" />
        </div>
      </div>

      <div className="button">
        <Rugged onClick={handleClick}>{buttonLabel}</Rugged>
      </div>
    </div>
  );
};

export default Mission;
