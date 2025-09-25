import "./App.css";

import Timer from "./components/Timer/Timer.jsx";
import TodoList from "./components/Todo/TodoList.jsx";
import SoundPlayer from "./components/SoundPlayer/SoundPlayer.jsx";
import ProgressBar from "./components/ProgressBar/ProgressBar.jsx";

function App() {
  return (
    <>
      <div className="app">
        <h1 className="app-title">Fukuro App</h1>
        <div className="components-container">
          <div className="left-section">
            <SoundPlayer />
            <ProgressBar />
          </div>
          <div className="middle-section">
            <Timer />
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
