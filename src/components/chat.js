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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_webcam_1 = __importDefault(require("react-webcam"));
const App_1 = require("./App");
require("./chat.css");
function MessageInput() {
    function onMessageSend(e) {
        if (e.key === "Enter") {
            let msg = {
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
                react_1.default.createElement("span", { className: "message-user" }, msg.user.username),
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
function WebcamCapture() {
    const webcamRef = (0, react_1.useRef)(null);
    const capture = (0, react_1.useCallback)(() => {
        var _a;
        const imageSrc = (_a = webcamRef.current) === null || _a === void 0 ? void 0 : _a.getScreenshot();
        let msg = {
            text: "",
            image64: imageSrc,
        };
        App_1.socket.emit("message", msg);
    }, [webcamRef]);
    return (react_1.default.createElement("div", { className: "webcam" },
        react_1.default.createElement(react_webcam_1.default, { className: "webcam-canvas", audio: false, height: 180, ref: webcamRef, screenshotFormat: "image/jpeg", width: 320, videoConstraints: videoConstraints }),
        react_1.default.createElement("button", { className: "webcam-capture-button", onClick: capture }, "Send photo")));
}
function UserWindow() {
    const [userList, setUserList] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        App_1.socket.on("usersChange", (users) => {
            setUserList(Object.values(users));
            console.log(userList);
        });
    }, []);
    function onUsernameEntered(e) {
        if (e.key === "Enter") {
            const newName = e.target.value;
            App_1.socket.emit("usernameChange", newName);
        }
    }
    return (react_1.default.createElement("div", { className: "UserWindow" },
        react_1.default.createElement("span", null, "Active users"),
        react_1.default.createElement("ul", { className: "users-list" }, userList.map((user) => (react_1.default.createElement("li", { key: user.id }, user.username)))),
        react_1.default.createElement("hr", null),
        react_1.default.createElement("span", null, " Input your info:"),
        react_1.default.createElement("div", { className: "username-input" },
            react_1.default.createElement("label", { htmlFor: "username" }, "Username "),
            react_1.default.createElement("input", { type: "text", minLength: 1, maxLength: 70, placeholder: "Press <Enter> to change username", onKeyDown: (e) => onUsernameEntered(e) })),
        react_1.default.createElement("hr", null),
        react_1.default.createElement(WebcamCapture, null)));
}
function ChatWindow({ messages, addMessage }) {
    return (react_1.default.createElement("div", { className: "ChatWindow" },
        react_1.default.createElement("div", { className: "MessageUserSplit" },
            react_1.default.createElement(MessagesBox, { messages: messages }),
            react_1.default.createElement(UserWindow, null)),
        react_1.default.createElement(MessageInput, null)));
}
exports.default = ChatWindow;
