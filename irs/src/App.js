import { Text, Input, Spacer, Button, Container, Col, Card, Row, Modal, Radio } from "@nextui-org/react"
import { useState } from "react"
import * as IconlyPack from 'react-iconly'
import './animation.css'
import axios from "axios"

function App() {

  const [inputValue, setInputValue] = useState('')
  const [results, setResults] = useState([])
  const [rateOpen, setRateOpen] = useState(false)
  const [rateBut, setRateBut] = useState(true)

  const handleSearch = () => {
    axios.get("http://127.0.0.1:8000/irs", {
      params: {
        message: inputValue
      }
    }).then((res) => {
      setResults(res.data)
      setRateBut(false)
      var wrapper = document.querySelector('.wrapper')
      wrapper.style.animationName = 'ball'
      wrapper.style.animationDuration = '0.5s'
      wrapper.style.animationFillMode = 'both'
    })
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  const keyUp = (event) => {
    setInputValue(event.target.value)
  }

  return (

    <div style={{ height: "100vh" }}>
      <div style={{
        position: "fixed",
        right: "10px",
        top: "40%",
      }}>
        <Button shadow color="gradient" onPress={() => { setRateOpen(true) }} auto disabled={rateBut}>
          Rate?
        </Button>
        <Modal onClose={() => { setRateOpen(false); setRateBut(true); }} open={rateOpen}>
          <Modal.Body css={{ margin: "20px" }}>
            <Radio.Group label="How do you think of the search results?">
              <Radio value="1">very bad</Radio>
              <Radio value="2">bad</Radio>
              <Radio value="3">just so so</Radio>
              <Radio value="4">good</Radio>
              <Radio value="5">excellent</Radio>
            </Radio.Group>
          </Modal.Body>
        </Modal>
      </div>
      <div className="wrapper" >
        <Text h2>
          Information Retrieval System
        </Text>
        <Spacer y={2}></Spacer>
        <Input
          width="100%"
          underlined
          color="primary"
          status="default"
          labelPlaceholder="Search something..."
          contentRight={
            <Button
              auto
              light
              onPress={handleSearch}
              icon={<IconlyPack.Search set="light" primaryColor="#889096" />}
              animated='false'
            >
            </Button>
          }
          onKeyDown={handleKeyDown}
          onChange={keyUp}
        ></Input>
        <Spacer></Spacer>
      </div>
      {
        results.length === 0 ? <></> :
          <Container className="results">
            <Col>
              {results.map((e) => {
                return (
                  <div key={e.key}>
                    <Card>
                      <Card.Header>
                        <Text b>{e.title}</Text>
                      </Card.Header>
                      <Card.Divider></Card.Divider>
                      <Card.Body>
                        <Text b>Matched: {e.match}</Text>
                        <Text color="warning">{e.author}</Text>
                        <Text color="secondary">{e.date}</Text>
                        <Text>{e.abstract}</Text>
                      </Card.Body>
                      <Card.Divider></Card.Divider>
                      <Card.Footer>
                        <Row>
                          <Text b>Matchin Degree: {e.md}</Text>
                          <Spacer x={15}></Spacer>
                          <a href={e.url} css={{ width: '100%' }}>
                            <Button >Go To WebSite</Button>
                          </a>
                        </Row>
                      </Card.Footer>
                    </Card>
                    <Spacer y={1}></Spacer>
                  </div>
                )
              })}
            </Col>
          </Container>
      }
    </div>
  );
}

export default App;
