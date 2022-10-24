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
exports.socket = void 0;
const react_1 = __importStar(require("react"));
const socket_io_client_1 = __importDefault(require("socket.io-client"));
require("./App.css");
const chat_1 = __importDefault(require("./chat"));
const Header_1 = __importDefault(require("./Header"));
exports.socket = (0, socket_io_client_1.default)("http://localhost:5000");
let fakeMessages = [
    { user: "Mike", text: "go NU!" },
    { user: "Dustin", text: "NU will lose!" },
    { user: "Mer", text: "where's the kitty?" },
    {
        user: "You",
        text: "don't worry, she'll be back... i'm irresistable to pussy 8-)",
    },
    { user: "Brian", text: "heyooooo" },
];
function App() {
    const [currentTime, setCurrentTime] = (0, react_1.useState)("(fetching...)");
    const [messages, setMessages] = (0, react_1.useState)(fakeMessages);
    const [username, setUsername] = (0, react_1.useState)("Anonymous");
    const [userList, setUserList] = (0, react_1.useState)([]);
    function addMessage(newMessage) {
        setMessages([...messages, newMessage]);
    }
    exports.socket.on("message", (msg) => {
        addMessage(msg);
    });
    function addUser(newUser) {
        setUserList([...userList, newUser.id]);
    }
    exports.socket.on("newUser", (user) => {
        addUser(user);
        console.log(userList);
    });
    (0, react_1.useEffect)(() => {
        navigator.geolocation.getCurrentPosition(function (position) {
            const userPosition = position.coords;
            const query = new URLSearchParams({
                latitude: userPosition.latitude.toString(),
                longitude: userPosition.longitude.toString(),
            });
            fetch("/api?" + query.toString())
                .then((res) => res.json())
                .then((data) => {
                setCurrentTime(data.time);
            })
                .catch((error) => console.log(error));
        });
    }, []);
    return (react_1.default.createElement("div", { className: "App" },
        react_1.default.createElement(Header_1.default, { text: "React Chat App" }),
        " ",
        react_1.default.createElement("hr", null),
        react_1.default.createElement("p", null,
            "The time as of page load was: ",
            currentTime,
            " (fetched from the Flask backend time API)."),
        react_1.default.createElement(chat_1.default, { messages: messages, addMessage: addMessage, username: username, setUsername: setUsername })));
}
exports.default = App;
