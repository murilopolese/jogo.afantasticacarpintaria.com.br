// src/main.tsx

import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  HashRouter,
  Routes,
  Route,
  useNavigate
} from 'react-router-dom';
import './index.css';

import Home from './components/Home';
import Mission from './components/ui/Mission';
import { TutorialStep } from './components/TutoriaStep';
import { TutorialNextStep } from './components/TutorialNextStep';
import { TutorialFinalStep } from './components/TutorialFinalStep';
import Game from './components/Game';

import trave from './assets/trave.png';
import DesktopOnly from './components/ui/DesktopOnly';

declare global {
  interface Window {
    umami?: any;
  }
}

const tutorial = [
  {
    title: "Desafio!",
    callToAction: "Sua missão começa agora!",
    description:
      "Antes de colocar a mão na massa, você vai fazer um tour rápido pelas três etapas do processo: coleta, trituração e extrusão. Depois disso, é hora de construir o gol com plástico descartado.",
    illustrationSrc: trave
  },
  {
    title: "Parabéns!",
    callToAction: "O tutorial acabou",
    description:
      "Você já conhece todas as etapas: coleta, trituração e extrusão. Agora é hora de colocar tudo junto e construir o gol com plástico reciclado.",
    illustrationSrc: trave
  }
];

const mission = {
    title: "Nova Encomenda!",
    callToAction: "Você conseguiu! Tem mais trabalho e menos tempo.",
    description: "Você recebeu uma nova ordem para construir a trave com plástico reciclado. No entanto, o prazo é reduzido. Boa sorte!",
    illustrationSrc: trave
}

const gameover = {
  title: "Desafio Não Concluído",
  callToAction: "Não desista – você ainda pode tentar!",
  description:
    "Você não conseguiu entregar a trave dentro do tempo estipulado, mas lembre-se: cada tentativa é uma oportunidade de melhorar. Tente novamente e veja o que você consegue alcançar!",
  illustrationSrc: trave
};

type MissionProps = {
  onNavigate: () => void;
  illustrationSrc: string;
  illustrationAlt?: string;
  title: string;
  callToAction: string;
  description: string;
};

const M: React.FC<MissionProps> = ({
  onNavigate,
  title,
  description,
  callToAction,
  illustrationSrc,
}: MissionProps) => (
  <Mission
    onNavigate={onNavigate}
    title={title}
    description={description}
    callToAction={callToAction}
    illustrationSrc={illustrationSrc}
  />
);

const App: React.FC = () => {
  const [currentTimeout, setCurrentTimeout] = useState(60 * 1000);
  const navigate = useNavigate();

  const isDesktop = typeof navigator !== 'undefined' &&
    !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

  const goToTutorial = () => navigate('/tutorial');
  const goToTutorial1 = () => navigate('/tutorial-1');
  const goToTutorial2 = () => navigate('/tutorial-2');
  const goToTutorial3 = () => navigate('/tutorial-3');
  const goToTutorial4 = () => navigate('/tutorial-4');

  const goToVictory = () => navigate('/vitoria');
  const goToGame = () => navigate('/jogo');
  const goToGameOver = () => navigate('/tente-outra-vez');
  const goToNextMission = () => {
    setCurrentTimeout( (prev) => prev - 10000 );
    navigate('/jogo');
  };

  if (!isDesktop) {
    // Render a fallback message when the user is not on a desktop.
    return <DesktopOnly
            title="Acesso apenas em Desktop"
            callToAction="Por favor, abra no seu computador"
            description="Esta aplicação foi desenvolvida para navegadores de desktop. Se você está usando um dispositivo móvel, por favor utilize um computador."
          />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home onNavigate={goToTutorial} />} />

      <Route path="/tutorial" element={<M onNavigate={goToTutorial1} {...tutorial[0]} />} />
      <Route path="/tutorial-1" element={<TutorialStep onNavigate={goToTutorial2} />} />
      <Route path="/tutorial-2" element={<TutorialNextStep onNavigate={goToTutorial3} />} />
      <Route path="/tutorial-3" element={<TutorialFinalStep onNavigate={goToTutorial4} />} />
      <Route path="/tutorial-4" element={<M onNavigate={goToGame} {...tutorial[1]} />} />

      <Route
        path="/jogo"
        element={
          <Game
            onGameOver={goToGameOver}
            onDeliver={goToVictory}
            missionTimeout={currentTimeout}
          />
        }
      />

      <Route path="/vitoria" element={<M onNavigate={goToNextMission} {...mission} />} />
      <Route path="/tente-outra-vez" element={<M onNavigate={goToGame} {...gameover} />} />
    </Routes>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
