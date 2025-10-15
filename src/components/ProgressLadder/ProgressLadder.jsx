import "./ProgressLadder.css";

export default function ProgressLadder({
  sessionsCount,
  currentSession,
  sessionDuration,
  timeLeft,
  isBreak,
  isRunning,
}) {
  // Calculate progress for current session (0-100%)
  const calculateCurrentProgress = () => {
    if (isBreak) return 100; // During break, show completed session as 100%

    const totalTime = sessionDuration * 60; // in seconds
    const elapsed = totalTime - timeLeft;
    const progress = Math.max(0, Math.min(100, (elapsed / totalTime) * 100));

    // If we just started a new session (full time remaining), show 0 regardless of running state
    if (timeLeft === totalTime) return 0;

    // If paused and no progress made yet, show 0
    if (!isRunning && progress === 0) return 0;

    // Otherwise show actual progress (maintains progress when paused mid-session)
    return progress;
  };

  const currentProgress = calculateCurrentProgress();

  // Generate array of sessions from bottom to top (1 to N)
  const sessions = Array.from({ length: sessionsCount }, (_, i) => i + 1);

  const getSessionProgress = (sessionNumber) => {
    if (sessionNumber < currentSession) {
      // Completed sessions (sessions before current)
      return 100;
    } else if (sessionNumber === currentSession) {
      // Current session
      if (isBreak) {
        // If we're on break, current session is completed
        return 100;
      } else {
        // If we're actively in session, show progress
        return currentProgress;
      }
    } else {
      // Future sessions
      return 0;
    }
  };

  const getSessionState = (sessionNumber) => {
    if (sessionNumber < currentSession) {
      return "completed";
    } else if (sessionNumber === currentSession) {
      return isBreak ? "on-break" : "active";
    } else {
      return "pending";
    }
  };

  return (
    <div className="progress-ladder">
      <h3 className="ladder-title">Session Progress</h3>
      <div className="ladder-container">
        {sessions.reverse().map((sessionNum) => {
          const progress = getSessionProgress(sessionNum);
          const state = getSessionState(sessionNum);

          return (
            <div key={sessionNum} className={`ladder-row ${state}`}>
              <div className="session-label">Session {sessionNum}</div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="progress-percentage">{Math.round(progress)}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
