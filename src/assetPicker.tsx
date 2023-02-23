import {useGlobalContext} from '@/context'
import { Card, Text, Container, Spacer, Image, Input, Dropdown, Button, Grid } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import {loadAssets, retrieveAsset} from '@/api'
import { CloseSquare } from 'react-iconly'
import Autosuggest from 'react-autosuggest';

export function AssetPicker({selection, onPick}) {
  const {context, setContext} = useGlobalContext()
  const [assets, setAssets] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [currentAsset, setCurrentAsset] = useState('')

  useEffect(() => {loadAssets(context).then(newAssets => {if (newAssets) {setAssets(newAssets)}})}, [context.token])

  function pick([selection]) {
    const id = parseInt(selection)
    const asset = assets.find(asset => asset.id == id)
    asset ? onPick(asset) : onPick(null)
  }

  useEffect(() => {
    selection ?
      retrieveAsset(context, selection.id).then(asset => setCurrentAsset(asset)) : 
      setCurrentAsset("")}, [selection])
  
  return (
    <Grid.Container>
      <Grid>
        <Dropdown>
          <Dropdown.Button flat color="secondary">{selection ? selection.name : "Choose profile picture"}</Dropdown.Button>
          <Dropdown.Menu color="secondary" aria-label="choose profile picture" selectionMode="single" disallowEmptySelection onSelectionChange={pick}>
            <Dropdown.Section>
              <Dropdown.Item key="0">No profile picture</Dropdown.Item>
            </Dropdown.Section>
            <Dropdown.Section>
              {assets.map(asset => (<Dropdown.Item key={asset.id}>{asset.name}</Dropdown.Item>))}
            </Dropdown.Section>
          </Dropdown.Menu>
        </Dropdown>
      </Grid>
      <Grid xs><Image src={currentAsset}/></Grid>
    </Grid.Container>
  )
}
