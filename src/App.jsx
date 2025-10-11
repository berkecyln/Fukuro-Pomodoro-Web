import { useState } from "react";
import "./App.css";

import Timer from "./components/Timer/Timer.jsx";
import TodoList from "./components/Todo/TodoList.jsx";
import SoundPlayer from "./components/SoundPlayer/SoundPlayer.jsx";
import ProgressLadder from "./components/ProgressLadder/ProgressLadder.jsx";

function App() {
  const [sessionSound, setSessionSound] = useState("none");
  const [breakSound, setBreakSound] = useState("none");

  // Timer state lifted up to be shared with ProgressLadder
  const [sessionDuration, setSessionDuration] = useState(25); // minutes
  const [breakDuration, setBreakDuration] = useState(5); // minutes
  const [sessionsCount, setSessionsCount] = useState(4); // number of sessions
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [currentSession, setCurrentSession] = useState(1);
  const [currentBreak, setCurrentBreak] = useState(0);

  return (
    <>
      <div className="app">
        <h1 className="app-title">Fukuro App</h1>
        <div className="components-container">
          <div className="left-section">
            <SoundPlayer
              sessionSound={sessionSound}
              setSessionSound={setSessionSound}
              breakSound={breakSound}
              setBreakSound={setBreakSound}
            />
            <ProgressLadder
              sessionsCount={sessionsCount}
              currentSession={currentSession}
              sessionDuration={sessionDuration}
              timeLeft={timeLeft}
              isBreak={isBreak}
              isRunning={isRunning}
            />
          </div>
          <div className="middle-section">
            <Timer
              sessionSound={sessionSound}
              breakSound={breakSound}
              sessionDuration={sessionDuration}
              setSessionDuration={setSessionDuration}
              breakDuration={breakDuration}
              setBreakDuration={setBreakDuration}
              sessionsCount={sessionsCount}
              setSessionsCount={setSessionsCount}
              timeLeft={timeLeft}
              setTimeLeft={setTimeLeft}
              isRunning={isRunning}
              setIsRunning={setIsRunning}
              isBreak={isBreak}
              setIsBreak={setIsBreak}
              currentSession={currentSession}
              setCurrentSession={setCurrentSession}
              currentBreak={currentBreak}
              setCurrentBreak={setCurrentBreak}
            />
          </div>
          <div className="right-section">
            <TodoList />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
