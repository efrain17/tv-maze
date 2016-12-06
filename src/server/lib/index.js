import Vote from 'src/server/models'

export function incrementVote(id,callback){
	Vote.findOne({ showId: id }, (err, doc) => {
    if (doc) {
      doc.count = doc.count + 1;
      doc.save(function (err)  {
        if (err) return callback(err)
         callback(null, doc)
        })
    }else {
      let vote = new Vote()
      vote.showId = id
      vote.count = 1
      vote.save(function (err)  {
       if (err) return callback(err)
         callback(null, vote)})
    }
   }) 
}
export function addVotes(shows,callback){
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
export function getVotes(callback){
	Vote.find({}, (err, docs) => {
    if (err) {
      return callback(err)
    }
    callback(docs)
  })
}
