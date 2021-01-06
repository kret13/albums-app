import * as albumsDB from './albums'
const listItemsKey = '__albumsapp_list_items__'
let listItems = {}
const persist = () =>
  window.localStorage.setItem(listItemsKey, JSON.stringify(listItems))
const load = () =>
  Object.assign(
    listItems,
    JSON.parse(window.localStorage.getItem(listItemsKey)),
  )

// initialize
try {
  load()
} catch (error) {
  persist()
  // ignore json parse error
}

window.__albumsapp = window.__albumsapp || {}
window.__albumsapp.purgeListItems = () => {
  Object.keys(listItems).forEach(key => {
    delete listItems[key]
  })
  persist()
}

async function authorize(userId, listItemId) {
  const listItem = await read(listItemId)
  if (listItem.ownerId !== userId) {
    const error = new Error('User is not authorized to view that list')
    error.status = 403
    throw error
  }
}

async function create({
  albumId = required('albumId'),
  ownerId = required('ownerId'),
  rating = -1,
  notes = '',
  startDate = Date.now(),
  finishDate = null,
}) {
  const id = hash(`${albumId}${ownerId}`)
  if (listItems[id]) {
    const error = new Error(
      `This user cannot create new list item for that album`,
    )
    error.status = 400
    throw error
  }
  const album = await albumsDB.read(albumId)
  if (!album) {
    const error = new Error(`No album found with the ID of ${albumId}`)
    error.status = 400
    throw error
  }
  listItems[id] = {id, albumId, ownerId, rating, notes, finishDate, startDate}
  persist()
  return read(id)
}

async function read(id) {
  validateListItem(id)
  return listItems[id]
}

async function update(id, updates) {
  validateListItem(id)
  Object.assign(listItems[id], updates)
  persist()
  return read(id)
}

async function remove(id) {
  validateListItem(id)
  delete listItems[id]
  persist()
}

async function readMany(userId, listItemIds) {
  return Promise.all(
    listItemIds.map(id => {
      authorize(userId, id)
      return read(id)
    }),
  )
}

async function readByOwner(userId) {
  return Object.values(listItems).filter(li => li.ownerId === userId)
}

function validateListItem(id) {
  load()
  if (!listItems[id]) {
    const error = new Error(`No list item with the id "${id}"`)
    error.status = 404
    throw error
  }
}

function hash(str) {
  var hash = 5381,
    i = str.length

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }
  return String(hash >>> 0)
}

function required(key) {
  const error = new Error(`${key} is required`)
  error.status = 400
  throw error
}

async function reset() {
  listItems = {}
  persist()
}

export {authorize, create, read, update, remove, readMany, readByOwner, reset}
