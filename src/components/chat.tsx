import React, { ReactElement, useState } from "react";
import "./chat.css";

type ChatMessage = {
  user: string;
  text: string;
};

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
        type="text"
        placeholder="Press Enter to send"
        onKeyDown={(e) => onMessageSend(e)}
      ></input>
    </div>
  );
}

let fakeMessages: ChatMessage[] = [
  { user: "Mike", text: "go NU!" },
  { user: "Dustin", text: "NU will lose!" },
];

type MessagesBoxProps = {
  messages: ChatMessage[];
};

function MessagesBox({ messages }: MessagesBoxProps): ReactElement {
  return (
    <div>
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

function MessageWindow(): ReactElement {
  const [messages, setMessages] = useState(fakeMessages);

  function addMessage(newMessage: ChatMessage) {
    setMessages([...messages, newMessage]);
  }

  return (
    <div className="MessageWindow">
      <MessagesBox messages={messages}></MessagesBox>
      <MessageInput addMessage={addMessage}></MessageInput>
    </div>
  );
}

export default MessageWindow;
