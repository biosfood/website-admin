import {useGlobalContext} from '@/context'
import { Card, Text, Container, Spacer, Image, Input, Dropdown, Button } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import {loadAssets, retrieveAsset} from '@/api'
import { CloseSquare } from 'react-iconly'
import Autosuggest from 'react-autosuggest';

export function AssetPicker({selection, onPick}) {
  const {context, setContext} = useGlobalContext()
  const [currentAssetSource, setCurrentAssetSource] = useState('')
  const [assets, setAssets] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [currentAsset, setCurrentAsset] = useState(0)
  const [currentSearch, setCurrentSearch] = useState('')

  function updateSuggestions({value}) {
    setCurrentSearch(value)
    setSuggestions(assets.filter(asset => asset.name.includes(value)))
  }

  useEffect(() => {
    setCurrentAssetSource(retrieveAsset(context, selection))
    //updateSuggestions(currentSearch)
  }, [selection])

  const renderSuggestion = asset => (<Text>{asset.name}</Text>)

  useEffect(() => {loadAssets(context).then(newAssets => {if (newAssets) {setAssets(newAssets)}})}, [context.token])
  
  return (
    <Container>
      <Autosuggest suggestions={suggestions} inputProps={{value: currentSearch, onChange: () => {}}}
        onSuggestionsFetchRequested={updateSuggestions} renderSuggestion={renderSuggestion} getSuggestionValue={asset => asset.name}
        onSuggestionsClearRequested={() => {setSuggestions([]); setCurrentSearch('')}}/>
      <Image src={currentAssetSource}/>
    </Container>
  )
}
