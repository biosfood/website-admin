import {useGlobalContext} from '@/context'
import { Card, Text, Container, Spacer, Image, Input, Dropdown, Button, Grid } from '@nextui-org/react'
import { useEffect, useState, ReactNode } from 'react'
import { retrieveAsset } from '@/api'
import { CloseSquare } from 'react-iconly'
import type { Resource } from '@/api'
import type { Selection } from "@react-types/shared/src/selection"

export function AssetPicker({selection, onPick, children, noselect, resourceType}:
                            {selection?: Resource, onPick: (resource?: Resource) => void, children?: ReactNode,
                             noselect?: string, resourceType: string}) {
  const {context, setContext} = useGlobalContext()
  const [suggestions, setSuggestions] = useState([])
  const [currentAsset, setCurrentAsset] = useState('')

  function pick(selection: Selection) {
    if (selection instanceof String) {
      return
    }
    const asset = context.resources.find((resource: Resource) => resource.id in (selection as Set<any>))
    asset ? onPick(asset) : onPick(undefined)
  }

  useEffect(() => {
    selection ?
      retrieveAsset(selection.id).then((data: {content: string}) => setCurrentAsset(data.content)) : 
      setCurrentAsset("")}, [selection])

  resourceType = resourceType != undefined ? resourceType : "image"

  function createSections() {
    let result: any[] = []
    if (noselect != undefined && noselect != '') {
      result.push(
        <Dropdown.Section>
          <Dropdown.Item key="0">{noselect}</Dropdown.Item>
        </Dropdown.Section>
      )
    }
    result.push(
      <Dropdown.Section>
        {context.resources.filter((it: Resource) => it.resourceType == resourceType).map((asset:Resource) => (
          <Dropdown.Item key={asset.id}
            icon={resourceType == "image" && <Image src={asset.preview} width={24} alt=""/>}>
            {asset.name}
          </Dropdown.Item>))}
      </Dropdown.Section>
    )
    return result
  }
  
  return (
    <Grid.Container>
      <Grid xs>
        <Dropdown>
          {children == undefined ? (<Dropdown.Button
            flat color="secondary"> {selection ? selection.name : "Choose profile picture"} </Dropdown.Button>) :
            children
          }
          <Dropdown.Menu color="secondary" aria-label="choose an asset" selectionMode="single"
            disallowEmptySelection onSelectionChange={pick} defaultSelectedKeys={[`${selection ? selection.id : '0'}`]}>
            {createSections()}
          </Dropdown.Menu>
        </Dropdown>
      </Grid>
      <Grid xs><Image src={currentAsset} alt="currently selected asset"/></Grid>
    </Grid.Container>
  )
}
