## Main Idea:
A minimalist Pomodoro web app with a small to-do list and sound options.  
The main feature is that sessions and breaks follow each other automatically based on defined settings once a session is started.

**Name:** Fukuro (Japanese: “Owl”)  
**Tech Stack:** React, JavaScript
## General Structure:
This is a single-page Pomodoro app with 3 components:
#### Timer
The timer is the main component. It should have a (circular) progress bar with the remaining time displayed in the center.
- The session length, break length, and number of sessions should be configurable.
- After a break, the next session should start automatically (if any remain).
- There should be sound signals: a gentle one for the last 10 seconds of focus or break time, and a stronger one at the end of each session.
#### To-Do List
A simple to-do list where you can add tasks, mark them as done, and see progress.
- A small progress bar can also be included.
#### Sound Player
A small sound player for background audio.
- During focus sessions: play gentle or heavier sounds (like rain, wood crackling).
- During breaks: play soft piano or ambient sounds.
- Sounds should start and stop automatically with sessions.
- Optional: sounds can fade in at the start and fade out at the end of a session.