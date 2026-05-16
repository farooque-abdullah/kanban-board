import { useState, useRef } from "react";

const COLUMNS = ["Backlog", "In Progress", "Review", "Done"];

const COLORS = {
  "Backlog": "#6b7280",
  "In Progress": "#6366f1",
  "Review": "#f59e0b",
  "Done": "#10b981",
};

const initialTasks = {
  "Backlog": [
    { id: "t1", title: "Set up design system", tag: "Design", priority: "medium" },
    { id: "t2", title: "Write unit tests for auth module", tag: "Testing", priority: "high" },
    { id: "t3", title: "Research competitor UX patterns", tag: "Research", priority: "low" },
  ],
  "In Progress": [
    { id: "t4", title: "Build dashboard components", tag: "Frontend", priority: "high" },
    { id: "t5", title: "Integrate REST API endpoints", tag: "Backend", priority: "high" },
  ],
  "Review": [
    { id: "t6", title: "Mobile responsive fixes", tag: "Frontend", priority: "medium" },
  ],
  "Done": [
    { id: "t7", title: "Initial project scaffold", tag: "Setup", priority: "low" },
    { id: "t8", title: "Deploy to staging", tag: "DevOps", priority: "medium" },
  ],
};

const TAG_COLORS = {
  Design: "#8b5cf6",
  Testing: "#ef4444",
  Research: "#3b82f6",
  Frontend: "#6366f1",
  Backend: "#f59e0b",
  Setup: "#10b981",
  DevOps: "#14b8a6",
};

const PRIORITY_LABELS = { high: "🔴", medium: "🟡", low: "🟢" };

let idCounter = 100;

