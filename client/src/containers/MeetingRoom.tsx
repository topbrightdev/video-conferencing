import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import Button from '../components/commons/Button';
import styled from 'styled-components';
import VideoElement from '../components/VideoElement';
import RemoteConnections from '../containers/RemoteConnections';
import { RootState } from '../store/reducer';
import { MeetingState } from '../store/meeting/types';
import { loadUserId } from '../lib/user';

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
    const { id } = useParams();
    const { meeting, meetingDetail, stream, connections } = useSelector<RootState, MeetingState>(
        (state) => state.meeting,
    );
    const userId = loadUserId();
    const isHost = userId === meetingDetail?.hostId;

    return (
        <Wrapper className="w-full h-screen">
            <div>
                <div className="flex control-panel justify-center h-16 items-center px-4 bg-gray-700">
                    <Button
                        size="small"
                        color="secondary"
                        onClick={() => meeting?.leave()}
                        className="mr-4"
                    >
                        Leave
                    </Button>
                    {isHost && (
                        <Button size="small" color="danger" onClick={() => meeting?.end()}>
                            End
                        </Button>
                    )}
                </div>
            </div>
            <div className="bg-yellow-500 text-center text-sm p-1">Meeting Id: {id}</div>

            {stream && (
                <div className="self-view">
                    <VideoElement stream={stream} className="w-full" />
                </div>
            )}
            <RemoteConnections connections={connections} />
        </Wrapper>
    );
};

export default MeetingRoom;
