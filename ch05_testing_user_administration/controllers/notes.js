const notesRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Note = require('../models/note')
const User = require('../models/user')

// notesRouter.get('/', (request, response) => {
//   Note.find({}).then(notes => {
//     response.json(notes)
//   })
// })

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

notesRouter.get('/', async (req, res) => {
  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  // console.log(decodedToken)
  if (User.findById(decodedToken.id)) {
    const notes = await Note.find({ user: decodedToken.id }).populate('user', { username: 1 })
    res.json(notes)
  }
})

notesRouter.get('/:id', async (request, response) => {
  // Note.findById(request.params.id)
  //   .then(note => {
  //     if (note) {
  //       response.json(note)
  //     } else {
  //       response.status(404).end()
  //     }
  //   })
  //   .catch(error => next(error))

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  const note = await Note.findById(request.params.id)
  if (note && note.user.toString() === decodedToken.id) {
    const note = await Note.findById(request.params.id)
    response.json(note)
  }
  else {
    response.status(400).end('you are not allowed to get other people\'s note, or your note id is incorrect')
  }
})

// notesRouter.post('/', (request, response, next) => {
//   const body = request.body
//   const note = new Note({
//     content: body.content,
//     important: body.important || false,
//     date: new Date()
//   })
//   note.save()
//     .then(savedNote => {
//       response.json(savedNote)
//     })
//     .catch(error => next(error))
// })
notesRouter.post('/', async (request, response) => {
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  const body = request.body
  const user = await User.findById(decodedToken.id)
  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user.id
  })
  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()
  response.status(201).json(savedNote)
})

// notesRouter.delete('/:id', (request, response, next) => {
//   Note.findByIdAndRemove(request.params.id)
//     .then(() => {
//       response.status(204).end()
//     })
//     .catch(error => next(error))
// })

notesRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  const note = await Note.findById(request.params.id)
  // console.log(note.user.toString(), decodedToken.id, typeof note.user, typeof decodedToken.id)
  if (note && note.user.toString() === decodedToken.id) {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    response.status(400).end('you are not allowed to delete other\'s note')
  }
})

notesRouter.put('/:id', async (request, response) => {
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  const note = await Note.findById(request.params.id)
  if (note && note.user.toString() === decodedToken.id) {
    const body = request.body
    const note = {
      content: body.content,
      important: body.important || false
    }
    const newNote = await Note.findByIdAndUpdate(request.params.id, note, { new: true })
    response.status(200).json(newNote)
  } else {
    response.status(400).end('your note id is not corrected or you are not allowed to update other\'s note')
  }
})

module.exports = notesRouter