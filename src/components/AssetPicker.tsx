import {useGlobalContext} from '@/context'
import { Image, Dropdown, Grid } from '@nextui-org/react'
import { useEffect, useState, ReactNode } from 'react'
import { retrieveAsset } from '@/api'
import { Resource } from '@/types'
import type { Selection } from "@react-types/shared/src/selection"
import { Client } from "react-hydration-provider";

export default function AssetPicker({selection, onPick, children, noselect, resourceType, showDescription}:
                            {selection?: Resource, onPick: (resource?: Resource) => void, children?: ReactNode,
                             noselect?: string, resourceType?: string, showDescription?: any}) {
  const {context, setContext} = useGlobalContext()
  const [currentAsset, setCurrentAsset] = useState('')

  function pick(selection: Selection) {
    if (selection instanceof String) {
      return
    }
    const item = [...selection][0]
    const asset = context.resources.find((resource: Resource) => item == resource.id)
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
        <Dropdown.Section key="noselect">
          <Dropdown.Item key="0">{noselect}</Dropdown.Item>
        </Dropdown.Section>
      )
    }
    result.push(
      <Dropdown.Section key="selections">
        {context.resources.filter((it: Resource) => it.resourceType == resourceType).map((asset:Resource) => (
          <Dropdown.Item key={asset.id}
            icon={resourceType == "image" && <Image src={asset.preview} width={24} alt=""/>}
            description={showDescription && `/api/resources?id=${asset.id}`}>
            {asset.name}
          </Dropdown.Item>))}
      </Dropdown.Section>
    )
    return result
  }
  
  return (
    <Grid.Container>
      <Grid xs>
        <Client>
        <Dropdown>
          {children == undefined ? (<Dropdown.Button
            flat color="secondary"> {selection ? selection.name : "Choose profile picture"} </Dropdown.Button>) :
            children
          }
          <Dropdown.Menu color="secondary" aria-label="choose an asset" selectionMode="single"
            disallowEmptySelection onSelectionChange={pick} defaultSelectedKeys={[`${selection ? selection.id : 'none'}`]}>
            {createSections()}
          </Dropdown.Menu>
        </Dropdown>
        </Client>
      </Grid>
      <Grid xs>{currentAsset && <Image src={currentAsset} alt="currently selected asset" width={100} height={100}/>}</Grid>
    </Grid.Container>
  )
}
