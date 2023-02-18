const express = require('express')
const cors = require('cors')
const Note = require('./models/note')
require('dotenv').config()
const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(cors())


const requestLogger = (req, res, next) => {
  console.log('method:', req.method)
  console.log('path:', req.path)
  console.log('body:', req.body)
  console.log('........')
  next()
}
app.use(requestLogger)


// const generateId = () => {
//   const maxId = notes.length > 0
//     ? Math.max(...notes.map(n => n.id))
//     : 0
//   return maxId + 1
// }

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then((result) => response.json(result))
})

app.delete('/api/notes/:id', (request, response, next) => {
  Note.deleteOne({ _id: request.params.id })
    .then(result => response.status(204).end())
    .catch(e => next(e))
  // Note.findByIdAndRemove(request.params.id)
  // .then(result => {
  //   response.status(204).end()
  // })
  // .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
  // const body = request.body
  // const note = {
  //   content: body.content,
  //   important: body.important,
  // }
  const { content, important } = request.body
  Note.findByIdAndUpdate(request.params.id, { content, important }, { new: true, runValidators: true, context: 'query' })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

// app.post('/api/notes', (request, response) => {
//   const body = request.body
//   if (!body.content) {
//     return response.status(400).json({
//       error: 'content missing'
//     })
//   }
//   const note = new Note({
//     content: body.content,
//     important: body.important || false
//   })
//   note.save().then((result) => console.log('note saved'))
//   response.json(note)
// })
app.post('/api/notes', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknow endpoint' })
}
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})