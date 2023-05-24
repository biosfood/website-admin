export interface Resource {
  name: string,
  preview: string,
  id: number,
  resourceType: string,
}

export interface User {
  name: string,
  hostname: string,
  profilePicture?: Resource,
}
