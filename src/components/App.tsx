import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";
import ChatWindow from "./chat";
import Header from "./Header";

export const socket = io("http://localhost:5000");

type User = {
  id: string;
  username: string;
};

export type ChatMessage = {
  user: User;
  text: string;
  image64?: string;
};

let fakeMessages: ChatMessage[] = [
  { user: { id: "1", username: "Mike" }, text: "go NU!" },
  { user: { id: "2", username: "Dustin" }, text: "NU will lose!" },
  { user: { id: "3", username: "Mer" }, text: "where's the kitty?" },
  {
    user: { id: "4", username: "Me" },
    text: "don't worry, she'll be back...",
  },
  { user: { id: "5", username: "Brian" }, text: "yup" },
];

function App(): React.ReactElement {
  const [currentTime, setCurrentTime] = useState("(fetching...)");
  const [messages, setMessages] = useState(fakeMessages);
  const [userList, setUserList] = useState<string[]>([]);

  function addMessage(newMessage: ChatMessage) {
    setMessages([...messages, newMessage]);
  }

  socket.on("message", (msg) => {
    addMessage(msg);
  });

  type UserObject = {
    id: string;
  };

  function addUser(newUser: UserObject) {
    setUserList([...userList, newUser.id]);
  }

  socket.on("newUser", (user) => {
    addUser(user);
    console.log(userList);
  });

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
      <p>
        The time as of page load was: {currentTime} (fetched from the Flask
        backend time API).
      </p>
      <ChatWindow messages={messages} addMessage={addMessage}></ChatWindow>
    </div>
  );
}

export default App;
