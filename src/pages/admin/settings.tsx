import {useGlobalContext} from '@/context'
import { Card, Text, Container, Spacer } from '@nextui-org/react'
import {AssetPicker} from '@/assetPicker'
import {setProfilePicture} from '@/api'

export default function Settings() {
  const { context, setContext} = useGlobalContext();

  return (
    <Container>
      <Text h1>Settings</Text>
      <Card>
        <Card.Header><Text h2>Profile picture</Text></Card.Header>
        <Card.Body><AssetPicker selection={context.profilePicture} 
          onPick={asset => setProfilePicture(context, setContext, asset)}/>
        </Card.Body>
      </Card>
    </Container>
  )
}
