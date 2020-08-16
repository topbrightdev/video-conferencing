import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import * as MeetingApi from '../lib/meeting-api';
import Layout, { Header, Footer } from '../components/Layout';
import Content from '../components/Layout/Content';
import { loadUserName } from '../lib/user';
import { useDispatch } from 'react-redux';
import { join } from '../store/meeting/actions';
import MeetingRoom from '../containers/MeetingRoom';
import styled from 'styled-components';
import Input from '../components/commons/Input';
import Button from '../components/commons/Button';
import { MeetingDetail } from '../types';

const Wrapper = styled.div`
    .ask-name-container {
        width: 400px;
        margin: 0px auto;
    }
`;
const MeetingPage: React.FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { id } = useParams();
    const [meetingDetail, setMeetingDetail] = useState<MeetingDetail | null>(null);
    const [askName, setAskName] = useState(true);
    const [name, setName] = useState(loadUserName());

    const validateMeeting = async () => {
        try {
            const data = await MeetingApi.join(id);
            setMeetingDetail(data);
        } catch (error) {
            const { response } = error;
            console.log(response.data.message);
            history.replace('/');
        }
    };

    const joinMeeting = () => {
        if (meetingDetail) {
            localStorage.setItem('name', name);
            setAskName(false);
            dispatch(join(meetingDetail));
            console.log('joined Meeeting');
        }
    };

    useEffect(() => {
        validateMeeting();
        // eslint-disable-next-line
    }, []);

    if (askName) {
        return (
            <Layout>
                <Header />
                <Content>
                    <Wrapper className="ask-name-wrapper p-4 md:p-8">
                        <div className="ask-name-container ">
                            <Input
                                size="medium"
                                placeholder="Enter your name"
                                className="name mb-4 w-full"
                                onChange={(event) => setName(event.target.value)}
                            />
                            <Button
                                size="medium"
                                onClick={joinMeeting}
                                disabled={!name}
                                className="w-full mb-4"
                            >
                                Join
                            </Button>
                        </div>
                    </Wrapper>
                </Content>
                <Footer />
            </Layout>
        );
    }
    return <MeetingRoom />;
};

export default MeetingPage;
