import React, { ReactElement } from "react";
import { ChatMessage, socket } from "./App";
import "./chat.css";

type MessageInputProps = {
  username: string;
  addMessage: Function;
};

function MessageInput({
  username,
  addMessage,
}: MessageInputProps): ReactElement {
  function onMessageSend(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      let msg: ChatMessage = {
        user: username,
        text: (e.target as HTMLTextAreaElement).value,
      };
      (e.target as HTMLTextAreaElement).value = "";
      // addMessage(msg);
      socket.emit("message", msg);
    }
  }

  return (
    <div className="MessageInput">
      <input
        className="MessageInput--text"
        type="text"
        placeholder="Press <Enter> to send message"
        onKeyDown={(e) => onMessageSend(e)}
      ></input>
    </div>
  );
}

type MessagesBoxProps = {
  messages: ChatMessage[];
};

function MessagesBox({ messages }: MessagesBoxProps): ReactElement {
  return (
    <div className="MessagesBox">
      <ul>
        {messages.map((msg, index) => {
          return (
            <li key={index}>
              <span className="message-user">{msg.user}</span>:{" "}
              <span className="message-text">{msg.text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type UserWindowProps = {
  username: string;
  setUsername: Function;
};

function UserWindow({ username, setUsername }: UserWindowProps): ReactElement {
  return (
    <div className="UserWindow">
      <span>Active users</span>
      <ul className="users-list"></ul>
      <hr></hr>
      <span> Input your info:</span>
      <form className="user-input">
        <label htmlFor="username">Username </label>
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername((e.target as HTMLInputElement).value);
            console.log((e.target as HTMLInputElement).value);
          }}
        ></input>
      </form>
    </div>
  );
}

type ChatWindowProps = {
  messages: ChatMessage[];
  addMessage: Function;
  username: string;
  setUsername: Function;
};

function ChatWindow({
  messages,
  addMessage,
  username,
  setUsername,
}: ChatWindowProps): ReactElement {
  return (
    <div className="ChatWindow">
      <div className="MessageUserSplit">
        <MessagesBox messages={messages}></MessagesBox>
        <UserWindow username={username} setUsername={setUsername}></UserWindow>
      </div>
      <MessageInput username={username} addMessage={addMessage}></MessageInput>
    </div>
  );
}

export default ChatWindow;
