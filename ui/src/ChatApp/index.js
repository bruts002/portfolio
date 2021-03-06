import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { Button, Classes } from '@blueprintjs/core';

import guid from "../Util/guid";
import './chatApp.css';

const BASE_URL = '/api/chat/';
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
            messages: [ ],
            newMessage: '',
            usersOnline: [ ],
            connected: false,
            stream: null,
            lastMessageId: -1
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

        feed.onerror = () => {
            chatApp.setState({
                connected: false,
                usersOnline: []
            });
        };

        feed.addEventListener(EVENTS.NEW_MESSAGE, evt => {
            if (evt.lastEventId > chatApp.state.lastMessageId) {
                chatApp.setState({
                    messages: chatApp.state.messages.concat(evt.data),
                    connected: true,
                    lastMessageId: +evt.lastEventId
                });
            }
        });

        feed.addEventListener(EVENTS.USER_JOIN, evt => {
            const newUser = JSON.parse(evt.data);
            chatApp.setState({
                usersOnline: chatApp.state.usersOnline.concat(newUser),
                connected: true,
            });
        });

        feed.addEventListener(EVENTS.USER_LEAVE, evt => {
            const loggedOutUser = JSON.parse(evt.data);
            chatApp.setState({
                usersOnline: chatApp.state.usersOnline.filter( user => user.id !== loggedOutUser.id),
                connected: true,
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
            usersOnline,
            connected,
        } = this.state;
        return (
            <div className="chat-app">
                <div className="chat-app__main">
                    <div className={`chat-app__messages-container ${connected ? '' : 'chat-app__messages-container--disconnected'}`}>
                        <h6>Messages</h6>
                        {messages.map( (message,i) => <div key={i}>{message}</div>)}
                    </div>
                    <form onSubmit={ e => this.sendMessage(e) } className="chat-app__message-form">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={ e => this.updateMessage(e) }
                            dir="auto"
                            className={Classes.INPUT + ' ' + Classes.INTENT_PRIMARY + " chat-app__message-input"}/>
                        <Button type="submit">
                            Send
                        </Button>
                    </form>
                </div>
                <div className="chat-app__details">
                    <h6>Users</h6>
                    <ul>
                        {usersOnline.map( (user,i) => <li key={user.id}>{user.name}</li>)}
                    </ul>
                </div>
            </div>
        );
    }
}

export default withRouter(ChatApp);
