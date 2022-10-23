import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";
import MessageWindow from "./chat";
import Header from "./Header";

const socket = io("http://localhost:5000");

export type ChatMessage = {
  user: string;
  text: string;
};

let fakeMessages: ChatMessage[] = [
  { user: "Mike", text: "go NU!" },
  { user: "Dustin", text: "NU will lose!" },
  { user: "Mer", text: "where's the kitty?" },
  {
    user: "You",
    text: "don't worry, she'll be back... i'm irresistable to pussy 8-)",
  },
  { user: "Brian", text: "heyooooo" },
];

function App(): React.ReactElement {
  const [currentTime, setCurrentTime] = useState("(fetching...)");
  const [messages, setMessages] = useState(fakeMessages);

  function addMessage(newMessage: ChatMessage) {
    setMessages([...messages, newMessage]);
  }

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
      <MessageWindow
        messages={messages}
        addMessage={addMessage}
      ></MessageWindow>
    </div>
  );
}

export default App;
