import { Container, Card, Text } from '@nextui-org/react'

export function Footer() {
  const alignCenter = {textAlign: 'center'}
  return (
    <Container fluid="true" style={{padding: 0, margin: 0, width: '100vw'}}>
      <Card fluid="true" style={{width: '100vw', borderRadius: 0}}>
        <Card.Body style={{...alignCenter, padding: 2}}>
          <Text>&copy; Copyright 2023 Lukas Eisenhauer</Text>
          <Text>Author of this website: Lukas Eisenhauer</Text>
          <Text>Address: Kohlr&ouml;schenstr. 53 80995 M&uuml;nchen</Text>
          <Text>Phone: +49 89 15001158</Text>
          <Text>Email: leisenhau@gmail.com</Text>
        </Card.Body>
      </Card>
    </Container>
  )
}
