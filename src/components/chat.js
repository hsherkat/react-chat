"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
require("./chat.css");
function MessageInput({ addMessage }) {
    function onMessageSend(e) {
        if (e.key === "Enter") {
            let msg = {
                user: "You",
                text: e.target.value,
            };
            e.target.value = "";
            addMessage(msg);
        }
    }
    return (react_1.default.createElement("div", { className: "MessageInput" },
        react_1.default.createElement("input", { type: "text", placeholder: "Press Enter to send", onKeyDown: (e) => onMessageSend(e) })));
}
let fakeMessages = [
    { user: "Mike", text: "go NU!" },
    { user: "Dustin", text: "NU will lose!" },
];
function MessagesBox({ messages }) {
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("ul", null, messages.map((msg, index) => {
            return (react_1.default.createElement("li", { key: index },
                react_1.default.createElement("span", { className: "message-user" }, msg.user),
                ":",
                " ",
                react_1.default.createElement("span", { className: "message-text" }, msg.text)));
        }))));
}
function MessageWindow() {
    const [messages, setMessages] = (0, react_1.useState)(fakeMessages);
    function addMessage(newMessage) {
        setMessages([...messages, newMessage]);
    }
    return (react_1.default.createElement("div", { className: "MessageWindow" },
        react_1.default.createElement(MessagesBox, { messages: messages }),
        react_1.default.createElement(MessageInput, { addMessage: addMessage })));
}
exports.default = MessageWindow;
