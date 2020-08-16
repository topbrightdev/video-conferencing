import React, { DetailedHTMLProps, HTMLAttributes } from 'react';
import VideoElement from '../VideoElement';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import styled from 'styled-components';

const VideoContainer = styled.div`
    position: relative;
    .name {
        position: absolute;
        padding: 0.25rem 0.5rem;
        bottom: 0.25rem;
        left: 0.25rem;
        background-color: rgba(0, 0, 0, 0.5);
    }
    .controls {
        position: absolute;
        padding: 0.25rem 0.5rem;
        bottom: 0.25rem;
        right: 0.25rem;
        background-color: rgba(0, 0, 0, 0.5);
    }
    video {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`;
type DivDetailedProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

interface ConnectionVideoItemProps extends DivDetailedProps {
    stream?: MediaStream | null;
    name: string;
    audioEnabled: boolean;
    videoEnabled: boolean;
}

const ConnectionVideoItem: React.FC<ConnectionVideoItemProps> = ({
    stream,
    name,
    videoEnabled,
    audioEnabled,
    ...props
}) => {
    return (
        <div {...props}>
            <VideoContainer className="video-container">
                {stream && <VideoElement stream={stream} className="w-full" />}
                <div className="name text-white text-sm">{name}</div>
                <div className="controls text-white text-sm">
                    <span className="mr-2">{videoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}</span>
                    <span> {audioEnabled ? <MicIcon /> : <MicOffIcon />}</span>
                </div>
            </VideoContainer>
        </div>
    );
};

export default ConnectionVideoItem;
