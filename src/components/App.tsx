import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";
import ChatWindow from "./chat";
import Header from "./Header";

const prevSessionID = localStorage.getItem("sessionID");

export const socket = io("http://localhost:5000", {
  auth: { prevID: prevSessionID },
});

function onConnect(user: User) {
  localStorage.setItem("sessionID", user.id);
}

socket.on("session", onConnect);

export type User = {
  id: string;
  username: string;
  color?: string;
};

export type ChatMessage = {
  user: User;
  text: string;
  image64?: string;
};

let fakeMessages: ChatMessage[] = [
  { user: { id: "1", username: "Mike", color: "Purple" }, text: "go NU!" },
  {
    user: { id: "2", username: "Dustin", color: "Brown" },
    text: "NU will lose!",
  },
  {
    user: { id: "3", username: "Mer", color: "Pink" },
    text: "where's the kitty?",
  },
  {
    user: { id: "4", username: "Me", color: "LightBlue" },
    text: "don't worry, she'll be back...",
  },
  { user: { id: "5", username: "Brian" }, text: "yup" },
];

export function App(): React.ReactElement {
  const [currentTime, setCurrentTime] = useState("(fetching...)");
  const [messages, setMessages] = useState(fakeMessages);

  function addMessage(newMessage: ChatMessage) {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }

  useEffect(() => {
    socket.on("message", addMessage);

    return () => {
      socket.off("message", addMessage);
    };
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      const userPosition = position.coords;
      const query = new URLSearchParams({
        latitude: userPosition.latitude.toString(),
        longitude: userPosition.longitude.toString(),
      });
      fetch("/time?" + query.toString())
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
