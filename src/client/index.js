/**
 * Module Dependencies
 */

import $ from 'jquery'
import page from 'page'
import { getShows, searchShows } from 'src/client/tvmaze-api-client'
import { renderShows, renderChat } from 'src/client/render'
import $tvShowsContainer from 'src/client/tv-shows-container'
import 'src/client/search-form'
import qs from 'qs'

page('/', function (ctx, next) {
  $tvShowsContainer.find('.tv-show').remove()
  // Quito LocalStorage para que funcione el count
  getShows(function (shows) {
    $tvShowsContainer.find('.loader').remove();
    localStorage.shows = JSON.stringify(shows);
    renderShows(shows);
  })
})

page('/search', function (ctx, next) {
  $tvShowsContainer.find('.tv-show').remove()
  var $loader = $('<div class="loader">');
  $loader.appendTo($tvShowsContainer);
  const busqueda = qs.parse(ctx.querystring)
  searchShows(busqueda, function (res) {
    $loader.remove();
    renderShows(res);
  })
})

page('/chat/:showId', function (ctx, next) {
  $tvShowsContainer.find('.tv-show').remove()
  renderChat(ctx.params.showId)
})

var productionEnv = !!~window.location.host.indexOf('github.io')

if (productionEnv) {
  page.base('/tvify')
}

page()
