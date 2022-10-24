import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";
import ChatWindow from "./chat";
import Header from "./Header";

export const socket = io("http://localhost:5000");

export type ChatMessage = {
  user: string;
  text: string;
  image64?: string;
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
  const [username, setUsername] = useState("Anonymous");
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
      <ChatWindow
        messages={messages}
        addMessage={addMessage}
        username={username}
        setUsername={setUsername}
      ></ChatWindow>
    </div>
  );
}

export default App;
