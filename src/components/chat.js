"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_webcam_1 = __importDefault(require("react-webcam"));
const App_1 = require("./App");
require("./chat.css");
function MessageInput({ username }) {
    function onMessageSend(e) {
        if (e.key === "Enter") {
            let msg = {
                user: username,
                text: e.target.value,
            };
            e.target.value = "";
            App_1.socket.emit("message", msg);
        }
    }
    return (react_1.default.createElement("div", { className: "MessageInput" },
        react_1.default.createElement("input", { className: "MessageInput--text", type: "text", placeholder: "Press <Enter> to send message", onKeyDown: (e) => onMessageSend(e) })));
}
function MessagesBox({ messages }) {
    return (react_1.default.createElement("div", { className: "MessagesBox" },
        react_1.default.createElement("ul", null, messages.map((msg, index) => {
            return (react_1.default.createElement("li", { key: index },
                react_1.default.createElement("span", { className: "message-user" }, msg.user),
                ":",
                " ",
                react_1.default.createElement("span", { className: "message-text" }, msg.text),
                react_1.default.createElement("img", { src: msg.image64 })));
        }))));
}
const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
};
function WebcamCapture({ username }) {
    const webcamRef = react_1.default.useRef(null);
    const capture = react_1.default.useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        let msg = {
            user: username,
            text: "",
            image64: imageSrc,
        };
        App_1.socket.emit("message", msg);
    }, [webcamRef, username]);
    return (react_1.default.createElement("div", { className: "webcam" },
        react_1.default.createElement(react_webcam_1.default, { audio: false, height: 180, ref: webcamRef, screenshotFormat: "image/jpeg", width: 320, videoConstraints: videoConstraints }),
        react_1.default.createElement("button", { onClick: capture }, "Send photo")));
}
function UserWindow({ username, setUsername }) {
    return (react_1.default.createElement("div", { className: "UserWindow" },
        react_1.default.createElement("span", null, "Active users"),
        react_1.default.createElement("ul", { className: "users-list" }),
        react_1.default.createElement("hr", null),
        react_1.default.createElement("span", null, " Input your info:"),
        react_1.default.createElement("form", { className: "username-input" },
            react_1.default.createElement("label", { htmlFor: "username" }, "Username "),
            react_1.default.createElement("input", { type: "text", value: username, onChange: (e) => {
                    setUsername(e.target.value);
                } })),
        react_1.default.createElement("hr", null),
        react_1.default.createElement(WebcamCapture, { username: username })));
}
function ChatWindow({ messages, addMessage, username, setUsername, }) {
    return (react_1.default.createElement("div", { className: "ChatWindow" },
        react_1.default.createElement("div", { className: "MessageUserSplit" },
            react_1.default.createElement(MessagesBox, { messages: messages }),
            react_1.default.createElement(UserWindow, { username: username, setUsername: setUsername })),
        react_1.default.createElement(MessageInput, { username: username })));
}
exports.default = ChatWindow;
