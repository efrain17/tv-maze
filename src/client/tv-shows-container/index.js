/**
 * Module Dependencies
 */

import $ from 'jquery'
import socketio from 'socket.io-client'
import page from 'page'

let socket = socketio()

var $tvShowsContainer = $('#app-body').find('.tv-shows')

$tvShowsContainer.on('click', 'button.like', function (ev) {
  var $this = $(this);
  var $article = $this.closest('.tv-show')
  var id = $article.data('id')

  socket.emit('vote', id)
  $article.toggleClass('liked')
})

$tvShowsContainer.on('click', 'button.chat', function (ev) {
  let $this = $(this)
  let $article = $this.closest('.tv-show')
  let id = $article.data('id')
  socket.emit('join', 'show-' + id)

  page('/chat/' + id)
})

$tvShowsContainer.on('keypress', '.chat-nick',function (ev){
	let $this = $(this)
	let $chatInput = $('.chat-input')

	$chatInput.prop('disabled', $this.val().length === 0)
})

$tvShowsContainer.on('keypress','.chat-input',function (ev){
	let $this = $(this)
	let nick = $('.chat-nick').val()

	if (ev.which===13){
		let message = $this.val()
		socket.emit('message',{nick, message})
		addMessage(nick, message)

		$this.val('')
	}
})

socket.on('vote:done', function (vote) {
  let id = vote.showId
  let $article = $tvShowsContainer.find('article[data-id=' + id + ']')
  let counter = $article.find('.count')
  counter.html(vote.count)
})

socket.on('message', function (msg){
  let { nick, message } = msg 
  addMessage(nick,message)
})

function addMessage (nick, message){
	let $chatBoy = $('.chat-body')

	$chatBoy.append(`<p><b>${nick}: </b> ${message}</p>`)
  $chatBody.animate({ scrollTop: $chatBody.get(0).scrollHeight }, 1000)
}
export default $tvShowsContainer