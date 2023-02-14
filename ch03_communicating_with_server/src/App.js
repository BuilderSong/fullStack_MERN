import { useState, useEffect } from 'react';
import './App.css';
import noteService from './services/notes';
import Notification from './Notification';

function List({ content, important, toggleImportance }) {

  const textToShow = important ? 'important' : 'non-important'
  const buttonToShow = important ? 'Change to non-important' : "Change to important"
  return (
    <li>{content}<span className='importance'>{textToShow}</span><button onClick={toggleImportance}>{buttonToShow}</button></li>
  )
}

const Footer = () => {
  const footerStyle = {
    color: 'green',
    backgroundColor: 'yellow',
    fontSize: 21
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note App, Department Of Computer Science, University of Helsinki</em>
    </div>)
}

function App() {
  const [thenotes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('type a new note...')
  const [shwoAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  // useEffect(() => {
  //   axios
  //     .get('http://localhost:3001/notes')
  //     .then(response => {
  //       console.log('promise fulfilled')
  //       setNotes(response.data)
  //     })
  // }, [])

  useEffect(() => {
    noteService.getAll()
      .then((data) => setNotes(data))
  }, [])


  const notesToShow = shwoAll ? thenotes : thenotes.filter(note => note.important === true)

  const noteSubmit = (event) => {
    event.preventDefault()
    const addedNote = {
      content: newNote,
      important: Math.random() < 0.5
    }
    // const allNotes = thenotes.concat(addedNote)
    // console.log(allNotes);
    // setNotes(allNotes)
    // setNewNote('type a new note....')

    // axios.post('http://localhost:3001/notes', addedNote)
    //   .then(response => {
    //     console.log(response.data)
    //     const allNotes = thenotes.concat(response.data)
    //     setNotes(allNotes)
    //     setNewNote('type new note again')
    //   })
    noteService
      .create(addedNote)
      .then(data => {
        setNotes(thenotes.concat(data))
        setNewNote('')
      })

  }

  const typeNote = (event) => {
    setNewNote(event.target.value)
  }

  // const clearInput = (event) => {
  //   console.log('hello, I am here')
  //   console.log(newNote)
  //   setNewNote(" ")
  //   console.log(newNote)
  //   console.log('hello, i am down here')
  // }

  const showOption = () => {
    setShowAll(!shwoAll)
  }

  // const toggleImportance = (id) => {
  //   axios.get(`http://localhost:3001/notes/${id}`)
  //     .then(response => {
  //       const data = response.data
  //       axios.put(`http://localhost:3001/notes/${id}`, {
  //         content: data.content,
  //         id: data.id,
  //         important: !data.important
  //       }).then(response => {
  //         axios.get('http://localhost:3001/notes')
  //         .then((response) => setNotes(response.data))
  //       })
  //     })
  // }  

  const toggleImportance = (id) => {
    const note = thenotes.find((note) => note.id === id)
    const updatednote = { ...note, important: !note.important }
    noteService
      .update(id, updatednote)
      .then(data => {
        setNotes(thenotes.map(note => note.id !== id ? note : data))
      })
      .catch(error => {
        setErrorMessage(`this ${note.content} with id of ${note.id} was already deleted from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(thenotes.filter(n => n.id !== id))
      })
  }

  return (
    <div>
      <Notification errorMessage={errorMessage} />
      <button onClick={showOption}>show {shwoAll ? 'important' : 'all'}</button>
      <ul>
        {/* {notes.map((note) => <li key={note.id}>{note.content}</li>)} */}
        {notesToShow.map((note) => <List key={note.id} content={note.content} important={note.important} toggleImportance={() => toggleImportance(note.id)} />)}
      </ul>

      <form onSubmit={noteSubmit}>
        <input className="input" value={newNote} onChange={typeNote} />
        <button type='submit'>save</button>
      </form>
      <Footer />
    </div>
  );
}

export default App;
