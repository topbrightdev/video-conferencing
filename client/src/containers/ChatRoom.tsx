import React, { useState, FormEvent } from 'react';
import { Drawer, ListItem, List } from '@material-ui/core';
import { MeetingState } from '../store/meeting/types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducer';
import { Connection } from '../lib/meeting';
import Button from '../components/commons/Button';
import Input from '../components/commons/Input';
import { sendMessage } from '../store/meeting/actions';
import ChatIcon from '@material-ui/icons/Chat';

interface ChatRoomProps {
    visible: boolean;
    onClose: () => void;
}
const ChatRoom: React.FC<ChatRoomProps> = ({ visible, onClose }) => {
    const dispatch = useDispatch();
    const { messages, connections, name } = useSelector<RootState, MeetingState>(
        (state) => state.meeting,
    );
    const [text, setText] = useState('');

    const connectionMap = connections.reduce((map, connection) => {
        map.set(connection.userId, connection);
        return map;
    }, new Map<string, Connection>());

    const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(sendMessage(text));
        setText('');
    };

    return (
        <Drawer anchor="right" open={visible} onClose={onClose}>
            <div className="flex flex-col h-full">
                <div className="flex justify-center items-center p-2 text-green-700">
                    <ChatIcon className=" mr-2" />
                    <span className="text-lg font-bold">Chat</span>
                </div>
                <div className="flex-grow overflow-y-auto">
                    <List>
                        {messages.map((message, index) => (
                            <ListItem key={index} divider className="flex-col items-start">
                                <div className="text-xs text-blue-700 mb-1">
                                    {connectionMap.get(message.userId)?.name || name}:
                                </div>
                                <div className="text-base">{message.text}</div>
                            </ListItem>
                        ))}
                    </List>
                </div>
                <div className=" chat-input p-2">
                    <form onSubmit={handleSendMessage} className="flex">
                        <Input
                            size="small"
                            value={text}
                            onChange={(event) => setText(event.target.value)}
                            className="mr-2"
                        />
                        <Button type="submit" size="small" disabled={!text}>
                            Send
                        </Button>
                    </form>
                </div>
            </div>
        </Drawer>
    );
};

export default ChatRoom;
