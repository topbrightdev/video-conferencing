import React, { useEffect } from 'react';
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
} from '../store/meeting/actions';
import { Connection } from '../lib/meeting';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';

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
    const { meeting, meetingDetail, stream, connections, videoEnabled, audioEnabled } = useSelector<
        RootState,
        MeetingState
    >((state) => state.meeting);
    const userId = loadUserId();
    const name = loadUserName();
    const isHost = userId === meetingDetail?.hostId;

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
    useEffect(() => {
        meeting?.on('user-left', handleUserLeft);
        meeting?.on('ended', handleEndEvent);
        meeting?.on('connection-setting-changed', handleConnectionSettingChange);

        return () => {
            meeting?.removeListener('user-left', handleUserLeft);
            meeting?.removeListener('ended', handleEndEvent);
            meeting?.removeListener('connection-setting-changed', handleConnectionSettingChange);
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
        </Wrapper>
    );
};

export default MeetingRoom;
