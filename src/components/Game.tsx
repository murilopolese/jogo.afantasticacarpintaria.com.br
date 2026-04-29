// src/components/Game.tsx

import React, { useMemo, useState, useEffect } from 'react';
import './Game.css';

import background from '../assets/background.png';
import coletor from '../assets/coletor.png';
import trituradora from '../assets/trituradora.png';
import extrusora from '../assets/extrusora.png';
import clock from '../assets/clock.png';
import Rugged from './ui/Rugged';
import ProgressBar from './ui/ProgressBar';

import sideL from '../assets/sidel.png';
import sideR from '../assets/sider.png';

/* ------------------------------------------------------------------ */
/*  Constants – keep the original ones for shred / extruder logic   */
const COLLECTOR_CAPACITY = 750;
const SHREDDER_CAPACITY = 3000;
const SHREDDER_LOAD = 500;
const EXTRUDER_CAPACITY = 3;
const EXTRUDER_LOAD = 1000;

const RUN_TIME = 3000;             // MACHINE TIMEOUT

/* ------------------------------------------------------------------ */

/* ---------- Props --------------------------------- */
interface GameProps {
  /** Callback invoked when the global countdown finishes. */
  onGameOver: () => void;
  /** Callback invoked when ready and deliver button clicked. */
  onDeliver?: () => void;          // optional
  missionTimeout: number
}

