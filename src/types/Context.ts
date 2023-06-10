import { Resource } from './Resource'
import { Dispatch, SetStateAction } from 'react'

export interface Context {
  username: string,
  useremail: string,
  hostname: string,
  path: string,
  token?: string,
  profilePicture: any,
  resources: Array<Resource>,
  updateContext: () => void,
}

export interface ContextState {
  context: Context,
  setContext: Dispatch<SetStateAction<Context>>,
}
