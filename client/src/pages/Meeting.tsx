import React from 'react';
import { useParams } from 'react-router-dom';

const MeetingPage: React.FC = () => {
    const { id } = useParams();

    return <div>Meeting Page: {id}</div>;
};


export default MeetingPage;