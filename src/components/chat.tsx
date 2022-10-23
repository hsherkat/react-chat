import React, { ReactElement } from "react";
import { ChatMessage } from "./App";
import "./chat.css";

type MessageInputProps = {
  addMessage: Function;
};

function MessageInput({ addMessage }: MessageInputProps): ReactElement {
  function onMessageSend(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      let msg: ChatMessage = {
        user: "You",
        text: (e.target as HTMLTextAreaElement).value,
      };
      (e.target as HTMLTextAreaElement).value = "";
      addMessage(msg);
    }
  }

  return (
    <div className="MessageInput">
      <input
        className="MessageInput--text"
        type="text"
        placeholder="Press Enter to send"
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

function MessageWindow({ messages, addMessage }): ReactElement {
  return (
    <div className="MessageWindow">
      <MessagesBox messages={messages}></MessagesBox>
      <MessageInput addMessage={addMessage}></MessageInput>
    </div>
  );
}

export default MessageWindow;
