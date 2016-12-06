/**
 * Module Dependencies
 */

import $ from 'jquery'

var $tvShowsContainer = $('#app-body').find('.tv-shows')

$tvShowsContainer.on('click', 'button.like', function (ev) {
  var $this = $(this);
  var $article = $this.closest('.tv-show')
  var id = $article.data('id')
  $.post('/vote/' + id)
  var counter = $this.closest('article').find('.count')
  var content = counter.html()
  var count = Number(content)
  count = count + 1
  counter.html(count)
  $this.closest('.tv-show').toggleClass('liked')
})

export default $tvShowsContainer