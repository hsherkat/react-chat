import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { flushSync } from "react-dom";
import io from "socket.io-client";
import "./App.css";
import ChatWindow from "./chat";
import Header from "./Header";
const prevSessionID = localStorage.getItem("sessionID");
const unparsedMessages = localStorage.getItem("messages");
console.log(unparsedMessages);
const storedMessages = JSON.parse(unparsedMessages || "[]");
export const socket = io("http://47.148.77.187", {
    auth: { prevID: prevSessionID },
});
function onConnect(user) {
    localStorage.setItem("sessionID", user.id);
}
socket.on("session", onConnect);
export function App() {
    const [messages, setMessages] = useState(storedMessages);
    function addMessage(newMessage) {
        flushSync(() => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            storedMessages.push(newMessage);
            localStorage.setItem("messages", JSON.stringify(storedMessages));
        });
        scrollToLastMessage();
    }
    function isScrolledToBottom(el) {
        return el.scrollHeight - Math.round(el.scrollTop) - el.clientHeight < 75;
    }
    function scrollToLastMessage() {
        const messagesBox = document.getElementById("MessagesBox");
        const lastMessage = messagesBox === null || messagesBox === void 0 ? void 0 : messagesBox.lastElementChild;
        if (messagesBox !== null && isScrolledToBottom(messagesBox)) {
            lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.scrollIntoView({
                block: "end",
                inline: "nearest",
                behavior: "smooth",
            });
        }
    }
    useEffect(() => {
        socket.on("message", addMessage);
        return () => {
            socket.off("message", addMessage);
        };
    }, []);
    useEffect(() => {
        const infoButton = document.getElementById("info-button");
        const messagesBox = document.getElementById("MessagesBox");
        const userWindow = document.getElementById("UserWindow");
        const messageInput = document.getElementById("MessageInput");
        function infoClicked() {
            messagesBox === null || messagesBox === void 0 ? void 0 : messagesBox.classList.toggle("mobile-hidden");
            userWindow === null || userWindow === void 0 ? void 0 : userWindow.classList.toggle("mobile-hidden");
            messageInput === null || messageInput === void 0 ? void 0 : messageInput.classList.toggle("mobile-hidden");
        }
        infoButton === null || infoButton === void 0 ? void 0 : infoButton.addEventListener("click", infoClicked);
        return () => {
            infoButton === null || infoButton === void 0 ? void 0 : infoButton.removeEventListener("click", infoClicked);
        };
    }, []);
    return (React.createElement("div", { className: "App" },
        React.createElement(Header, { text: "Hooman's React Chat App" }),
        " ",
        React.createElement("hr", null),
        React.createElement(Button, { id: "info-button" }, "Toggle Info"),
        React.createElement(ChatWindow, { messages: messages, addMessage: addMessage })));
}
