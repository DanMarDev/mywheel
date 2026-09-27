import { useRef, useEffect } from 'react'
import { Wheel } from 'spin-wheel'
import './App.css'


function App() {
  const containerRef = useRef(null)
  const wheelExists = useRef(false)

  useEffect(() => {
    if (containerRef.current && !wheelExists.current) {
      // 1. Configure the wheel's properties:
      const props = {
        items: [
          {
            label: 'one',
          },
          {
            label: 'two',
          },
          {
            label: 'three',
          },
        ]
      }
      const container = containerRef.current;
      wheelExists.current = true;
      const wheel = new Wheel(container, props);
    }
  }, []);

  return (
    <>

      <section id="main-section">
        <a href="#" className="hoverlinks">
          mywheel-js
        </a>
        <div className="wheel-container" ref={containerRef}   >
        </div>
      </section>
    </>
  )
}

export default App
