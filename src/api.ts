import { createHash } from 'crypto'
import { useGlobalContext } from '@/context'
import useSSR from 'use-ssr'
import { Context, Resource, User } from '@/types'

function doGraphQl(query: string, variables: object) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isServer } = useSSR()
  const url = isServer ? `${process.env.api}/graphql` : "/api/graphql"
  return fetch(url, {
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

export function findUsers() {
  return doGraphQl(`
query Users {
  users {
    name
    profilePicture {
      id
      name
      preview
      resourceType
    }
  }
}
`, {}).then(response => {
    return response.data.users
  })
}

export function login(context: Context, setContext: (context: Context) => void, email: string, password: string, updateContext: boolean = true) {
  return doGraphQl(
    `mutation Login($email: String, $password: String) {login(email: $email, password: $password)}`,
    {email, password: processPassword(password)}).then(response => {
      if (response.data.login || updateContext) {
        setContext({...context, token: response.data.login})
      }
      return response
    })
}

export function updateUserData(context: Context, setContext: (context: Context) => void) {
  return doGraphQl('query GetUserData($token: String) {userData(token: $token) '+
                   '{name, email, hostname, profilePicture {id, name, preview}, resources {id, name, preview, resourceType}}}', {token: context.token})
  .then(response => {
    if (response?.data?.userData?.name) {
      setContext({...context,
                 username: response.data.userData.name,
                 useremail: response.data.userData.email,
                 profilePicture: response.data.userData.profilePicture,
                 hostname: response.data.userData.hostname,
                 resources: response.data.userData.resources})
      return true
    }
    setContext({...context, token: '', username: '', useremail: '', profilePicture: null})
    return false
  })
}

export function createResource(context: Context, type: string, name: string, preview: string, content: string) {
  return doGraphQl('mutation CreateResource($token: String, $type: String, $name: String, $preview: String, $content: String)'+
                   '{createResource(token: $token, type: $type, name: $name, preview: $preview, content: $content) {id} }',
                  {token: context.token, name, type, preview, content})
}

export function createAsset(context: Context, name: string, preview: string, content: string) {
  return createResource(context, 'image', name, preview, content)
}

export function createArticle(context: Context, name: string, preview: string, content: string) {
  return createResource(context, 'article', name, preview, content)
}


export function deleteResource(context: Context, id: number) {
  return doGraphQl('mutation DeleteResource($token: String, $id: Int)'+
                   '{deleteResource(token: $token, id: $id) }',
                  {token: context.token, id})
}

export function logout(context: Context, setContext: (context: Context) => void) {
  setContext({...context, username: '', useremail: '', token: 'REMOVE_NOW'})
}

export function setProfilePicture(context: Context, setContext: (context: Context) => void, asset?: Resource) {
  const id = asset ? asset.id : 0
  return doGraphQl('mutation SetProfilePicture($token: String, $id: Int){setProfilePicture(token: $token, id: $id)}',
                   {token: context.token, id}).then(response => {
                  if (response.data?.setProfilePicture)
                    updateUserData(context, setContext) 
                  })
}

export function retrieveAsset(id: number): Promise<{content: string, preview: string}> {
  return doGraphQl('query GetAsset($id: Int) {resource(id: $id) {content, preview}}',
                   {id})
  .then(response => response.data?.resource)
}

export function changePassword(context: Context, newPassword: string) {
  return doGraphQl('mutation ChangePassword($token: String, $newPassword: String)'+
                   '{changePassword(token: $token, newPassword: $newPassword)}',
                    {token: context.token, newPassword: processPassword(newPassword)})
  .then(response => response.data?.changePassword)
}

export function changeEmail(context: Context, newEmail: string) {
  return doGraphQl('mutation ChangeEmail($token: String, $newEmail: String)'+
                   '{changeEmail(token: $token, newEmail: $newEmail)}',
                    {token: context.token, newEmail})
  .then(response => response.data?.changeEmail)
}

export function updateResource(context: Context, setContext: (context: Context) => void, id: number, preview: string, content: string) {
  return doGraphQl('mutation UpdateResource($token: String, $id: Int, $preview: String, $content: String)'+
                   '{updateResource(token: $token, id: $id, preview: $preview, content: $content)}',
                    {token: context.token, id, preview, content})
  .then(response => {
    updateUserData(context, setContext)
    return response?.data?.updateResource
  })
}

export function getResources(username: string) {
  return doGraphQl('query GetResources($username: String) {resources(username: $username) {id, name, preview, resourceType}}',
                   {username})
  .then(response => {
    return response?.data?.resources
  })
}

export async function retrieveResourceByName(username: string, name: string) {
  return await doGraphQl(`query ResourceByName($username: String, $name: String) {
        resourceByName(username: $username, name: $name) {content} }`, {username, name})
  .then(data => data.data?.resourceByName?.content)
}

export function changeHost(context: Context, newHostname: string) {
  return doGraphQl('mutation ChangeHost($token: String, $newHostname: String)'+
                   '{changeHostname(token: $token, newHostname: $newHostname)}',
                    {token: context.token, newHostname})
  .then(response => response.data?.changeHostname)
}
