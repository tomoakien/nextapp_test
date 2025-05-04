'use client';

import { useState, useEffect } from 'react';

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch('/api/tasks')
      const data = await res.json()
      console.log('[tasks API response]', data);
      setTasks(data)
    }
    fetchTasks()
  }, [])


  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTaskTitle.trim() }),
    })
    const newTask = await res.json()
    setTasks([...tasks, newTask])
    setNewTaskTitle('')
  }


  const handleToggleComplete = async (id: number, completed: boolean) => {
    await fetch('/api/tasks', {
      method: 'PUT',
      body: JSON.stringify({ id, completed: !completed }),
    })
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !completed } : task
    ))
  }

  const handleDelete = async (id: number) => {
    await fetch('/api/tasks', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    })
    setTasks(tasks.filter(task => task.id !== id))
  }



  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">📝 タスク管理アプリ</h1>
  
      <div className="flex mb-6">
        <input
          className="flex-1 border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          type="text"
          placeholder="新しいタスクを入力"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r"
          onClick={handleAddTask}
        >
          追加
        </button>
      </div>
  
      <ul className="space-y-2">
        {tasks.map(task => (
          <li
            key={task.id}
            className="flex items-center justify-between bg-white shadow-sm border border-gray-200 px-4 py-2 rounded"
          >
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task.id, task.completed)}
                className="w-4 h-4"
              />
              <span className={task.completed ? 'line-through text-gray-400' : ''}>
                {task.title}
              </span>
            </div>
            <button
              onClick={() => handleDelete(task.id)}
              className="text-red-500 hover:text-red-700 text-lg"
              title="削除"
            >
              🗑
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
  
}
