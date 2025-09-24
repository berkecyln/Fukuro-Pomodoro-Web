import { useState } from "react";
import "./TodoList.css";

export default function TodoList() {
  const [list, setList] = useState([]); // tasks list
  const [task, setTask] = useState(""); // task input

  // Add a new task
  const addTask = (e) => {
    e.preventDefault(); // prevent reload
    if (task.trim() === "") return; // ignore empty tasks
    // ... -> copy existing tasks in list
    // rest for add new task
    setList([...list, { id: Date.now(), text: task, done: false }]);
    setTask(""); // clear input
  };

  // Toggle done/undone a task
  const toggleTask = (id) => {
    setList(
      // map returns a new array
      // if item id matches, change done property (done/undone)
      // otherwise return item as is
      list.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  // Remove a task
  const removeTask = (id) => {
    // filter over list and return a new array without the item with the given id
    setList(list.filter((item) => item.id !== id));
  };

  return (
    <div className="todo-list">
      <h2>Todo</h2>
      {/*Input task*/}
      <form onSubmit={addTask}>
        <input
          type="text"
          value={task}
          placeholder="Add a new task"
          onChange={(e) => setTask(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      {/*Tasks list*/}
      <ul>
        {list.map((item) => (
          <li key={item.id}>
            <label>
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => toggleTask(item.id)}
              />
              <span style={{ textDecoration: item.done ? "line-through" : "" }}>
                {item.text}
              </span>
            </label>
            <button onClick={() => removeTask(item.id)}>x</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
