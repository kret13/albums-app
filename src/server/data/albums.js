import albumsData from './albums-data.json'
import {matchSorter} from 'match-sorter'

let albums = [...albumsData]

async function create(album) {
  albums.push(album)
  return album
}

async function read(albumId) {
  return albums.find(album => album.id === albumId)
}

async function readManyNotInList(ids) {
  return albums.filter(album => !ids.includes(album.id))
}

async function query(search) {
  return matchSorter(albums, search, {
    keys: [
      'title',
      'artist',
      'genre',
      {threshold: matchSorter.rankings.CONTAINS, key: 'about'},
    ],
  })
}

async function reset() {
  albums = [...albumsData]
}

export {create, query, read, readManyNotInList, reset}
