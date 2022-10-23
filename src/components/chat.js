"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const App_1 = require("./App");
require("./chat.css");
function MessageInput({ username, addMessage, }) {
    function onMessageSend(e) {
        if (e.key === "Enter") {
            let msg = {
                user: username,
                text: e.target.value,
            };
            e.target.value = "";
            // addMessage(msg);
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
                react_1.default.createElement("span", { className: "message-text" }, msg.text)));
        }))));
}
function UserWindow({ username, setUsername }) {
    return (react_1.default.createElement("div", { className: "UserWindow" },
        react_1.default.createElement("span", null, "Active users"),
        react_1.default.createElement("ul", { className: "users-list" }),
        react_1.default.createElement("hr", null),
        react_1.default.createElement("span", null, " Input your info:"),
        react_1.default.createElement("form", { className: "user-input" },
            react_1.default.createElement("label", { htmlFor: "username" }, "Username "),
            react_1.default.createElement("input", { type: "text", value: username, onChange: (e) => {
                    setUsername(e.target.value);
                    console.log(e.target.value);
                } }))));
}
function ChatWindow({ messages, addMessage, username, setUsername, }) {
    return (react_1.default.createElement("div", { className: "ChatWindow" },
        react_1.default.createElement("div", { className: "MessageUserSplit" },
            react_1.default.createElement(MessagesBox, { messages: messages }),
            react_1.default.createElement(UserWindow, { username: username, setUsername: setUsername })),
        react_1.default.createElement(MessageInput, { username: username, addMessage: addMessage })));
}
exports.default = ChatWindow;
