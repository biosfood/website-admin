import {useGlobalContext} from '@/context'
import { Card, Text, Container, Spacer, Image, Input, Dropdown, Button, Grid } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import {loadAssets, retrieveAsset} from '@/api'
import { CloseSquare } from 'react-iconly'
import Autosuggest from 'react-autosuggest';

export function AssetPicker({selection, onPick, children, noselect, resourceType}) {
  const {context, setContext} = useGlobalContext()
  const [suggestions, setSuggestions] = useState([])
  const [currentAsset, setCurrentAsset] = useState('')

  function pick([selection]) {
    const id = parseInt(selection)
    const asset = context.resources.find(asset => asset.id == id)
    asset ? onPick(asset) : onPick(null)
  }

  useEffect(() => {
    selection ?
      retrieveAsset(context, selection.id).then(asset => setCurrentAsset(asset.content)) : 
      setCurrentAsset("")}, [selection])

  resourceType = resourceType != undefined ? resourceType : "image"
  
  return (
    <Grid.Container>
      <Grid xs>
        <Dropdown>
          {children == undefined ? (<Dropdown.Button defaultselectedkeys={[`${selection ? selection.id : '0'}`]}
            flat color="secondary"> {selection ? selection.name : "Choose profile picture"} </Dropdown.Button>) :
            children
          }
          <Dropdown.Menu color="secondary" aria-label="choose an asset" selectionMode="single"
            disallowEmptySelection onSelectionChange={pick}>
            {noselect != undefined && noselect != '' && <Dropdown.Section>
              <Dropdown.Item key="0">{noselect}</Dropdown.Item>
            </Dropdown.Section>}
            <Dropdown.Section>
              {context.resources.filter(it => it.resourceType == resourceType).map(asset => (
                <Dropdown.Item key={asset.id}
                  icon={resourceType == "image" && <Image src={asset.preview} width={24}/>}>
                  {asset.name}
                </Dropdown.Item>))}
            </Dropdown.Section>
          </Dropdown.Menu>
        </Dropdown>
      </Grid>
      <Grid xs><Image src={currentAsset}/></Grid>
    </Grid.Container>
  )
}
