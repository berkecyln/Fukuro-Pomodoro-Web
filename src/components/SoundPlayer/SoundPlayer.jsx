import "./SoundPlayer.css";

export default function SoundPlayer() {
  return (
    <div className="sound-player">
      <h2 className="sound-header">Background Sound</h2>
      <div className="sound-controls">
        <p className="sound-label">Session Sound</p>
        <select>
          <option value="none">No sound</option>
          <option value="rain">Rain</option>
          <option value="fire">Crackling</option>
        </select>
      </div>
      <div className="sound-controls">
        <p className="sound-label">Break Sound</p>
        <select>
          <option value="none">No sound</option>
          <option value="piano">Piano</option>
        </select>
      </div>
    </div>
  );
}
