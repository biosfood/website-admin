import { useContext, useState, createContext, useEffect, Dispatch, SetStateAction } from 'react'
import { useRouter } from 'next/router'
import { Context, ContextState } from '@/types'

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
