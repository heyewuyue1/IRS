import React from "react";
import { Text } from "@nextui-org/react";
// import { Button } from "@nextui-org/react";
import Search from "./components/SearchBox"
import initialDetails from "./data/initialDetails"
const {ipcRenderer} = window.require('electron')

function App() {

  // const query = async () => {
  //   let reply = await ipcRenderer.invoke("query", "ping")
  //   console.log(reply)
  // }

  return (
    <div style={{width:"100vw", height:"100vh", backgroundColor: "#171717"}}>
      {/* <Text h1 css={{
          textGradient: "45deg, $blue600 -20%, $pink600 50%",
        }}>欢迎使用信息检索系统</Text> */}
      {/* <Button onPress={query}>
        aaa
      </Button> */}
      <div>
        <Search details={initialDetails}/>
      </div>
    </div>
  );
}

export default App;
