import React, { Component } from "react";

import guid from "../Util/guid";
import './chatApp.css';

const BASE_URL = 'http://127.0.0.1:8080/';
const STREAM_URL =  `${BASE_URL}stream`;
const PUBLISH_URL = `${BASE_URL}publish`;

const EVENTS = {
    NEW_MESSAGE: 'NEW_MESSAGE',
    USER_JOIN: 'USER_JOIN',
    USER_LEAVE: 'USER_LEAVE'
};

class ChatApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: guid(),
            messages: [
                'abc',
                'hi',
                'dummy data'
            ],
            newMessage: '',
            usersOnline: [
                { name: 'Matt', id: 2 },
                { name: 'Mark', id: 3 },
                { name: 'Luke', id: 4 },
                { name: 'John', id: 5 },
            ],
            connected: false,
            stream: null
        };
    }

    componentDidMount() {
        const chatApp = this;
        const feed = new EventSource(`${STREAM_URL}?id=${this.state.id}`, {
            withCredentials: true
        });

        feed.onopen = () => {
            chatApp.setState({
                connected: true
            });
        };

        feed.addEventListener(EVENTS.NEW_MESSAGE, evt => {
            chatApp.setState({
                messages: chatApp.state.messages.concat(evt.data),
                connected: true
            });
        });

        feed.addEventListener(EVENTS.USER_JOIN, evt => {
            const newUser = JSON.parse(evt.data);
            chatApp.setState({
                usersOnline: chatApp.state.usersOnline.concat(newUser),
                connected: true
            });
        });

        feed.addEventListener(EVENTS.USER_LEAVE, evt => {
            const loggedOutUser = JSON.parse(evt.data);
            chatApp.setState({
                usersOnline: chatApp.state.usersOnline.filter( user => user.id !== loggedOutUser.id),
                connected: true
            });
        });

        this.setState({
            connected: false,
            stream: feed
        });
    }

    componentWillUnmount() {
        this.state.stream.close();
    }

    updateMessage(event) {
        this.setState({
            newMessage: event.target.value
        });
    }

    sendMessage(event) {
        event.preventDefault();
        event.stopPropagation();
        const req = new XMLHttpRequest();
        req.open('POST', PUBLISH_URL);
        req.send(JSON.stringify({
            event: EVENTS.NEW_MESSAGE,
            data: this.state.newMessage
        }));
        this.setState({
            newMessage: ''
        });
    }

    render() {
        const {
            messages,
            newMessage,
            usersOnline
        } = this.state;
        return (
            <div className="chat-app">
                <div className="chat-app__main">
                    <div className="chat-app__messages-container">
                        <h6>Messages</h6>
                        {messages.map( (message,i) => <div key={i}>{message}</div>)}
                    </div>
                    <form onSubmit={ e => this.sendMessage(e) } className="chat-app__message-form">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={ e => this.updateMessage(e) }
                            className="chat-app__message-input"/>
                        <input type="submit" value="send" className="chat-app__message-button"/>
                    </form>
                </div>
                <div className="chat-app__details">
                    <h6>Details</h6>
                    <ul>
                        {usersOnline.map( (user,i) => <li key={user.id}>{user.name}</li>)}
                    </ul>
                </div>
            </div>
        );
    }
}

export default ChatApp;
