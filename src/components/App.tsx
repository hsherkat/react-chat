import React, { useEffect, useState } from "react";
import "./App.css";
import MessageWindow from "./chat";
import Header from "./Header";

function App(): React.ReactElement {
  const [currentTime, setCurrentTime] = useState("(fetching...)");
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      const userPosition = position.coords;
      const query = new URLSearchParams({
        latitude: userPosition.latitude.toString(),
        longitude: userPosition.longitude.toString(),
      });
      fetch("/api?" + query.toString())
        .then((res) => res.json())
        .then((data) => {
          setCurrentTime(data.time);
        })
        .catch((error) => console.log(error));
    });
  }, []);

  return (
    <div className="App">
      <Header text="React Chat App" /> <hr></hr>
      <p>Fetched from the flask backend: time is: {currentTime}.</p>
      <MessageWindow></MessageWindow>
    </div>
  );
}

export default App;
