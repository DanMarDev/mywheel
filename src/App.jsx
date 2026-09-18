import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <h1>
          mywheel-js
        </h1>
      <div className="ticks"></div>
      <section id="spacer"></section>
      </section>
    </>
  )
}

export default App