const Game: React.FC<GameProps> = ({ onGameOver, onDeliver, missionTimeout }) => {
  /* --- State for all game stages --------------------------------- */
  const [ collected, setCollected ] = useState(0);
  const [ shredded, setShredded ] = useState(0);
  const [ ripas, setRipas ] = useState(0);

  const [ shredOn, setShredOn ] = useState(false);
  const [ shredCountDown, setShredCountDown ] = useState(RUN_TIME);
  const [ extrudOn, setExtrudOn ] = useState(false);
  const [ extrudCountDown, setExtrudCountDown ] = useState(RUN_TIME);

  /* --- Global countdown state ------------------------------------- */
  const [ globalOn, setGlobalOn ] = useState(false);
  const [ globalCountDown, setGlobalCountDown ] = useState(missionTimeout);
  const [ globalTimeout, setGlobalTimeout ] = useState(0);

  /* --- Ready flag ----------------------------------------------- */
  const [ ready, setReady ] = useState(false);

  /* ---------- Game logic (collector, shredder, extruder) --------- */
  /** Collect a tampinha and *also* start the global countdown. */
  const handleClickCollected = () => {
    setCollected(prev => Math.min(prev + 50, COLLECTOR_CAPACITY));
    if (!globalOn) {          // start countdown only once
      handleStartGlobal();
    }
  };

  const handleClickShredded = () => {
    if (isShredderAvailable && !shredOn) {
      setShredOn(true);
      setShredCountDown(RUN_TIME);
      const interval = setInterval(() => { setShredCountDown(prev => prev - 1000); }, 1000);
      setCollected(prev => Math.max(prev - SHREDDER_LOAD, 0));
      setTimeout(() => {
        clearInterval(interval);
        setShredOn(false);
        setShredded(prev => Math.min(prev + SHREDDER_LOAD, SHREDDER_CAPACITY));
      }, RUN_TIME);
    }
  };

  const handleClickExtruder = () => {
    if (isExtruderAvailable && !extrudOn) {
      setExtrudOn(true);
      setExtrudCountDown(RUN_TIME);
      const interval = setInterval(() => { setExtrudCountDown(prev => prev - 1000); }, 1000);
      setShredded(prev => Math.max(prev - EXTRUDER_LOAD, 0));
      setTimeout(() => {
        clearInterval(interval);
        setExtrudOn(false);
        setRipas(prev => Math.min(prev + 1, EXTRUDER_CAPACITY));
      }, RUN_TIME);
    }
  };

  /* ---------- Global countdown handler --------------------------- */
  const handleStartGlobal = () => {
    if (!globalOn) {
      clearTimeout(globalTimeout)

      setGlobalOn(true);
      setGlobalCountDown(missionTimeout);

      // Update every second
      const interval = setInterval(() => {
        setGlobalCountDown(prev => prev - 1000);
      }, 1000);

      // When finished, clear timer and navigate
      const timeout = setTimeout(() => {
        clearInterval(interval);
        setGlobalOn(false);
        onGameOver();
      }, missionTimeout);
      setGlobalTimeout(timeout)
    }
  };

  const handleDeliver = () => {
    clearTimeout(globalTimeout)
    if (onDeliver) onDeliver()
  }

  /* ---------- Availability checks ------------------------------- */
  const isShredderAvailable = useMemo(() => collected >= SHREDDER_LOAD, [collected]);
  const isExtruderAvailable = useMemo(() => shredded >= EXTRUDER_LOAD, [shredded]);

  /* --------- Detect readiness ------------------------------------- */
  useEffect(() => {
    if (!ready && ripas >= 3 && globalOn) {
      setReady(true);
    }
  }, [ripas, ready, globalOn]);

  return (
    <div className="gameContainer">
      <img src={sideL} className="side left" />
      <img src={sideR} className="side right" />
      {/* Steps section */}
      <div className="steps">
        <img src={background} className='background' />

        {/* Collector step */}
        <div className="step">
          <div className="timer invisibleTimer" />
          <img src={coletor} className="clickable" onClick={handleClickCollected} />
          <ProgressBar percent={Math.min((collected / COLLECTOR_CAPACITY) * 100, 100)} />
          <div className="text">{collected} <br/> tampinhas coletadas</div>
        </div>

        {/* Shredder step */}
        <div className="step">
          <div className={`timer ${shredOn ? 'on' : 'invisibleTimer'}`}>
            <img className='background' src={clock} />
            <div className="number">{Math.floor(shredCountDown / 1000)}</div>
          </div>
          <img src={trituradora}
               className={`clickable ${shredOn ? 'on' : ''} ${isShredderAvailable?'':'unavailable'}`}
               onClick={handleClickShredded} />
          <ProgressBar percent={Math.min((shredded / SHREDDER_CAPACITY) * 100, 100)} />
          <div className="text">{shredded} <br/> tampinhas trituradas</div>
        </div>

        {/* Extruder step */}
        <div className="step">
          <div className={`timer ${extrudOn ? 'on' : 'invisibleTimer'}`}>
            <img className='background' src={clock} />
            <div className="number">{Math.floor(extrudCountDown / 1000)}</div>
          </div>
          <img src={extrusora}
               className={`clickable ${extrudOn ? 'on' : ''} ${isExtruderAvailable?'':'unavailable'}`}
               onClick={handleClickExtruder} />
          <ProgressBar percent={Math.min((ripas / EXTRUDER_CAPACITY ) * 100, 100)} />
          <div className="text">{ripas} <br/> {ripas == 1 ? 'ripa' : 'ripas'} prontas</div>
        </div>
      </div>

      {/* Mission section with global countdown display */}
      <div className="mission">
        <div className={`timer ${globalOn ? 'on' : ''}`}>
          <img className='background' src={clock} />
          <div className="number">{Math.floor(globalCountDown / 1000)}</div>
        </div>

        <div className="requirements">
          Para fazer a trave é preciso 3 ripas de plástico.
        </div>

        <div className="callToAction">
          Você consegue produzir isso em {Math.floor(missionTimeout/1000)} segundos?
        </div>

        {/* Rugged button – starts the global countdown or delivers if ready */}

        <div className={globalOn && !ready ? 'hidden' : ''}>
          <Rugged onClick={ready ? handleDeliver : handleStartGlobal} >
            {ready ? 'ENTREGAR' : 'COMEÇAR'}
          </Rugged>
        </div>
      </div>
    </div>
  );
};

export default Game;
