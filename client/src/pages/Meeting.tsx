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

const Wrapper = styled.div`
    background-color: #000;
`;
const MeetingPage: React.FC = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { meeting, meetingDetail, stream } = useSelector<RootState, MeetingState>(
        (state) => state.meeting,
    );
    const userId = loadUser();

    const validateMeeting = async () => {
        try {
            const data = await MeetingApi.join(id);
            dispatch(join(data));
            alert('joined Meeeting');
        } catch (error) {
            const { response } = error;
            alert(response.data.message);
        }
    };

    useEffect(() => {
        validateMeeting();
    }, []);

    return (
        <Wrapper className="w-screen h-screen">
            <div>
                <div>
                    <Button
                        size="small"
                        color="secondary"
                        onClick={() => meeting?.leave()}
                        className="mr-4"
                    >
                        Leave
                    </Button>
                    <Button size="small" color="danger" onClick={() => meeting?.end()}>
                        End
                    </Button>
                </div>
            </div>
            <div>Meeting Page: {id}</div>
            {stream && <VideoElement stream={stream} className="w-full" />}
        </Wrapper>
    );
};

export default MeetingPage;
