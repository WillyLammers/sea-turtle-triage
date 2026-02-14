import { useGame } from './context/GameContext';
import { Lobby } from './components/Lobby/Lobby';
import { Leaderboard } from './components/Leaderboard/Leaderboard';
import { Emergency } from './components/Emergency/Emergency';
import { NestSurvey } from './components/Stage1/NestSurvey';
import { SurgeTriage } from './components/Stage2/SurgeTriage';
import { LabAnalysis } from './components/Stage3/LabAnalysis';
import { Release } from './components/Stage4/Release';
import { Results } from './components/Results/Results';

export default function App() {
  const { state } = useGame();

  const renderStage = () => {
    switch (state.currentStage) {
      case 0:
        return <Lobby />;
      case 1:
        return <NestSurvey />;
      case 2:
        return <SurgeTriage />;
      case 3:
        return <Release />;
      case 4:
        return <LabAnalysis />;
      case 5:
        return <Results />;
      default:
        return <Lobby />;
    }
  };

  return (
    <>
      {renderStage()}
      {state.currentStage >= 1 && state.currentStage <= 4 && <Leaderboard />}
      {state.emergency && <Emergency />}
    </>
  );
}
