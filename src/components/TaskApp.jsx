import React, { useState, useEffect } from "react";
import { format } from "date-fns";

const TaskApp = () => {
  const today = format(new Date(), "yyyy-MM-dd");
  const [tasks, setTasks] = useState({});
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (!input.trim()) return;
    setTasks((prev) => ({
      ...prev,
      [today]: [...(prev[today] || []), input],
    }));
    setInput("");
  };

  const handleDelete = (index) => {
    const updated = [...(tasks[today] || [])];
    updated.splice(index, 1);
    setTasks({ ...tasks, [today]: updated });
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Task Tracker for {today}</h1>
      <div className="mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border px-2 py-1 mr-2"
        />
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-1">
          Add Task
        </button>
      </div>
      <ul>
        {(tasks[today] || []).map((task, index) => (
          <li key={index} className="flex justify-between mb-2">
            <span>{task}</span>
            <button
              onClick={() => handleDelete(index)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskApp;
