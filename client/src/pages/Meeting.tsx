import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MeetingDetail } from '../types';
import * as MeetingApi from '../lib/meeting-api';
import Meeting from '../lib/meeting';
import Layout, { Header, Footer } from '../components/Layout';
import Content from '../components/Layout/Content';
import { loadUser } from '../lib/user';
import { useDispatch, useSelector } from 'react-redux';
import { join } from '../store/meeting/actions';
import { RootState } from '../store/reducer';
import { MeetingState } from '../store/meeting/types';
import Button from '../components/commons/Button';
import styled from 'styled-components';
import VideoElement from '../components/VideoElement';
import RemoteConnections from '../containers/RemoteConnections';

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
const MeetingPage: React.FC = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { meeting, meetingDetail, stream, connections } = useSelector<RootState, MeetingState>(
        (state) => state.meeting,
    );
    const userId = loadUser();
    const isHost = userId === meetingDetail?.hostId;

    const validateMeeting = async () => {
        try {
            const data = await MeetingApi.join(id);
            dispatch(join(data));
            console.log('joined Meeeting');
        } catch (error) {
            const { response } = error;
            console.log(response.data.message);
        }
    };

    useEffect(() => {
        validateMeeting();
    }, []);

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

export default MeetingPage;
