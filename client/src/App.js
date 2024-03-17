import {io} from "socket.io-client";
import React, { useState } from 'react';

function App() {
  const socket = io("http://localhost:5000");
  const [output,setOutput]=useState("");
  const handleStartClient=()=>{
    socket.emit("StartClient");
    socket.on("stdout",(data)=>{
      setOutput(data);
    })
  }
  const handleStartServer=()=>{
    socket.emit("StartServer");
  }
  return (
    <div className="App">
      <button onClick={handleStartServer} >Start Server</button>
      <button onClick={handleStartClient}>Start Client</button>
      <div>{output}</div>
    </div>
  );
}

export default App;
