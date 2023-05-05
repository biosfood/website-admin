import { useContext, useState, createContext, useEffect, Dispatch, SetStateAction } from 'react'
import { useRouter } from 'next/router'
import { Resource } from '@/api'

interface Context {
  username: string,
  useremail: string,
  path: string,
  token?: string,
  profilePicture: any,
  resources: Array<Resource>,
  updateContext: () => void,
}

interface ContextState {
  context: Context,
  setContext: Dispatch<SetStateAction<Context>>,
}

export type {Context, ContextState}

export const defaultContext: Context = {
  username: '',
  useremail: '',
  path: '',
  token: '???',
  profilePicture: null,
  resources: [],
  updateContext: () => {},
}

export const GlobalContext = createContext<ContextState>({context: defaultContext, setContext: () => {}})
export const useGlobalContext = () => useContext(GlobalContext)
