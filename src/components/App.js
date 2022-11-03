import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";
import ChatWindow from "./chat";
import Header from "./Header";
const prevSessionID = localStorage.getItem("sessionID");
export const socket = io("http://localhost:5000", {
    auth: { prevID: prevSessionID },
});
function onConnect(user) {
    localStorage.setItem("sessionID", user.id);
}
socket.on("session", onConnect);
let fakeMessages = [
    { user: { id: "1", username: "Mike", color: "Purple" }, text: "go NU!" },
    {
        user: { id: "2", username: "Dustin", color: "Brown" },
        text: "NU will lose!",
    },
    {
        user: { id: "3", username: "Mer", color: "Pink" },
        text: "where's the kitty?",
    },
    {
        user: { id: "4", username: "Me", color: "LightBlue" },
        text: "don't worry, she'll be back...",
    },
    { user: { id: "5", username: "Brian" }, text: "yup" },
];
export function App() {
    const [currentTime, setCurrentTime] = useState("(fetching...)");
    const [messages, setMessages] = useState(fakeMessages);
    function addMessage(newMessage) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
    useEffect(() => {
        socket.on("message", addMessage);
        return () => {
            socket.off("message", addMessage);
        };
    }, []);
    useEffect(() => {
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
    return (React.createElement("div", { className: "App" },
        React.createElement(Header, { text: "React Chat App" }),
        " ",
        React.createElement("hr", null),
        React.createElement("p", null,
            "The time as of page load was: ",
            currentTime,
            " (fetched from the Flask backend time API)."),
        React.createElement(ChatWindow, { messages: messages, addMessage: addMessage })));
}
