import React, { ReactElement, useState } from "react";
import "./chat.css";


function onMessageSend (e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
        console.log((e.target as HTMLTextAreaElement).value);
        (e.target as HTMLTextAreaElement).value = "";
    }
  }
  

function MessageInput(): ReactElement {
    return (
    <div className="MessageInput">
    <input type="text" placeholder="Press Enter to send" onKeyDown={e => onMessageSend(e)}></input>
    </div>
    )
}

type ChatMessage = {
    user: string,
    text: string
}

let fakeMessages: ChatMessage[] = [
    {user: 'Mike', text: 'go NU!'},
    {user: 'Dustin', text: 'NU will lose!'}
]

function MessagesBox() : ReactElement {
    const [messages, setMessages] = useState(fakeMessages);
    
    return (
        <div>
            <ul>
            {messages.map((msg, index) => {
                return <li key={index}>{`${msg.user}: ${msg.text}`}</li>
                })}
            </ul>
        </div>
    )
}


function MessageWindow() : ReactElement {
    return (
        <div className="MessageWindow">
            <MessagesBox></MessagesBox>
            <MessageInput></MessageInput>
        </div>
    )
}

export default MessageWindow;

