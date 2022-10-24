import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Webcam from "react-webcam";
import { ChatMessage, socket, User } from "./App";
import "./chat.css";

function MessageInput(): ReactElement {
  function onMessageSend(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      let msg = {
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
              <span className="message-user">{msg.user.username}</span>:{" "}
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

function WebcamCapture() {
  const webcamRef = useRef<Webcam>(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    let msg = {
      text: "",
      image64: imageSrc,
    };
    socket.emit("message", msg);
  }, [webcamRef]);
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

function UserWindow(): ReactElement {
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    socket.on("usersChange", (users) => {
      setUserList(Object.values(users));
      console.log(userList);
    });
  }, []);

  function onUsernameEntered(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const newName = (e.target as HTMLInputElement).value;
      socket.emit("usernameChange", newName);
    }
  }

  return (
    <div className="UserWindow">
      <span>Active users</span>
      <ul className="users-list">
        {userList.map((user: User) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
      <hr></hr>
      <span> Input your info:</span>
      <div className="username-input">
        <label htmlFor="username">Username </label>
        <input
          type="text"
          minLength={1}
          maxLength={70}
          placeholder="Press <Enter> to change username"
          onKeyDown={(e) => onUsernameEntered(e)}
        ></input>
      </div>
      <hr></hr>
      <WebcamCapture></WebcamCapture>
    </div>
  );
}

type ChatWindowProps = {
  messages: ChatMessage[];
  addMessage: Function;
};

function ChatWindow({ messages, addMessage }: ChatWindowProps): ReactElement {
  return (
    <div className="ChatWindow">
      <div className="MessageUserSplit">
        <MessagesBox messages={messages}></MessagesBox>
        <UserWindow></UserWindow>
      </div>
      <MessageInput></MessageInput>
    </div>
  );
}

export default ChatWindow;
