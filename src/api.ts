import {createHash} from 'crypto'

function doGraphQl(query: string, variables) {
  return fetch("http://localhost:4000/graphql", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({query, variables})
  }).then(response => response.json())
}

function processPassword(password: string) {
  const hash = createHash("sha256")
  hash.update(password + "EISENHAUER backend Password")
  return "MD5-" + hash.digest("base64") // :)
}

export function login(email: string, password: string) {
  return doGraphQl(
    `mutation Login($email: String, $password: String) {login(email: $email, password: $password)}`,
    {email, password: processPassword(password)}).then(response => {
      if (response.data.login) {
        localStorage.setItem("token", response.data.login)
      }
      return response
    })
}

export interface UserAccount {
  name: string
  email: string
}

export function getUserData(router) {
  const token = localStorage.getItem("token")
  if (!token) {
    return new Promise((resolve, reject) => resolve(null))
  }
  return doGraphQl('query GetUserData($token: String) {userData(token: $token) {name, email}}', {token})
  .then(response => {
    if (!response?.data?.userData?.name) {
      localStorage.removeItem("token")
      return null
    }
    const account: UserAccount = response.data.userData
    return account
  })
}

export function loadAssets() {
  const token = localStorage.getItem("token")
  if (!token) {
    return new Promise((resolve, reject) => resolve([]))
  }
  return doGraphQl('query GetAssets($token: String) {resources(token: $token) {id, name, preview}}', {token})
  .then(response => {
    return response.data.resources
  })
}
