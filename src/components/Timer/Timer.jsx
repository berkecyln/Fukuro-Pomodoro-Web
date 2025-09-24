import { useState, useEffect, useRef } from "react";
import "./Timer.css";

export default function Timer() {
  const [sessionDuration, setSessionDuration] = useState(25); // minutes
  const [breakDuration, setBreakDuration] = useState(5); // minutes
  const [sessionsCount, setSessionsCount] = useState(4); // number of sessions
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [currentSession, setCurrentSession] = useState(1);
  const [currentBreak, setCurrentBreak] = useState(0);
  const intervalRef = useRef(null);

  // Break count is automatically session count - 1
  const breaksCount = sessionsCount - 1;

  // Check if we're in initial state (fresh start)
  const isInitialState =
    !isRunning &&
    timeLeft === sessionDuration * 60 &&
    currentSession === 1 &&
    currentBreak === 0;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Switch between session and break
            if (!isBreak) {
              // Finished a session, start break if more breaks available
              if (currentSession < sessionsCount) {
                setIsBreak(true);
                setCurrentBreak(currentSession); // Set break number to current session number
                return breakDuration * 60;
              } else {
                // All sessions completed
                setIsRunning(false);
                return sessionDuration * 60;
              }
            } else {
              // Finished a break, start next session
              setIsBreak(false);
              setCurrentSession((prev) => prev + 1);
              return sessionDuration * 60;
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [
    isRunning,
    sessionDuration,
    breakDuration,
    isBreak,
    currentSession,
    currentBreak,
    sessionsCount,
    breaksCount,
  ]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const adjustBreakDuration = (increment) => {
    if (!isRunning) {
      const newDuration = Math.max(1, Math.min(30, breakDuration + increment));
      setBreakDuration(newDuration);
      if (isBreak) {
        setTimeLeft(newDuration * 60);
      }
    }
  };

  const adjustSessionsCount = (increment) => {
    if (!isRunning) {
      const newCount = Math.max(1, Math.min(10, sessionsCount + increment));
      setSessionsCount(newCount);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setCurrentSession(1);
    setCurrentBreak(0);
    setTimeLeft(sessionDuration * 60);
  };

  return (
    <div className="timer">
      <div className="timer-display">
        <div className="timer-time">{formatTime(timeLeft)}</div>
        <div className="timer-label">
          {isBreak
            ? `Break ${currentBreak}/${breaksCount}`
            : `Session ${currentSession}/${sessionsCount}`}
        </div>
        <div
          className={`timer-duration-controls collapsible ${
            isInitialState ? "is-visible" : "is-hidden"
          }`}
        >
          <input
            type="range"
            min="1"
            max="60"
            value={sessionDuration}
            onChange={(e) => {
              const newDuration = parseInt(e.target.value);
              setSessionDuration(newDuration);
              if (!isBreak) setTimeLeft(newDuration * 60);
            }}
            className="duration-slider"
          />
        </div>
      </div>

      <div
        className={`timer-controls collapsible ${
          isInitialState ? "is-visible" : "is-hidden"
        }`}
      >
        <div className="timer-control">
          <div className="control-label">Session Amount</div>
          <div className="control-value">x{sessionsCount}</div>
          <div className="control-buttons">
            <button
              className="control-btn"
              onClick={() => adjustSessionsCount(-1)}
            >
              −
            </button>
            <button
              className="control-btn"
              onClick={() => adjustSessionsCount(1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="timer-control">
          <div className="control-label">Break Duration</div>
          <div className="control-value">{breakDuration}m</div>
          <div className="control-buttons">
            <button
              className="control-btn"
              onClick={() => adjustBreakDuration(-1)}
            >
              −
            </button>
            <button
              className="control-btn"
              onClick={() => adjustBreakDuration(1)}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="timer-actions fade-in">
        {isInitialState ? (
          <button className="start-button" onClick={toggleTimer}>
            Start
          </button>
        ) : isRunning ? (
          <button className="start-button active" onClick={toggleTimer}>
            Pause
          </button>
        ) : (
          <>
            <button className="start-button" onClick={toggleTimer}>
              Resume
            </button>
            <button className="reset-button" onClick={resetTimer}>
              Reset
            </button>
          </>
        )}
      </div>
    </div>
  );
}
