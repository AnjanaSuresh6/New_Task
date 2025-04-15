// File: src/components/TaskApp.jsx

import React, { useState, useEffect } from "react";
import { format } from "date-fns";

const getTodayDate = () => format(new Date(), "yyyy-MM-dd");

const TaskApp = () => {
  const [tasks, setTasks] = useState({});
  const [input, setInput] = useState("");
  const [streak, setStreak] = useState(0);

  const today = getTodayDate();

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || {};
    const storedStreak = Number(localStorage.getItem("streak")) || 0;
    const lastDate = localStorage.getItem("lastDate");

    if (lastDate && lastDate !== today) {
      const yesterday = format(new Date(Date.now() - 86400000), "yyyy-MM-dd");
      if (!storedTasks[yesterday]) {
        setStreak(0);
        localStorage.setItem("streak", "0");
      }
    }

    setTasks(storedTasks);
    setStreak(storedStreak);
  }, [today]);

  const saveToLocalStorage = (updatedTasks, updatedStreak) => {
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    localStorage.setItem("streak", String(updatedStreak));
    localStorage.setItem("lastDate", today);
  };

  const addTask = () => {
    if (!input.trim()) return;
    const updatedTasks = { ...tasks };
    if (!updatedTasks[today]) {
      updatedTasks[today] = [];
      const newStreak = streak + 1;
      setStreak(newStreak);
      saveToLocalStorage(updatedTasks, newStreak);
    } else {
      saveToLocalStorage(updatedTasks, streak);
    }
    updatedTasks[today].push(input.trim());
    setTasks(updatedTasks);
    setInput("");
  };

  const editTask = (index, newText) => {
    const updatedTasks = { ...tasks };
    updatedTasks[today][index] = newText;
    setTasks(updatedTasks);
    saveToLocalStorage(updatedTasks, streak);
  };

  const deleteTask = (index) => {
    const updatedTasks = { ...tasks };
    updatedTasks[today].splice(index, 1);
    if (updatedTasks[today].length === 0) {
      delete updatedTasks[today];
      setStreak(0);
      saveToLocalStorage(updatedTasks, 0);
    } else {
      saveToLocalStorage(updatedTasks, streak);
    }
    setTasks(updatedTasks);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Daily Task Tracker</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add your task for today"
          style={{ padding: "8px", width: "70%", marginRight: "10px" }}
        />
        <button onClick={addTask} style={{ padding: "8px 12px" }}>Add Task</button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "18px" }}>Today's Tasks ({today})</h2>
        {tasks[today]?.length ? (
          tasks[today].map((task, index) => (
            <div key={index} style={{ display: "flex", marginTop: "10px" }}>
              <input
                type="text"
                value={task}
                onChange={(e) => editTask(index, e.target.value)}
                style={{ flex: 1, padding: "6px" }}
              />
              <button onClick={() => deleteTask(index)} style={{ marginLeft: "10px", padding: "6px 10px" }}>
                Delete
              </button>
            </div>
          ))
        ) : (
          <p style={{ color: "gray" }}>No tasks for today.</p>
        )}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "18px" }}>Task Summary</h2>
        {Object.keys(tasks).length ? (
          <ul>
            {Object.entries(tasks).map(([date, taskList]) => (
              <li key={date}>
                <strong>{date}:</strong> {taskList.join(", ")}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "gray" }}>No tasks added yet.</p>
        )}
      </div>

      <div>
        <p style={{ fontSize: "18px" }}>Current Streak: {streak} day(s)</p>
      </div>
    </div>
  );
};

export default TaskApp;
