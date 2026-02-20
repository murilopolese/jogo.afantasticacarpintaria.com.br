// src/components/Home.tsx
import * as React from 'react';
import './Home.css';

import Rugged from './ui/Rugged';

import logo from '../assets/logo.png'
import rect1 from '../assets/rect1.svg'
import rect2 from '../assets/rect2.svg'
import rect3 from '../assets/rect3.svg'
import rect4 from '../assets/rect4.svg'
import rect5 from '../assets/rect5.svg'
import patrocinio from '../assets/patrocinio.png'
import lettering from '../assets/lettering.png'

type HomeProps = {
  onNavigate: () => void;
};

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [visible, setVisible] = React.useState(true);

  const handleClick = () => {
    setVisible(false);
  };

  React.useEffect(() => {
    if (!visible) {
      const timer = setTimeout(onNavigate, 500); // match CSS transition
      return () => clearTimeout(timer);
    }
  }, [visible, onNavigate]);

  const fadeClass = visible ? '' : 'out';

  return (
    <div className={`home-container ${fadeClass}`}>

      <div className={`background ${fadeClass}`}>
        <img className="logo" src={logo} />
        <img className='rect rect1' src={rect1} alt="" />
        <img className='rect rect2' src={rect2} alt="" />
        <img className='rect rect3' src={rect3} alt="" />
        <img className='rect rect4' src={rect4} alt="" />
        <img className='rect rect5' src={rect5} alt="" />
      </div>

      <div className={`content ${fadeClass}`}>
        <img className="lettering" src={lettering} />

        <div className="callToAction">
          <div className="text">
            <span>Vamos lá reciclar</span>
            <br />
            <span>resíduos plásticos?</span>
          </div>

          <div className="button">
            <Rugged onClick={handleClick}>INICIAR</Rugged>
          </div>
        </div>

        <div className="footer">
          <div className="horizontalBar"></div>
          <img src={patrocinio} className="sponsors" />
        </div>
      </div>

    </div>
  );
};

export default Home;
