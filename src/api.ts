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

export function login(context, setContext, email: string, password: string, updateContext = true) {
  return doGraphQl(
    `mutation Login($email: String, $password: String) {login(email: $email, password: $password)}`,
    {email, password: processPassword(password)}).then(response => {
      if (response.data.login || updateContext) {
        setContext({...context, token: response.data.login})
      }
      return response
    })
}

export function updateUserData(context, setContext) {
  return doGraphQl('query GetUserData($token: String) {userData(token: $token) '+
                   '{name, email, profilePicture {id, name, preview}, resources {id, name, preview, resourceType}}}', {token: context.token})
  .then(response => {
    if (response?.data?.userData?.name) {
      setContext({...context,
                 username: response.data.userData.name,
                 useremail: response.data.userData.email,
                 profilePicture: response.data.userData.profilePicture,
                 resources: response.data.userData.resources})
      return true
    }
    setContext({...context, token: '', username: '', useremail: '', profilePicture: null})
    return false
  })
}

export function createResource(context, type, name, preview, content) {
  return doGraphQl('mutation CreateResource($token: String, $type: String, $name: String, $preview: String, $content: String)'+
                   '{createResource(token: $token, type: $type, name: $name, preview: $preview, content: $content) {id} }',
                  {token: context.token, name, type, preview, content})
}

export function createAsset(context, name, preview, content) {
  return createResource(context, 'image', name, preview, content)
}

export function createArticle(context, name, preview, content) {
  return createResource(context, 'article', name, preview, content)
}


export function deleteResource(context, id) {
  return doGraphQl('mutation DeleteResource($token: String, $id: Int)'+
                   '{deleteResource(token: $token, id: $id) }',
                  {token: context.token, id})
}

export function logout({context, setContext}) {
  setContext({...context, username: '', useremail: '', token: 'REMOVE_NOW'})
}

export function setProfilePicture(context, setContext, asset) {
  const id = asset ? asset.id : 0
  return doGraphQl('mutation SetProfilePicture($token: String, $id: Int){setProfilePicture(token: $token, id: $id)}',
                   {token: context.token, id}).then(response => {
                  if (response.data?.setProfilePicture)
                    updateUserData(context, setContext) 
                  })
}

export function retrieveAsset(context, id) {
  return doGraphQl('query GetAsset($token: String, $id: Int) {resource(token: $token, id: $id) {content}}',
                   {token: context.token, id})
  .then(response => response.data?.resource?.content)
}

export function changePassword(context, newPassword) {
  return doGraphQl('mutation ChangePassword($token: String, $newPassword: String)'+
                   '{changePassword(token: $token, newPassword: $newPassword)}',
                    {token: context.token, newPassword: processPassword(newPassword)})
  .then(response => response.data?.changePassword)
}

export function changeEmail(context, newEmail) {
  return doGraphQl('mutation ChangeEmail($token: String, $newEmail: String)'+
                   '{changeEmail(token: $token, newEmail: $newEmail)}',
                    {token: context.token, newEmail})
  .then(response => response.data?.changeEmail)
}
