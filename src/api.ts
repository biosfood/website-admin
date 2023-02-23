import {createHash} from 'crypto'
import { useGlobalContext } from '@/context'

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
  return "MD5-" + hash.digest("base64") // ;)
}

export function login(context, setContext, email: string, password: string) {
  return doGraphQl(
    `mutation Login($email: String, $password: String) {login(email: $email, password: $password)}`,
    {email, password: processPassword(password)}).then(response => {
      setContext({...context, token: response.data.login})
      return response
    })
}

export function updateUserData(context, setContext) {
  return doGraphQl('query GetUserData($token: String) {userData(token: $token) {name, email}}', {token: context.token})
  .then(response => {
    if (response?.data?.userData?.name) {
      setContext({...context, username: response.data.userData.name, useremail: response.data.userData.email})
      return true
    }
    setContext({...context, token: '', username: '', useremail: ''})
    return false
  })
}

export function loadAssets(context) {
  return doGraphQl('query GetAssets($token: String) {resources(token: $token) {id, name, preview}}', {token: context.token})
  .then(response => {
    return response.data.resources
  })
}

export function createAsset(context, name, preview, content) {
  return doGraphQl('mutation CreateResource($token: String, $name: String, $preview: String, $content: String)'+
                   '{createResource(token: $token, name: $name, preview: $preview, content: $content) {id} }',
                  {token: context.token, name, preview, content})
  .then(response => response.data.createResource)
}

export function deleteResource(context, id) {
  return doGraphQl('mutation DeleteResource($token: String, $id: Int)'+
                   '{deleteResource(token: $token, id: $id) }',
                  {token: context.token, id})
}

export function logout({context, setContext}) {
  setContext({...context, username: '', useremail: '', token: 'REMOVE_NOW'})
}

export function setProfilePicture(context, setContext, id) {
// TODO
}

export function retrieveAsset(context, id) {
  return doGraphQl('query GetAsset($token: String, $id: Int) {resource(token: $token, id: $id) {content}}', {token: context.token, id})
  .then(response => response.data?.resource?.content)
}
