import './App.css';
import { useState } from 'react';
import Display from './Display';
import Button from './Button';


function Greeting({ name }) {
  console.log(name);
  return (
    <div>
      <p>
        this is from {name}
      </p>
    </div>
  )
}





function App() {
  const now = new Date()
  // const [counter, setCounter] = useState(0)
  const [number, setNumber] = useState(0)
  const [clicks, setClicks] = useState({
    left: 0,
    right: 0
  })

  const toLeft = () => setClicks({
    left: clicks.left + 1,
    right: clicks.right
  })

  const toRight = () => setClicks({
    ...clicks,
    right: clicks.right + 1
  })

  // setTimeout(() => setCounter(counter + 1), 1000)

  const addBy100 = () => setNumber(number + 100)
  const reset0 = () => setNumber(0)

  return (
    <div>
      <p className='paragraph'>
        Hello World
      </p>
      <p>
        Hello World, it is {now.toString()}
      </p>
      <Greeting name='song' />
      {/* <p>{counter}</p> */}
      <Display number={number} />
      <Button text='plus by 100' func={addBy100} />
      <Button text='reset to zero' func={reset0} />
      <p>left is {clicks.left} and right is {clicks.right}</p>
      <button onClick={toLeft}>to left</button>
      <button onClick={toRight}>to right</button>
    </div >
  );
}

export default App;

