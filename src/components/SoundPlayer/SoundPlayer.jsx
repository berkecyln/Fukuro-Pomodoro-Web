import "./SoundPlayer.css";

export default function SoundPlayer() {
  return (
    <div className="sound-player">
      <h2 className="sound-header">Background Sound</h2>
      <div className="sound-controls">
        <p className="sound-label">Session</p>
        <select className="sound-select">
          <option value="none">No sound</option>
          <option value="rain">Rain</option>
          <option value="fire">Crackling</option>
        </select>
        <button className="demo-button">▶</button>
      </div>
      <div className="sound-controls">
        <p className="sound-label">Break</p>
        <select className="sound-select">
          <option value="none">No sound</option>
          <option value="piano">Piano</option>
        </select>
        <button className="demo-button">▶</button>
      </div>
    </div>
  );
}
