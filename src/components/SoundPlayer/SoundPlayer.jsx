import { useState } from "react";
import "./SoundPlayer.css";

export default function SoundPlayer() {
  const sounds = {
    rain: new Audio("/sounds/rain.mp3"),
    fire: new Audio("/sounds/fire.mp3"),
    piano: new Audio("/sounds/piano.mp3"),
  };

  const [sessionSound, setSessionSound] = useState("none");
  const [breakSound, setBreakSound] = useState("none");

  const playDemo = (soundKey) => {
    if (soundKey === "none") return;

    const audio = sounds[soundKey];
    audio.currentTime = 0; 
    audio.play();

    // Stop after 5 seconds
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 10000);
  };


  return (
    <div className="sound-player">
      <h2 className="sound-header">Background Sound</h2>
      <div className="sound-controls">
        <p className="sound-label">Session</p>
        <select
          className="sound-select"
          value={sessionSound}
          onChange={(e) => setSessionSound(e.target.value)}
        >
          <option value="none">No sound</option>
          <option value="rain">Rain</option>
          <option value="fire">Crackling</option>
        </select>
        <button className="demo-button"
          onClick={() => playDemo(sessionSound)}
        >▶</button>
      </div>
      <div className="sound-controls">
        <p className="sound-label">Break</p>
        <select
          className="sound-select"
          value={breakSound}
          onChange={(e) => setBreakSound(e.target.value)}
        >
          <option value="none">No sound</option>
          <option value="piano">Piano</option>
        </select>
        <button className="demo-button"
          onClick={() => playDemo(breakSound)}
        >▶</button>
      </div>
    </div>
  );
}
