/**
 * Module Dependencies
 */

import $ from 'jquery'

export function getShows(fn) {
   $.ajax('/shows', {
    success: function (shows, textStatus, xhr) {
      fn(shows)
    }
  })
}

export function searchShows(busqueda, fn) {
  $.ajax('/search', {
    data: busqueda,
    success: function (shows, textStatus, xhr) {
      fn(shows)
    }
  })

  
}
