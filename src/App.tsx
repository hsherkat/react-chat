import React, { useEffect, useState } from "react";
import "./App.css";

function App(): React.ReactElement {
  const [currentTime, setCurrentTime] = useState(0);
  
  useEffect(() => {
    fetch('/api').then(res => {
      console.log(res);
      return res.json()}).then(data => {
      setCurrentTime(data.time);
    });
  }, []);
  return (
    <div className="App">
      <header className="App-header">App's header is here!</header>
      <p>Fetched from the flask backend: time is {currentTime}.</p>
    </div>
  );
}

export default App;
