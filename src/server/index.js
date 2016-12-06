import express from 'express'
const app = express()

const votes = {} // object, dictionary, hashtable

import mongoose from 'mongoose'
import Vote from 'src/server/models'
mongoose.connect('mongodb://localhost/tvify')

function addVotes (shows, callback) {
  Vote.find({}, (err, votes) => {
    if (err) votes = []

    shows = shows.map(show => {
      let vote = votes.filter(vote => vote.showId === show.id)[0]
      show.count = vote ? vote.count : 0
      return show
    })

    callback(shows)
  })
}

// GET /api/shows
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

// GET /api/search
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



app.use(express.static('public'))

// GET  /votes
app.get('/votes', (req, res) => {
  /*res.json(votes)*/
  Vote.find({}, (err, docs) => {
    if (err) {
      return res.sendStatus(500).json(err)
    }
    res.json(docs)
  })

})

// POST /vote/123
app.post('/vote/:id', (req, res) => {
  let id = req.params.id
  Vote.findOne({ showId: id }, (err, doc) => {
    if (doc) {
      doc.count = doc.count + 1;
      doc.save(function (err)  {
        if (err) return res.sendStatus(500).json(err)
         res.json(doc)
        })
    }else {
      let vote = new Vote()
      vote.showId = id
      vote.count = 1
      vote.save(function (err)  {
       if (err) return res.sendStatus(500).json(err)
         res.json(vote)})
    }
   }) 
})

app.listen(3000, () => console.log('Servidor iniciado con Express en el puerto 3000'))
