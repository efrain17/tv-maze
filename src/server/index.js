import express from 'express'
import mongoose from 'mongoose'
import Vote from 'src/server/models'
import tvmaze from 'tv-maze'
import http from 'http'
import socketio from 'socket.io'
import { addVotes, incrementVote, getVotes } from 'src/server/lib'


const app = express()
const client = tvmaze.createClient()
const votes = {} // object, dictionary, hashtable
const server = http.createServer(app)
const io = socketio (server)

mongoose.connect('mongodb://localhost/tvify')
app.use(express.static('public'))

io.on('connection', socket =>{
  console.log("Connected " + socket.id)

  socket.on('ping',_=>{
    console.log('PONG')
  })

  socket.on('vote',id => {
    incrementVote(id, (err,vote) => {
      if (err) return socket.emit('vote:error',err)
      socket.emit('vote:done',vote)
    })
  })

})

// GET /shows
app.get('/shows', (req, res) => {
  client.shows((err, shows) => {
    if (err) {
      return res.sendStatus(500).json(err)
    }

    addVotes(shows, shows => {
      res.json(shows)
    })
  })
})

// GET /search
app.get('/search', (req, res) => {
  let query = req.query.q

  client.search(query, (err, shows) => {
    if (err) {
      return res.sendStatus(500).json(err)
    }

    shows = shows.map(show => show.show)

    addVotes(shows, shows => {
      res.json(shows)
    })
  })
})

// GET  /votes
app.get('/votes', (req, res) => {
  /*res.json(votes)*/
    getVotes((err, docs) => {
    if (err) {
      return res.sendStatus(500).json(err)
    }
    res.json(docs)
  })

})

// POST /vote/123
app.post('/vote/:id', (req, res) => {
  let id = req.params.id
  incrementVote(id,(err,votes)=>{
    if(err){
      return res.sendStatus(500).json(err)
    }
    res.json(votes)
  })
   
})

server.listen(3000, () => console.log('Servidor iniciado con Express en el puerto 3000'))
