import { adminPages } from '@/pages/admin/index'
import { Navigation } from '@/navigation'
import { Grid, Card } from '@nextui-org/react';
import { loadAssets } from '@/api'
import { useEffect, useState } from 'react';

export default function Assets() {
  const [assets, setAssets] = useState(new Array())
  useEffect(() => {
    loadAssets().then(newAssets => {
      if (newAssets) {
        setAssets(newAssets)
      }
    })
  }, [])
  return (
    <>
      <Navigation pages={adminPages}/>
      <Grid.Container gap={2} justify="center">
        {assets.map((asset) => (
            <Grid md>
              <Card>
                <Card.Header>{asset.name}</Card.Header>
                <Card.Body>{asset.preview}</Card.Body>
              </Card>
            </Grid>))}
      </Grid.Container>
    </>)
}
