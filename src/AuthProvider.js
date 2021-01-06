// you shouldn't have to implement something like this in your own app

const localStorageKey = '__auth_provider_token__'

async function getToken() {
  // if we were a real auth provider, this is where we would make a request
  // to retrieve the user's token.
  return window.localStorage.getItem(localStorageKey)
}

function handleUserResponse({user}) {
  window.localStorage.setItem(localStorageKey, user.token)
  return user
}

function login({username, password}) {
  return authClient('login', {username, password}).then(handleUserResponse)
}

function register({username, password}) {
  return authClient('register', {username, password}).then(handleUserResponse)
}

async function logout() {
  window.localStorage.removeItem(localStorageKey)
}

const authURL = process.env.REACT_APP_AUTH_URL

async function authClient(endpoint, data) {
  const config = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {'Content-Type': 'application/json'},
  }

  return window.fetch(`${authURL}/${endpoint}`, config).then(async response => {
    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}

export {getToken, login, register, logout, localStorageKey}