export default function KanbanBoard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [dragging, setDragging] = useState(null); // { id, fromCol }
  const [newTask, setNewTask] = useState({ col: null, title: "", tag: "Frontend", priority: "medium" });
  const [darkMode, setDarkMode] = useState(true);

  // Drag & Drop handlers
  const handleDragStart = (id, fromCol) => setDragging({ id, fromCol });

  const handleDrop = (toCol) => {
    if (!dragging || dragging.fromCol === toCol) return setDragging(null);
    setTasks((prev) => {
      const task = prev[dragging.fromCol].find((t) => t.id === dragging.id);
      return {
        ...prev,
        [dragging.fromCol]: prev[dragging.fromCol].filter((t) => t.id !== dragging.id),
        [toCol]: [...prev[toCol], task],
      };
    });
    setDragging(null);
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;
    const task = { id: `t${++idCounter}`, title: newTask.title, tag: newTask.tag, priority: newTask.priority };
    setTasks((prev) => ({ ...prev, [newTask.col]: [...prev[newTask.col], task] }));
    setNewTask({ col: null, title: "", tag: "Frontend", priority: "medium" });
  };

  const deleteTask = (col, id) => {
    setTasks((prev) => ({ ...prev, [col]: prev[col].filter((t) => t.id !== id) }));
  };

  const totalTasks = Object.values(tasks).flat().length;
  const doneTasks = tasks["Done"].length;

  return (
    <div style={{
      minHeight: "100vh",
      background: darkMode ? "#0d0d1a" : "#f1f5f9",
      color: darkMode ? "#e5e7eb" : "#111827",
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        background: darkMode ? "#12121f" : "#ffffff",
        borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`,
        padding: "16px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>📋 TaskFlow</h1>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>
            {doneTasks}/{totalTasks} tasks completed · Sprint 4
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{
            background: "rgba(99,102,241,0.15)", borderRadius: 20,
            padding: "4px 14px", fontSize: 13, color: "#a5b4fc", fontWeight: 600,
          }}>
            {Math.round((doneTasks / totalTasks) * 100)}% done
          </div>
          <button onClick={() => setDarkMode((d) => !d)} style={{
            background: darkMode ? "#1a1a2e" : "#f1f5f9",
            border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
            borderRadius: 8, padding: "7px 14px", cursor: "pointer",
            color: darkMode ? "#e5e7eb" : "#111827", fontSize: 13, fontFamily: "inherit",
          }}>
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {/* Board */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16, padding: 24, minHeight: "calc(100vh - 80px)",
      }}>
        {COLUMNS.map((col) => (
          <div
            key={col}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(col)}
            style={{
              background: darkMode ? "#12121f" : "#ffffff",
              border: `1px solid ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`,
              borderRadius: 14, padding: 16,
              minHeight: 400,
              transition: "background 0.2s",
            }}
          >
            {/* Column Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: COLORS[col], display: "inline-block",
                }} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>{col}</span>
              </div>
              <span style={{
                background: darkMode ? "#1a1a2e" : "#f1f5f9",
                borderRadius: 20, padding: "2px 10px",
                fontSize: 12, fontWeight: 600, color: "#6b7280",
              }}>
                {tasks[col].length}
              </span>
            </div>

            {/* Task Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {tasks[col].map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task.id, col)}
                  style={{
                    background: darkMode ? "#1a1a2e" : "#f8fafc",
                    border: `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                    borderRadius: 10, padding: "12px 14px",
                    cursor: "grab", userSelect: "none",
                    opacity: dragging?.id === task.id ? 0.5 : 1,
                    transition: "box-shadow 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(99,102,241,0.2)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, margin: 0, lineHeight: 1.4 }}>{task.title}</p>
                    <button
                      onClick={() => deleteTask(col, task.id)}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: "#6b7280", fontSize: 16, padding: "0 0 0 8px", flexShrink: 0,
                      }}
                    >×</button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{
                      background: `${TAG_COLORS[task.tag]}22`,
                      color: TAG_COLORS[task.tag],
                      borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600,
                    }}>
                      {task.tag}
                    </span>
                    <span style={{ fontSize: 12 }} title={task.priority}>{PRIORITY_LABELS[task.priority]}</span>
                  </div>
                </div>
              ))}

              {/* Add Task */}
              {newTask.col === col ? (
                <div style={{
                  background: darkMode ? "#1a1a2e" : "#f8fafc",
                  border: `1px dashed ${COLORS[col]}`,
                  borderRadius: 10, padding: 12,
                }}>
                  <input
                    autoFocus
                    placeholder="Task title..."
                    value={newTask.title}
                    onChange={(e) => setNewTask((p) => ({ ...p, title: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === "Enter") addTask(); if (e.key === "Escape") setNewTask({ col: null, title: "", tag: "Frontend", priority: "medium" }); }}
                    style={{
                      width: "100%", background: "transparent", border: "none",
                      color: darkMode ? "#e5e7eb" : "#111827", fontFamily: "inherit",
                      fontSize: 13, outline: "none", marginBottom: 8,
                    }}
                  />
                  <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                    <select
                      value={newTask.tag}
                      onChange={(e) => setNewTask((p) => ({ ...p, tag: e.target.value }))}
                      style={{
                        flex: 1, background: darkMode ? "#0d0d1a" : "#f1f5f9",
                        border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                        borderRadius: 6, color: darkMode ? "#e5e7eb" : "#111827",
                        fontFamily: "inherit", fontSize: 12, padding: "4px 6px",
                      }}
                    >
                      {Object.keys(TAG_COLORS).map((t) => <option key={t}>{t}</option>)}
                    </select>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask((p) => ({ ...p, priority: e.target.value }))}
                      style={{
                        flex: 1, background: darkMode ? "#0d0d1a" : "#f1f5f9",
                        border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                        borderRadius: 6, color: darkMode ? "#e5e7eb" : "#111827",
                        fontFamily: "inherit", fontSize: 12, padding: "4px 6px",
                      }}
                    >
                      <option value="high">🔴 High</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="low">🟢 Low</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={addTask} style={{
                      flex: 1, background: "#6366f1", border: "none", borderRadius: 6,
                      color: "white", fontFamily: "inherit", fontSize: 12,
                      padding: "6px", cursor: "pointer", fontWeight: 600,
                    }}>Add Task</button>
                    <button onClick={() => setNewTask({ col: null, title: "", tag: "Frontend", priority: "medium" })} style={{
                      background: "transparent", border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                      borderRadius: 6, color: "#6b7280", fontFamily: "inherit",
                      fontSize: 12, padding: "6px 10px", cursor: "pointer",
                    }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setNewTask({ col, title: "", tag: "Frontend", priority: "medium" })}
                  style={{
                    width: "100%", background: "transparent",
                    border: `1px dashed ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)"}`,
                    borderRadius: 10, padding: "10px", cursor: "pointer",
                    color: "#6b7280", fontFamily: "inherit", fontSize: 13,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS[col]; e.currentTarget.style.color = COLORS[col]; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)"; e.currentTarget.style.color = "#6b7280"; }}
                >
                  + Add Task
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
