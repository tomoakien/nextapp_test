'use client';
/*
Next.jsの**App Router（/appディレクトリ配下）**では、
**デフォルトはサーバーサイド（SSR）**で動きます。
なので、こう書かないと**「useStateなどのクライアント専用機能」が使えない**。
意味：
「このファイル（ページ）はブラウザ側（クライアント）で動かすよ」という宣言。
*/
import { useState, useEffect } from 'react';
/*
React標準機能の**useState（状態管理フック）**を使う宣言です。
これにより、「タスク一覧」などのデータをブラウザメモリ上に保持できるようになる。
*/
type Task = {
  id: number;
  title: string;
  completed: boolean;
};
/*これはtypescriptの型宣言 */

export default function Home() {
  /*
Homeコンポーネントを定義して、それをデフォルトエクスポートしてる。
「export default」は、このファイルで1個だけ"主役"の関数を外部に出す、という意味。
Next.jsでは、
/app/page.tsx に export defaultされたコンポーネントが
自動的に**トップページ ("/")**に対応する仕組みになってる。
まとめ：「トップページに表示するコンポーネント(Home)を定義して外に出している」
  */
  const [tasks, setTasks] = useState<Task[]>([]);
  /*
**tasks＝タスク一覧（配列）**のデータを持つ
setTasks＝そのタスク一覧を更新する関数
初期値は[]（空の配列）
<Task[]> と書くことで、「この配列はTask型のデータを入れる」と型制約をかけてる
まとめ：「タスクのリストをメモリ上に管理するuseState」
  */
  const [newTaskTitle, setNewTaskTitle] = useState('');
  /*
新しく入力中のタスクのタイトルを持つ状態管理。
初期値は''（空文字列）
setNewTaskTitleで、フォームに文字を入力するたびに更新する。
まとめ：「ユーザーが今書いてるタスクの名前を保持」
  */

  // Supabase APIからGET
  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch('/api/tasks')
      const data = await res.json()
      setTasks(data)
    }
    fetchTasks()
  }, [])

  //POST
  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return
    const res = await fetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: newTaskTitle.trim() }),
    })
    const newTask = await res.json()
    setTasks([...tasks, newTask])
    setNewTaskTitle('')
  }


  //   const handleAddTask = () => {
  //     /* タスク追加ボタンを押したときに実行される関数。*/
  //     if (!newTaskTitle.trim()) return;
  //     /* 
  // 入力されたタイトルの前後空白を除去
  // もし完全に空なら何もしないで終了（タスク追加しない）
  //    */
  //     const newTask: Task = {
  //       /*
  //       新しいタスクデータを作っている。
  //       ここで1個のタスクオブジェクト（Task型）を生成してる。 
  //       */
  //       id: Date.now(),/* 今この瞬間のタイムスタンプ（ミリ秒単位）を使って一意のIDを作成している。 */
  //       title: newTaskTitle.trim(), /* ユーザーが入力した文字列を、空白除去してそのままタイトルにセットしている。 */
  //       completed: false, /* まだ完了していないので、初期状態は必ずfalseにする。 */
  //     };
  //     setTasks([...tasks, newTask]);
  //     /*
  //     今のtasks配列を**展開（スプレッド構文）**して
  //     その末尾にnewTaskを追加して、新しい配列にして更新している。
  //     （Reactでは**直接配列をいじらず、「新しい配列を作ってsetする」**のが原則）
  //     */
  //     setNewTaskTitle('');
  //     /*
  //     タスクを追加した後、
  //     フォームの入力欄を空にリセットしている。
  //     */
  //   };

  //PUT
  const handleToggleComplete = async (id: number, completed: boolean) => {
    await fetch('/api/tasks', {
      method: 'PUT',
      body: JSON.stringify({ id, completed: !completed }),
    })
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !completed } : task
    ))
  }


  // const handleToggleComplete = (id: number) => {
  //   setTasks(tasks.map(task =>
  //     task.id === id ? { ...task, completed: !task.completed } : task
  //   ));
  // };
  /*
  id（クリックされたタスクのID）を受け取る
  tasks配列をmap()で全件ループ
  1件ずつtask.idと渡されたidを比較する
  task.id === id（対象タスク）	completedの値を反転させた新しいオブジェクトを返す
  それ以外（対象外タスク）	何も変えずそのまま返す
  */
  const handleDelete = async (id: number) => {
    await fetch('/api/tasks', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    })
    setTasks(tasks.filter(task => task.id !== id))
  }


  // const handleDelete = (id: number) => {
  //   setTasks(tasks.filter(task => task.id !== id));
  // };
  /*
  filter()とは？
  配列の中身をフィルタリング（絞り込み）して新しい配列を作る関数です
  ルールに当てはまったものだけ残す
  task.id !== id（＝削除対象ではないタスク）だけを残す
  つまり
  「削除したいタスク（idが一致するタスク）」を除外して、
  「それ以外のタスクだけ」新しい配列にして残す。
  */

  /*
  Reactでは
「直接配列をいじらないで、新しい配列を作ってstateを更新する」
これが超重要なルールです。（immutable＝不変性）
今回のmap()もfilter()も、**常に「新しい配列」を作っています。
ここがすごく大事なポイントです！
  */

  const [apiMessage, setApiMessage] = useState('');

  // useEffect(() => {
  //   fetch('/api/hello')
  //     .then((res) => res.json())  // 1回目のthen（レスポンスをJSONに変換）
  //     .then((data) => setApiMessage(data.message))  // 2回目のthen（JSONデータを受け取って処理）
  //     .catch((err) => console.error(err));
  //   /*
  //   thenとは
  //   Promise（約束オブジェクト） が「成功（resolved）」した時に実行される処理を指定する
  //   fetch()も、res.json()も、両方Promiseを返してる
  
  //   1個目のthen → レスポンスをJSONに変換する
  //   2個目のthen → 変換後のデータから欲しい情報を取り出す
  
  //   catchとは
  //   Promiseの中でエラーが発生したときに実行される処理を指定する
  //   ネットワークエラーや、APIサーバーからエラー応答が返ったときに発動する
  
  //   then	成功したらこれやって！
  //   catch	失敗したらこれやって！
  //   */
  // }
  // )

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">タスク管理アプリ</h1>
      <p className="mb-4 text-green-600">APIから取得：{apiMessage}</p>
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
