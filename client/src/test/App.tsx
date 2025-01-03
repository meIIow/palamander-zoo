import { useState } from 'react'
import PalamanderGrid from '../palamander/view/PalamanderGrid.tsx'

function App() {
  const [speed, setSpeed] = useState(false)
  const [turn, setTurn] = useState(false)
  const [reset, setReset] = useState(0)

  return (
    <>
      <div className="card">
        <button onClick={() => setSpeed((speed) => !speed)}>
          Toggle Speed
        </button>
      </div>
      <div className="card">
        <button onClick={() => setTurn((turn) => !turn)}>
          Toggle Turn
        </button>
      </div>
      <div className="card">
        <button onClick={() => setReset((reset) => reset+1)}>
          Respawn
        </button>
      </div>
      <PalamanderGrid supress={{ turn, speed }} reset={reset}/>
    </>
  )
}

export default App
