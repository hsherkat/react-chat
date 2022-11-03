import React, { useCallback, useEffect, useRef, useState, } from "react";
import Webcam from "react-webcam";
import { socket } from "./App";
import "./chat.css";
function MessageInput() {
    function onMessageSend(e) {
        if (e.key === "Enter") {
            let msg = {
                text: e.target.value,
            };
            e.target.value = "";
            socket.emit("message", msg);
        }
    }
    return (React.createElement("div", { className: "MessageInput" },
        React.createElement("input", { className: "MessageInput--text", type: "text", placeholder: "Press <Enter> to send message", onKeyDown: (e) => onMessageSend(e) })));
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
    useEffect(() => {
        socket.on("usersChange", (users) => {
            setUserList(Object.values(users));
        });
    }, []);
    function onUsernameEntered(e) {
        if (e.key === "Enter") {
            const newName = e.target.value;
            socket.emit("usernameChange", newName);
        }
    }
    function onColorEntered(e) {
        if (e.key === "Enter") {
            const newColor = e.target.value;
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
            React.createElement("input", { type: "text", minLength: 1, maxLength: 70, placeholder: "Press <Enter> to change username", onKeyDown: (e) => onUsernameEntered(e) })),
        React.createElement("div", { className: "color-input" },
            React.createElement("label", { htmlFor: "color" }, " Color: "),
            React.createElement("input", { type: "text", minLength: 1, maxLength: 25, placeholder: "Press <Enter> to change color", onKeyDown: (e) => onColorEntered(e) })),
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
