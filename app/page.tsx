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
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">タスク管理アプリ</h1>
      <div className="mb-4">
        <input
          className="border p-2 mr-2"
          type="text"
          placeholder="新しいタスクを入力"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddTask}
        >
          追加
        </button>
      </div>

      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <input
              type="checkbox" checked={task.completed} onChange={() => handleToggleComplete(task.id, task.completed)}
            />
            {task.title}
            <button onClick={() => handleDelete(task.id)}>削除</button>
          </li>
        ))}
      </ul>

    </main>
  );
}
