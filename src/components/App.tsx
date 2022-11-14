import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";
import ChatWindow from "./chat";
import Header from "./Header";

const prevSessionID = localStorage.getItem("sessionID");

export const socket = io("http://47.148.77.187", {
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
  { user: { id: "1", username: "Mike", color: "Purple" }, text: "test msg" },
  {
    user: { id: "2", username: "Dustin", color: "Brown" },
    text: "testing testing",
  },
  {
    user: { id: "3", username: "Mer", color: "Pink" },
    text: "testing 123",
  },
  {
    user: { id: "4", username: "Me", color: "LightBlue" },
    text: "test MESSAGE!",
  },
  { user: { id: "5", username: "Brian" }, text: "test" },
];

export function App(): React.ReactElement {
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

  return (
    <div className="App">
      <Header text="Hooman's React Chat App" /> <hr></hr>
      <ChatWindow messages={messages} addMessage={addMessage}></ChatWindow>
    </div>
  );
}
