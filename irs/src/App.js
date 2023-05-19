import { Text, Input, Spacer, Button, Container, Col, Card, Row, Modal, Radio, useTheme } from "@nextui-org/react"
import { useState, useEffect } from "react"
import { Voice, Search } from 'react-iconly'
import './animation.css'
import axios from "axios"
import { useSpeechContext } from '@speechly/react-client';

function App() {
  const { theme } = useTheme()
  const { segment, listening, attachMicrophone, start, stop } = useSpeechContext();
  const [inputValue, setInputValue] = useState('')
  const [results, setResults] = useState([])
  const [rateOpen, setRateOpen] = useState(false)
  const [rateBut, setRateBut] = useState(true)
  const [rateScore, setRateScore] = useState('-1')
  const [tentative, setTentative] = useState('')
  const [isSearched, setIsSearched] = useState(false)

  useEffect(() => {
    if (segment) {
      const transcript = segment.words.map((word) => word.value).join(' ');
      setTentative(transcript);
      setInputValue(transcript)
      if (segment.isFinal) {
        stop()
        handleSearch()
      }
    }
    // eslint-disable-next-line
  }, [segment]);

  const handleSearch = () => {
    if (inputValue !== '') {
      axios.get("http://127.0.0.1:8000/irs", {
        params: {
          message: inputValue
        }
      }).then((res) => {
        setResults(res.data)
        setRateBut(false)
        setIsSearched(true)
        var wrapper = document.querySelector('.wrapper')
        wrapper.style.animationName = 'ball'
        wrapper.style.animationDuration = '0.5s'
        wrapper.style.animationFillMode = 'both'
      })
    }
  }

  const handleRate = () => {
    if (rateScore !== '-1')
      axios({
        url: "http://127.0.0.1:8000/rate",
        method: "post",
        data: {
          query: inputValue,
          rate: rateScore
        }
      })
  }

  const handleRateClose = () => {
    setRateOpen(false)
    setRateBut(true)
    handleRate()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  const keyUp = (event) => {
    setInputValue(event.target.value)
  }

  const handleClick = async () => {
    if (listening) {
      await stop();
      handleSearch()
    } else {
      await attachMicrophone();
      await start();
    }
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
        <Modal onClose={handleRateClose} open={rateOpen}>
          <Modal.Body css={{ margin: "20px" }}>
            <Radio.Group label="How do you think of the search results?" defaultValue="-1" onChange={(e) => { setRateScore(e) }}>
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
        {listening ? <Input
          width="100%"
          underlined
          color="primary"
          status="default"
          labelPlaceholder="Search something..."
          value={tentative}
          contentRight={
            <>
              <Button
                auto
                light
                onPress={handleSearch}
                icon={<Search set="light" primaryColor="#889096" />}
                animated='false'
              >
              </Button>
            </>
          }
          onKeyDown={handleKeyDown}
          onChange={keyUp}
        /> : <Input
          width="100%"
          underlined
          color="primary"
          status="default"
          labelPlaceholder="Search something..."
          contentRight={
            <>
              <Button
                auto
                light
                onPress={handleSearch}
                icon={<Search set="light" primaryColor="#889096" />}
                animated='false'
              >
              </Button>
            </>
          }
          onKeyDown={handleKeyDown}
          onChange={keyUp}
        />}
        <Spacer></Spacer>
        <Button onPress={handleClick} icon={
          listening ?
            <Voice set="bold" primaryColor={theme.colors.gradient.value} /> :
            <Voice set="broken" primaryColor="blueviolet" />
        } auto bordered >
        </Button>
      </div>
      {
        results.length === 0 ?
              <Container>
                <Row justify="center" align="center">
                  {isSearched && <Text em>No Results.</Text>}
                </Row>
              </Container>
           :
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
                          <Text b>Matching Degree: {e.md}</Text>
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
