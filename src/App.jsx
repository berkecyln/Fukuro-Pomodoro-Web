import "./App.css";

import Timer from "./components/Timer/Timer.jsx";
import TodoList from "./components/Todo/TodoList.jsx";
import SoundPlayer from "./components/SoundPlayer/SoundPlayer.jsx";

function App() {
  return (
    <>
      <div className="app">
        <h1 className="app-title">Fukuro App</h1>
        <div className="components-container">
          <SoundPlayer />
          <Timer />
          <TodoList />
        </div>
      </div>
    </>
  );
}

export default App;
