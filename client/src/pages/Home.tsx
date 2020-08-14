import React from 'react';
import Layout, { Header, Footer } from '../components/Layout';
import Content from '../components/Layout/Content';
import styled from 'styled-components';
import Input from '../components/commons/Input';
import GroupVideoImage from '../assets/images/group_video.svg';
import Button from '../components/commons/Button';

const Wrapper = styled.div`
    main {
        min-height: 300px;
    }
    .name {
        width: 75%;
    }
`;

const HomePage: React.FC = () => {
    return (
        <Layout>
            <Header />
            <Wrapper>
                <Content>
                    <div className="flex justify-center">
                        <div className="w-1/2">
                            <img src={GroupVideoImage} alt="Group video" />
                        </div>
                        <div className="flex flex-col items-center w-1/2 p-4">
                            <h1 className="text-3xl text-center font-bold  text-green-500 mt-20 mb-4">
                                Welcome to Meet X
                            </h1>
                            <h4 className="text-lg text-gray-500 mb-4">Connect wih your family and friends with our group video calls</h4>
                            <Input
                                size="medium"
                                placeholder="Enter your name"
                                className="name mb-4 "
                            />
                            <Button size="medium">Start Meeting</Button>
                        </div>
                    </div>
                </Content>
            </Wrapper>
            <Footer />
        </Layout>
    );
};

export default HomePage;
