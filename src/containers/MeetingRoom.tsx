import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import Button from '../components/commons/Button';
import styled from 'styled-components';
import ConnectionVideoGrid from './ConnectionVideoGrid';
import { RootState } from '../store/reducer';
import { MeetingState } from '../store/meeting/types';
import { loadUserId, loadUserName } from '../lib/user';
import {
    leave,
    end,
    userLeft,
    toggleAudio,
    toggleVideo,
    connectionSettingChange,
    receivedMessage,
} from '../store/meeting/actions';
import { Connection } from '../lib/meeting';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import ChatIcon from '@material-ui/icons/Chat';
import ChatRoom from './ChatRoom';
import { MessageFormat } from '../lib/meeting/types';
import Popover from '@material-ui/core/Popover';
import { ListItem, List } from '@material-ui/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSnackbar } from 'react-simple-snackbar';

const Wrapper = styled.div`
    background-color: #000;
    .control-panel {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .self-view {
        position: fixed;
        top: 30px;
        left: 30px;
        z-index: 999;
        video {
            width: 150px;
        }
    }
`;
const MeetingRoom = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { id } = useParams();
    const [openSnackbar] = useSnackbar({
        position: 'top-center',
    });

    const { meeting, meetingDetail, stream, connections, videoEnabled, audioEnabled } = useSelector<
        RootState,
        MeetingState
    >((state) => state.meeting);
    const userId = loadUserId();
    const name = loadUserName();
    const isHost = userId === meetingDetail?.hostId;
    const [isChatOpen, setChatOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleLeaveClick = () => {
        meeting?.leave();
        dispatch(leave());
        history.replace('/');
    };
    const handleEndClick = () => {
        meeting?.end();
        dispatch(end());
        history.replace('/');
    };
    const handleToggleVideo = () => {
        dispatch(toggleVideo());
    };
    const handleToggleAudio = () => {
        dispatch(toggleAudio());
    };
    const handleUserLeft = (connection: Connection) => {
        dispatch(userLeft(connection));
    };
    const handleEndEvent = () => {
        history.replace('/');
        dispatch(end());
    };
    const handleConnectionSettingChange = () => {
        dispatch(connectionSettingChange());
    };
    const handleIncomingMessage = (message: MessageFormat) => {
        dispatch(receivedMessage(message));
    };
    const handleInviteClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    useEffect(() => {
        meeting?.on('user-left', handleUserLeft);
        meeting?.on('ended', handleEndEvent);
        meeting?.on('connection-setting-changed', handleConnectionSettingChange);
        meeting?.on('message', handleIncomingMessage);

        return () => {
            meeting?.removeListener('user-left', handleUserLeft);
            meeting?.removeListener('ended', handleEndEvent);
            meeting?.removeListener('connection-setting-changed', handleConnectionSettingChange);
            meeting?.removeListener('message', handleIncomingMessage);
        };
    });
    return (
        <Wrapper className="w-full h-screen">
            <div>
                <div className="flex control-panel justify-center h-16 items-center px-4 bg-gray-700">
                    <Button
                        size="small"
                        color="primary"
                        className="mr-4"
                        onClick={handleToggleVideo}
                    >
                        {videoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
                    </Button>
                    <Button
                        size="small"
                        color="primary"
                        className="mr-4"
                        onClick={handleToggleAudio}
                    >
                        {audioEnabled ? <MicIcon /> : <MicOffIcon />}
                    </Button>
                    <Button
                        size="small"
                        color={isChatOpen ? 'secondary' : 'primary'}
                        className="mr-4"
                        onClick={() => setChatOpen(true)}
                    >
                        <ChatIcon />
                    </Button>

                    <Button
                        size="small"
                        color="secondary"
                        onClick={handleInviteClick}
                        className="mr-4"
                    >
                        Invite
                    </Button>
                    <Button
                        size="small"
                        color="secondary"
                        onClick={handleLeaveClick}
                        className="mr-4"
                    >
                        Leave
                    </Button>
                    {isHost && (
                        <Button size="small" color="danger" onClick={handleEndClick}>
                            End
                        </Button>
                    )}
                </div>
            </div>
            <div className="bg-yellow-500 text-center text-sm p-1">Meeting Id: {id}</div>

            {stream && (
                <ConnectionVideoGrid
                    connections={connections}
                    local={{ stream, name, audioEnabled, videoEnabled }}
                />
            )}
            <ChatRoom visible={isChatOpen} onClose={() => setChatOpen(false)} />
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <List>
                    <ListItem className="cursor-pointer">
                        <CopyToClipboard
                            text={id}
                            onCopy={() => {
                                openSnackbar('Meeting id copied');
                                handleClose();
                            }}
                        >
                            <span>Copy Meeting Id</span>
                        </CopyToClipboard>
                    </ListItem>
                    <ListItem className="cursor-pointer">
                        <CopyToClipboard
                            text={`http://localhost:3000/meeting/${id}`}
                            onCopy={() => {
                                openSnackbar('Meeting link copied');
                                handleClose();
                            }}
                        >
                            <span>Copy Meeting link</span>
                        </CopyToClipboard>
                    </ListItem>
                </List>
            </Popover>
        </Wrapper>
    );
};

export default MeetingRoom;
