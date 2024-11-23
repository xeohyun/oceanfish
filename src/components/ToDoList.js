import React, { useState } from 'react';
import '../css/ToDoList.css';

function ToDoList() {
    const [isExpanded, setIsExpanded] = useState(false); // Collapsible state
    const [tasks, setTasks] = useState([
        { id: 1, text: 'Morning walk', completed: false, time: '7:00am' },
        { id: 2, text: 'Meeting with John Doe', completed: false, time: '9:30am' },
        { id: 3, text: 'Buy Pizza from Pizzahut', completed: false, time: '11:00am' },
    ]);
    const [newTask, setNewTask] = useState(''); // Input for new tasks
    const [newTaskTime, setNewTaskTime] = useState(''); // Input for task time

    const toggleExpand = () => setIsExpanded(!isExpanded); // Toggle view

    const addTask = () => {
        if (newTask.trim()) {
            setTasks([
                ...tasks,
                { id: tasks.length + 1, text: newTask, completed: false, time: newTaskTime || 'N/A' },
            ]);
            setNewTask('');
            setNewTaskTime('');
        }
    };

    const deleteTask = (taskId) => {
        setTasks(tasks.filter((task) => task.id !== taskId)); // Remove the task with the given ID
    };

    const toggleTaskCompletion = (taskId) => {
        setTasks(
            tasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            )
        );
    };

    return (
        <div className={`todo-container ${isExpanded ? 'expanded' : ''}`}>
            <button className="todo-toggle" onClick={toggleExpand}>
                {isExpanded ? 'Close' : 'TODO'}
            </button>
            {isExpanded && (
                <div className="todo-card">
                    <h3>{`Tasks for Today (${tasks.length})`}</h3>
                    <ul className="todo-list">
                        {tasks.map((task) => (
                            <li key={task.id} className={`todo-item ${task.completed ? 'completed' : ''}`}>
                                <div className="todo-details">
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => toggleTaskCompletion(task.id)}
                                    />
                                    <span className="todo-text">{task.text}</span>
                                    <span className="todo-time">{task.time}</span>
                                </div>
                                <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                                    &times;
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="todo-input-container">
                        <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="New task..."
                        />
                        <input
                            type="time"
                            value={newTaskTime}
                            onChange={(e) => setNewTaskTime(e.target.value)}
                        />
                        <button onClick={addTask}>Add</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ToDoList;
