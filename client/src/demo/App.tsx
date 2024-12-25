import { useState } from 'react'
import './App.css'
import PalamanderSpawner from '../palamander/view/PalamanderSpawner.tsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Boilerplate Placeholder: Palamander Zoo</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <PalamanderSpawner/>
    </>
  )
}

export default App
