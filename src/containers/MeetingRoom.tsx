import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';
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

import ChatRoom from './ChatRoom';
import { MessageFormat } from '../lib/meeting/types';
import Popover from '@material-ui/core/Popover';
import { ListItem, List } from '@material-ui/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSnackbar } from 'react-simple-snackbar';
import ConnectionPageView from './ConnectionPageView';
import ControlPanel from './ControlPanel';

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
    const dispatch = useDispatch();
    const history = useHistory();
    const { id } = useParams<{id:string}>();
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
    const [isConnectionFailed, setConnectionFailed] = useState(false);

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

    const handleOpen = () => {
        setConnectionFailed(false);
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

    const handleConnectionFailed = () => {
        openSnackbar('Connection Failed Retry');
        setConnectionFailed(true);
    };
    const handleReconnect = () => {
        meeting?.reconnect();
    };
    const handleNotFound = () => {
        openSnackbar('Meeting Ended');
        history.replace('/');
        dispatch(end());
    };
    const open = Boolean(anchorEl);
    useEffect(() => {
        meeting?.on('open', handleOpen);
        meeting?.on('user-left', handleUserLeft);
        meeting?.on('ended', handleEndEvent);
        meeting?.on('connection-setting-changed', handleConnectionSettingChange);
        meeting?.on('message', handleIncomingMessage);
        meeting?.on('not-found', handleNotFound);
        meeting?.on('failed', handleConnectionFailed);

        return () => {
            meeting?.on('open', handleOpen);
            meeting?.off('user-left', handleUserLeft);
            meeting?.off('ended', handleEndEvent);
            meeting?.off('connection-setting-changed', handleConnectionSettingChange);
            meeting?.off('message', handleIncomingMessage);
            meeting?.off('not-found', handleNotFound);
            meeting?.off('failed', handleConnectionFailed);
        };
    });
    return (
        <Wrapper className="w-full h-screen flex flex-col items-center">
            <ControlPanel
                videoEnabled={videoEnabled}
                audioEnabled={audioEnabled}
                onVideoToggle={handleToggleVideo}
                onAudioToggle={handleToggleAudio}
                isChatOpen={isChatOpen}
                onChatToggle={() => setChatOpen(true)}
                onEndClick={handleEndClick}
                onLeaveClick={handleLeaveClick}
                onInviteClick={handleInviteClick}
                isHost={isHost}
                isConnectionFailed={isConnectionFailed}
                onReconnect={handleReconnect}
            />

            <div className="bg-yellow-500 text-center text-sm p-1 w-full">Meeting Id: {id}</div>

            {stream && (
                <ConnectionPageView
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
                            text={window.location.href}
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
