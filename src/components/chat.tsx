import React, { ReactElement } from "react";
import Webcam from "react-webcam";
import { ChatMessage, socket } from "./App";
import "./chat.css";

type MessageInputProps = {
  username: string;
};

function MessageInput({ username }: MessageInputProps): ReactElement {
  function onMessageSend(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      let msg: ChatMessage = {
        user: username,
        text: (e.target as HTMLTextAreaElement).value,
      };
      (e.target as HTMLTextAreaElement).value = "";
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
              <img src={msg.image64}></img>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

type WebcamCaptureProps = {
  username: string;
};

function WebcamCapture({ username }: WebcamCaptureProps) {
  const webcamRef = React.useRef(null);
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    let msg: ChatMessage = {
      user: username,
      text: "",
      image64: imageSrc,
    };
    socket.emit("message", msg);
  }, [webcamRef, username]);
  return (
    <div className="webcam">
      <Webcam
        audio={false}
        height={180}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        videoConstraints={videoConstraints}
      />
      <button onClick={capture}>Send photo</button>
    </div>
  );
}

type UserWindowProps = {
  username: string;
  setUsername: Function;
};

function UserWindow({ username, setUsername }: UserWindowProps): ReactElement {
  function onUsernameEntered(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const newName = (e.target as HTMLInputElement).value;
      setUsername(newName);
      console.log(newName);
    }
  }

  return (
    <div className="UserWindow">
      <span>Active users</span>
      <ul className="users-list"></ul>
      <hr></hr>
      <span> Input your info:</span>
      <div className="username-input">
        <label htmlFor="username">Username </label>
        <input
          type="text"
          placeholder="Press <Enter> to change username"
          onKeyDown={(e) => onUsernameEntered(e)}
        ></input>
      </div>
      <hr></hr>
      <WebcamCapture username={username}></WebcamCapture>
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
      <MessageInput username={username}></MessageInput>
    </div>
  );
}

export default ChatWindow;
