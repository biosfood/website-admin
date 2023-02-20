import { adminPages } from '@/pages/admin/index'
import { Navigation } from '@/navigation'
import { Grid, Card } from '@nextui-org/react';
import { loadAssets } from '@/api'
import { useEffect, useState } from 'react';
import { FileDropZone } from '@/fileDropZone'

export default function Assets() {
  const [assets, setAssets] = useState(new Array())
  useEffect(() => {
    loadAssets().then(newAssets => {
      if (newAssets) {
        setAssets(newAssets)
      }
    })
  }, [])
  
  const [filesToProcess, setFiles] = useState(new Array())
  function onFileDrop(file) {
    setFiles([...filesToProcess, file])
  }

  function File() {
    if (!filesToProcess.length) {
      return (<FileDropZone onFileDrop={onFileDrop}/>)
    } else {
      return (
        <Card>
          <Card.Header>Add file</Card.Header>
        </Card>)
    }
  }

  return (
    <>
      <Navigation pages={adminPages} />
      <Grid.Container gap={2} justify="center">
        <Grid md>
          <File/>
        </Grid>
        {assets.map((asset) => (
            <Grid md id={"ASSET-"+asset.id}>
              <Card>
                <Card.Header>{asset.name}</Card.Header>
                <Card.Body>{asset.preview}</Card.Body>
              </Card>
            </Grid>))}
      </Grid.Container>
    </>)
}
