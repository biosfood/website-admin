import { Resource } from './Resource'
import { useContext, useState, createContext, useEffect, Dispatch, SetStateAction } from 'react'

export interface Context {
  username: string,
  useremail: string,
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
