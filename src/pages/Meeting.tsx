import React, { useEffect, useState, FormEvent } from 'react';
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
import { useSnackbar } from 'react-simple-snackbar';
import { getErrorMessage } from '../lib/error-handling';

const Wrapper = styled.div`
    .ask-name-container {
        width: 100%;
    }
    @media screen and (min-width: 400px) {
        .ask-name-container {
            width: 400px;
            margin: 0px auto;
        }
    }
`;
const MeetingPage: React.FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { id } = useParams<{id:string}>();
    const [meetingDetail, setMeetingDetail] = useState<MeetingDetail | null>(null);
    const [askName, setAskName] = useState(true);
    const [name, setName] = useState(loadUserName());
    const [openSnackbar] = useSnackbar({
        position: 'top-center',
    });

    const validateMeeting = async () => {
        try {
            const data = await MeetingApi.join(id);
            setMeetingDetail(data);
        } catch (error) {
            openSnackbar(getErrorMessage(error));
            history.replace('/');
        }
    };

    const joinMeeting = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (meetingDetail) {
            localStorage.setItem('name', name);
            setAskName(false);
            dispatch(join(meetingDetail, name));
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
                            <form onSubmit={joinMeeting}>
                                <Input
                                    size="medium"
                                    placeholder="Enter your name"
                                    className="name mb-4 w-full"
                                    onChange={(event) => setName(event.target.value)}
                                />
                                <Button
                                    type="submit"
                                    size="medium"
                                    disabled={!name}
                                    className="w-full mb-4"
                                >
                                    Join
                                </Button>
                            </form>
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
