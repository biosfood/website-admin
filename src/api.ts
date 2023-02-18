
function doGraphQl(query: string) {
  return fetch("http://localhost:4000/graphql", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({query})
  }).then(response => response.json())
}

export function login(name: string, password: string) {
  return doGraphQl(`{users{id}}`)
}
