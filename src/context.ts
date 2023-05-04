import { useContext, useState, createContext, useEffect } from 'react'
import { useRouter } from 'next/router'

interface Context {
  username: string,
  useremail: string,
  path: string,
  token: string,
  profilePicture: any,
  resources: Array,
}

export type {Context}

export const defaultContext = {
  username: '',
  useremail: '',
  path: '',
  token: '???',
  profilePicture: null,
  resources: [],
}

export const GlobalContext = createContext(defaultContext)
export const useGlobalContext = () => useContext(GlobalContext)
