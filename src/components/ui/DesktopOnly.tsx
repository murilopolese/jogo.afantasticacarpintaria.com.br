// Mission.tsx
import React from 'react';
import './DesktopOnly.css';

type DesktopOnlyProps = {
  title: string;
  callToAction: string;
  description: string;
};

const DesktopOnly: React.FC<DesktopOnlyProps> = ({
  title,
  callToAction,
  description
}) => {
  
  return (
    <div className={`desktop-only-container`}>
      <div className="content">
        <div className="text-section">
          <h1 className="title">{title}</h1>

          <p className="bold-text">{callToAction}</p>

          <p className="description">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default DesktopOnly;
