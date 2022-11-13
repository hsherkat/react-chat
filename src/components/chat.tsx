import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Button from "react-bootstrap/Button";
import Webcam from "react-webcam";
import { ChatMessage, socket, User } from "./App";
import "./chat.css";

function MessageInput(): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);

  function onMessageSendEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      let msg = {
        text: (e.currentTarget as HTMLInputElement).value,
      };
      (e.currentTarget as HTMLInputElement).value = "";
      socket.emit("message", msg);
    }
  }
  function onMessageSendClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (inputRef.current !== null) {
      let msg = {
        text: inputRef.current.value,
      };
      inputRef.current.value = "";
      socket.emit("message", msg);
    }
  }

  return (
    <div className="MessageInput">
      <input
        className="MessageInput--text"
        type="text"
        placeholder="Press <Enter> to send message"
        onKeyDown={(e) => onMessageSendEnter(e)}
        ref={inputRef}
      ></input>
      <Button onClick={(e) => onMessageSendClick(e)}>Send</Button>
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
              <span
                className="message-user"
                style={{ color: msg.user.color || "Black" }}
              >
                {msg.user.username}
              </span>
              : <span className="message-text">{msg.text}</span>
              <img src={msg.image64} alt=""></img>
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
        className="webcam-canvas"
        audio={false}
        height={180}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        videoConstraints={videoConstraints}
      />
      <button className="webcam-capture-button" onClick={capture}>
        Send photo
      </button>
    </div>
  );
}

function UserWindow(): ReactElement {
  const [userList, setUserList] = useState<User[]>([]);
  const usernameRef = useRef<HTMLInputElement>(null);
  const colorRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    socket.on("usersChange", (users) => {
      setUserList(Object.values(users));
    });
  }, []);

  function onUsernameChangeEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const newName = (e.target as HTMLInputElement).value;
      socket.emit("usernameChange", newName);
    }
  }

  function onUsernameChangeClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (usernameRef.current !== null) {
      const newName = usernameRef.current.value;
      socket.emit("usernameChange", newName);
    }
  }

  function onColorChangeEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const newColor = (e.target as HTMLInputElement).value;
      socket.emit("colorChange", newColor);
    }
  }

  function onColorChangeClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (colorRef.current !== null) {
      const newColor = colorRef.current.value;
      socket.emit("colorChange", newColor);
    }
  }

  return (
    <div className="UserWindow">
      <span>Active users:</span>
      <ul className="users-list">
        {userList.map((user: User) => (
          <li key={user.id} style={{ color: user.color || "Black" }}>
            {user.username}
          </li>
        ))}
      </ul>

      <hr></hr>

      <span> Input your info:</span>

      <div className="username-input">
        <label htmlFor="username"> Username: </label>
        <input
          type="text"
          minLength={1}
          maxLength={70}
          placeholder="Press <Enter> to change username"
          onKeyDown={(e) => onUsernameChangeEnter(e)}
          ref={usernameRef}
        ></input>
        <Button onClick={(e) => onUsernameChangeClick(e)}>Change</Button>
      </div>

      <div className="color-input">
        <label htmlFor="color"> Color: </label>
        <input
          type="text"
          minLength={1}
          maxLength={25}
          placeholder="Press <Enter> to change color"
          onKeyDown={(e) => onColorChangeEnter(e)}
          ref={colorRef}
        ></input>
        <Button onClick={(e) => onColorChangeClick(e)}>Change</Button>
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
