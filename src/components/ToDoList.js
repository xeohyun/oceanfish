import React, { useEffect, useState } from 'react';
import '../css/ToDoList.css';

function ToDoList() {
    const [isExpanded, setIsExpanded] = useState(false); // Collapsible state
    const [tasks, setTasks] = useState(() => {
        // 브라우저가 저장한 tasks 데이터 로드
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });
    const [newTask, setNewTask] = useState(''); // Input for new tasks
    const [newTaskTime, setNewTaskTime] = useState(''); // Input for task time

    const toggleExpand = () => setIsExpanded(!isExpanded); // Toggle view

    const addTask = () => {
        if (newTask.trim()) {
            const updatedTasks = [
                ...tasks,
                {
                    id: tasks.length + 1,
                    text: newTask,
                    completed: false,
                    time: newTaskTime || '', // 시간 값이 없으면 빈 문자열
                },
            ];
            setTasks(updatedTasks);
            localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // localStorage에 저장
            setNewTask('');
            setNewTaskTime('');
        }
    };

    const deleteTask = (taskId) => {
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // localStorage에 저장
    };

    const toggleTaskCompletion = (taskId) => {
        const updatedTasks = tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // localStorage에 저장
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // 기본 엔터 동작 방지 (예: 폼 제출)
            addTask();
        }
    };

    useEffect(() => {
        // 초기화 시간을 계산
        const now = new Date();
        const nextMidnight = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1,
            0, // 0시 0분
            0,
            0
        );
        const timeUntilNextMidnight = nextMidnight - now;

        // 다음 정오에 초기화 타이머 설정
        const timer = setTimeout(() => {
            setTasks([]); // 작업 초기화
            localStorage.removeItem('tasks'); // localStorage에서도 초기화
            setInterval(() => {
                setTasks([]);
                localStorage.removeItem('tasks');
            }, 24 * 60 * 60 * 1000); // 이후 매일 정오에 초기화
        }, timeUntilNextMidnight);

        // 컴포넌트 언마운트 시 타이머 정리
        return () => clearTimeout(timer);
    }, []);

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
                                    {task.time && <span className="todo-time">{task.time}</span>}
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
                            onKeyDown={handleKeyPress} // Enter key 이벤트 핸들러
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
