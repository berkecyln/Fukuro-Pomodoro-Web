import { useEffect, useRef } from "react";
import "./Timer.css";

export default function Timer({
  sessionSound,
  breakSound,
  sessionDuration,
  setSessionDuration,
  breakDuration,
  setBreakDuration,
  sessionsCount,
  setSessionsCount,
  timeLeft,
  setTimeLeft,
  isRunning,
  setIsRunning,
  isBreak,
  setIsBreak,
  currentSession,
  setCurrentSession,
  currentBreak,
  setCurrentBreak,
}) {
  // ---------------- Timer state (now from props) ----------------
  const intervalRef = useRef(null);
  const breaksCount = sessionsCount - 1;

  // “Fresh” UI state (keeps sliders visible until first start)
  const isInitialState =
    !isRunning &&
    timeLeft === sessionDuration * 60 &&
    currentSession === 1 &&
    currentBreak === 0;

  // ---------------- Audio refs ----------------
  const sessionBgRef = useRef(null);
  const sessionBgRef2 = useRef(null);
  const breakBgRef = useRef(null);
  const breakBgRef2 = useRef(null);
  const activeSessionRef = useRef(1); // 1 or 2
  const activeBreakRef = useRef(1); // 1 or 2

  // One-shots
  const dingRef = useRef(new Audio("/sounds/ding.wav"));
  const alarmRef = useRef(new Audio("/sounds/alarm.wav"));
  const hasDingedRef = useRef(false);

  // Simple fade helpers (no extra safety — just readable & small)
  const fadeIn = (audio, target = 0.5, ms = 1000) => {
    if (!audio) return;
    audio.volume = 0;
    audio.play().catch(() => {});
    const steps = 50;
    const step = (target - 0) / steps;
    const interval = ms / steps;
    let i = 0;
    const id = setInterval(() => {
      i++;
      audio.volume = Math.min(target, audio.volume + step);
      if (i >= steps) clearInterval(id);
    }, interval);
  };

  const fadeOut = (audio, ms = 1000) => {
    if (!audio || audio.volume === 0) return;
    const startVolume = audio.volume;
    const steps = 50;
    const step = startVolume / steps;
    const interval = ms / steps;
    let i = 0;
    const id = setInterval(() => {
      i++;
      audio.volume = Math.max(0, startVolume - step * i);
      if (i >= steps || audio.volume <= 0) {
        clearInterval(id);
        audio.volume = 0;
        audio.pause();
        audio.currentTime = 0;
      }
    }, interval);
  };

  const crossfade = (audioOut, audioIn, ms = 1000) => {
    if (!audioOut || !audioIn) return;

    const startVolumeOut = audioOut.volume;
    const targetVolumeIn = 0.5;
    const steps = 50;
    const stepOut = startVolumeOut / steps;
    const stepIn = targetVolumeIn / steps;
    const interval = ms / steps;

    // Start the new audio
    audioIn.currentTime = 0;
    audioIn.volume = 0;
    audioIn.play().catch(() => {});

    let i = 0;
    const id = setInterval(() => {
      i++;
      audioOut.volume = Math.max(0, startVolumeOut - stepOut * i);
      audioIn.volume = Math.min(targetVolumeIn, stepIn * i);

      if (i >= steps) {
        clearInterval(id);
        audioOut.pause();
        audioOut.currentTime = 0;
        audioOut.volume = 0;
      }
    }, interval);
  };

  const srcFor = (key) => {
    if (!key || key === "none") return null;
    const map = {
      rain: "/sounds/rain.mp3",
      fire: "/sounds/fire.mp3",
      piano: "/sounds/piano.mp3",
    };
    return map[key] || null;
  };

  // Build/refresh background audio whenever selection changes
  useEffect(() => {
    // Clean up session audio
    if (sessionBgRef.current) {
      sessionBgRef.current.pause();
      sessionBgRef.current = null;
    }
    if (sessionBgRef2.current) {
      sessionBgRef2.current.pause();
      sessionBgRef2.current = null;
    }

    const s = srcFor(sessionSound);
    if (s) {
      // Create two instances for crossfading
      const a1 = new Audio(s);
      const a2 = new Audio(s);
      a1.volume = 0;
      a2.volume = 0;

      // Set up crossfade looping for first instance
      a1.addEventListener("timeupdate", () => {
        if (a1.currentTime >= a1.duration - 1) {
          if (activeSessionRef.current === 1) {
            activeSessionRef.current = 2;
            crossfade(a1, a2, 800);
          }
        }
      });

      // Set up crossfade looping for second instance
      a2.addEventListener("timeupdate", () => {
        if (a2.currentTime >= a2.duration - 1) {
          if (activeSessionRef.current === 2) {
            activeSessionRef.current = 1;
            crossfade(a2, a1, 800);
          }
        }
      });

      sessionBgRef.current = a1;
      sessionBgRef2.current = a2;
    }

    // Clean up break audio
    if (breakBgRef.current) {
      breakBgRef.current.pause();
      breakBgRef.current = null;
    }
    if (breakBgRef2.current) {
      breakBgRef2.current.pause();
      breakBgRef2.current = null;
    }

    const b = srcFor(breakSound);
    if (b) {
      // Create two instances for crossfading
      const b1 = new Audio(b);
      const b2 = new Audio(b);
      b1.volume = 0;
      b2.volume = 0;

      // Set up crossfade looping for first instance
      b1.addEventListener("timeupdate", () => {
        if (b1.currentTime >= b1.duration - 1) {
          if (activeBreakRef.current === 1) {
            activeBreakRef.current = 2;
            crossfade(b1, b2, 800);
          }
        }
      });

      // Set up crossfade looping for second instance
      b2.addEventListener("timeupdate", () => {
        if (b2.currentTime >= b2.duration - 1) {
          if (activeBreakRef.current === 2) {
            activeBreakRef.current = 1;
            crossfade(b2, b1, 800);
          }
        }
      });

      breakBgRef.current = b1;
      breakBgRef2.current = b2;
    }

    // If already running, re-start current phase bg (fade in)
    if (isRunning) {
      const target = isBreak ? breakBgRef.current : sessionBgRef.current;
      if (target) fadeIn(target);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionSound, breakSound]);

  // Start: fade in current phase bg. Pause: stop immediately (no fade).
  useEffect(() => {
    if (!isRunning) {
      // stop all audio instances immediately on pause
      [
        sessionBgRef.current,
        sessionBgRef2.current,
        breakBgRef.current,
        breakBgRef2.current,
      ].forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
          audio.volume = 0;
        }
      });
      // Reset active refs
      activeSessionRef.current = 1;
      activeBreakRef.current = 1;
      return;
    }

    // running → fade in the relevant bg (always start with first instance)
    const bg = isBreak ? breakBgRef.current : sessionBgRef.current;
    if (bg) {
      activeSessionRef.current = 1;
      activeBreakRef.current = 1;
      fadeIn(bg);
    }
  }, [isRunning, isBreak]);

  // reset the flag whenever we’re safely far from the end (>10s)
  useEffect(() => {
    if (timeLeft > 10) hasDingedRef.current = false;
  }, [timeLeft]);

  // single ding at exactly 10s remaining
  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft === 10 && !hasDingedRef.current) {
      hasDingedRef.current = true;
      dingRef.current.volume = 0.6;
      dingRef.current.currentTime = 0;
      dingRef.current.play().catch(() => {});
    }
  }, [timeLeft, isRunning]);

  // Fade out near end of each phase (start at 5s)
  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft === 5) {
      // Fade out both instances to be safe
      if (isBreak) {
        if (breakBgRef.current) fadeOut(breakBgRef.current, 5000);
        if (breakBgRef2.current) fadeOut(breakBgRef2.current, 5000);
      } else {
        if (sessionBgRef.current) fadeOut(sessionBgRef.current, 5000);
        if (sessionBgRef2.current) fadeOut(sessionBgRef2.current, 5000);
      }
    }
  }, [timeLeft, isRunning, isBreak]);

  // ---------------- Timer loop (refactored to fix race condition) ----------------

  // Hook 1: Manages the ticking of the timer interval.
  // Its only job is to decrement timeLeft every second when running.
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 0) {
            return prev - 1;
          }
          return prev;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, setTimeLeft]); // Removed timeLeft from dependencies!

  // Hook 2: Manages the phase transitions (session -> break, break -> session).
  // It runs only when timeLeft changes and acts only when timeLeft hits 0.
  useEffect(() => {
    if (timeLeft !== 0 || !isRunning) return; // Guard clause: only act at zero when running

    // Play alarm sound
    alarmRef.current.volume = 0.8;
    alarmRef.current.currentTime = 0;
    alarmRef.current.play().catch(() => {});

    // Stop all current audio before phase transition
    [
      sessionBgRef.current,
      sessionBgRef2.current,
      breakBgRef.current,
      breakBgRef2.current,
    ].forEach((audio) => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0;
      }
    });

    if (!isBreak) {
      // End of a Session
      if (currentSession < sessionsCount) {
        // Start break after this session (don't increment currentSession yet)
        setIsBreak(true);
        setCurrentBreak(currentSession);
        setTimeLeft(breakDuration * 60);
      } else {
        // All sessions finished
        setIsRunning(false);
        setIsBreak(false);
        setCurrentSession(1);
        setCurrentBreak(0);
        setTimeLeft(sessionDuration * 60);
      }
    } else {
      // End of a Break → start next session (NOW increment currentSession)
      setIsBreak(false);
      setCurrentSession((p) => p + 1);
      // Reset audio refs for new session
      activeSessionRef.current = 1;
      setTimeLeft(sessionDuration * 60);
    }
  }, [
    timeLeft,
    isRunning,
    isBreak,
    currentSession,
    sessionsCount,
    breakDuration,
    sessionDuration,
    setTimeLeft,
    setIsBreak,
    setCurrentSession,
    setCurrentBreak,
    setIsRunning,
  ]);

  // ---------------- UI helpers & handlers ----------------
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const adjustBreakDuration = (inc) => {
    if (!isRunning) {
      const v = Math.max(1, Math.min(30, breakDuration + inc));
      setBreakDuration(v);
      if (isBreak) setTimeLeft(v * 60);
    }
  };

  const adjustSessionsCount = (inc) => {
    if (!isRunning) {
      const v = Math.max(1, Math.min(10, sessionsCount + inc));
      setSessionsCount(v);
    }
  };

  const toggleTimer = () => setIsRunning((r) => !r);

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setCurrentSession(1);
    setCurrentBreak(0);
    setTimeLeft(sessionDuration * 60);
    // Stop all audio instances immediately (no fade)
    [
      sessionBgRef.current,
      sessionBgRef2.current,
      breakBgRef.current,
      breakBgRef2.current,
    ].forEach((audio) => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0;
      }
    });
    // Reset active refs
    activeSessionRef.current = 1;
    activeBreakRef.current = 1;
  };

  // ---------------- Render ----------------
  return (
    <div className="timer">
      <div className="timer-content">
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
                const v = parseInt(e.target.value, 10);
                setSessionDuration(v);
                if (!isBreak) setTimeLeft(v * 60);
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
    </div>
  );
}
