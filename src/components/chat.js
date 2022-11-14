import React, { useCallback, useEffect, useRef, useState, } from "react";
import Button from "react-bootstrap/Button";
import Webcam from "react-webcam";
import { socket } from "./App";
import "./chat.css";
function MessageInput() {
    const inputRef = useRef(null);
    function onMessageSendEnter(e) {
        if (e.key === "Enter") {
            let msg = {
                text: e.currentTarget.value,
            };
            e.currentTarget.value = "";
            socket.emit("message", msg);
        }
    }
    function onMessageSendClick(e) {
        if (inputRef.current !== null) {
            let msg = {
                text: inputRef.current.value,
            };
            inputRef.current.value = "";
            socket.emit("message", msg);
        }
    }
    return (React.createElement("div", { className: "MessageInput" },
        React.createElement("input", { className: "MessageInput--text", type: "text", placeholder: "Press <Enter> to send message", onKeyDown: (e) => onMessageSendEnter(e), ref: inputRef }),
        React.createElement(Button, { onClick: (e) => onMessageSendClick(e) }, "Send")));
}
function MessagesBox({ messages }) {
    return (React.createElement("div", { className: "MessagesBox" },
        React.createElement("ul", null, messages.map((msg, index) => {
            return (React.createElement("li", { key: index },
                React.createElement("span", { className: "message-user", style: { color: msg.user.color || "Black" } }, msg.user.username),
                ": ",
                React.createElement("span", { className: "message-text" }, msg.text),
                React.createElement("img", { src: msg.image64, alt: "" })));
        }))));
}
const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
};
function WebcamCapture() {
    const webcamRef = useRef(null);
    const capture = useCallback(() => {
        var _a;
        const imageSrc = (_a = webcamRef.current) === null || _a === void 0 ? void 0 : _a.getScreenshot();
        let msg = {
            text: "",
            image64: imageSrc,
        };
        socket.emit("message", msg);
    }, [webcamRef]);
    return (React.createElement("div", { className: "webcam" },
        React.createElement(Webcam, { className: "webcam-canvas", audio: false, height: 180, ref: webcamRef, screenshotFormat: "image/jpeg", width: 320, videoConstraints: videoConstraints }),
        React.createElement("button", { className: "webcam-capture-button", onClick: capture }, "Send photo")));
}
function UserWindow() {
    const [userList, setUserList] = useState([]);
    const usernameRef = useRef(null);
    const colorRef = useRef(null);
    useEffect(() => {
        socket.on("usersChange", (users) => {
            setUserList(Object.values(users));
        });
    }, []);
    function onUsernameChangeEnter(e) {
        if (e.key === "Enter") {
            const newName = e.target.value;
            socket.emit("usernameChange", newName);
        }
    }
    function onUsernameChangeClick(e) {
        if (usernameRef.current !== null) {
            const newName = usernameRef.current.value;
            socket.emit("usernameChange", newName);
        }
    }
    function onColorChangeEnter(e) {
        if (e.key === "Enter") {
            const newColor = e.target.value;
            socket.emit("colorChange", newColor);
        }
    }
    function onColorChangeClick(e) {
        if (colorRef.current !== null) {
            const newColor = colorRef.current.value;
            socket.emit("colorChange", newColor);
        }
    }
    return (React.createElement("div", { className: "UserWindow" },
        React.createElement("span", null, "Active users:"),
        React.createElement("ul", { className: "users-list" }, userList.map((user) => (React.createElement("li", { key: user.id, style: { color: user.color || "Black" } }, user.username)))),
        React.createElement("hr", null),
        React.createElement("span", null, " Input your info:"),
        React.createElement("div", { className: "username-input" },
            React.createElement("label", { htmlFor: "username" }, " Username: "),
            React.createElement("input", { type: "text", minLength: 1, maxLength: 70, placeholder: "Press <Enter> to change", onKeyDown: (e) => onUsernameChangeEnter(e), ref: usernameRef }),
            React.createElement(Button, { onClick: (e) => onUsernameChangeClick(e) }, "Change")),
        React.createElement("div", { className: "color-input" },
            React.createElement("label", { htmlFor: "color" }, " Color: "),
            React.createElement("input", { type: "text", minLength: 1, maxLength: 25, placeholder: "Press <Enter> to change", onKeyDown: (e) => onColorChangeEnter(e), ref: colorRef }),
            React.createElement(Button, { onClick: (e) => onColorChangeClick(e) }, "Change")),
        React.createElement("hr", null),
        React.createElement(WebcamCapture, null)));
}
function ChatWindow({ messages, addMessage }) {
    return (React.createElement("div", { className: "ChatWindow" },
        React.createElement("div", { className: "MessageUserSplit" },
            React.createElement(MessagesBox, { messages: messages }),
            React.createElement(UserWindow, null)),
        React.createElement(MessageInput, null)));
}
export default ChatWindow;
