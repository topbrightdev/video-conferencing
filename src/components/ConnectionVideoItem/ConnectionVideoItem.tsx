import React, { DetailedHTMLProps, HTMLAttributes } from 'react';
import VideoElement from '../VideoElement';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import styled from 'styled-components';
import cx from 'classnames';

const VideoContainer = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
    .name {
        position: absolute;
        padding: 0.25rem 0.5rem;
        bottom: 0;
        left: 0.25rem;
        background-color: rgba(0, 0, 0, 0.5);
    }
    .video-placeholder {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .controls {
        position: absolute;
        padding: 0.25rem 0.5rem;
        bottom: 0;
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
    muted?: boolean;
}

const ConnectionVideoItem: React.FC<ConnectionVideoItemProps> = ({
    stream,
    name,
    videoEnabled,
    audioEnabled,
    muted,
    ...props
}) => {
    return (
        <div {...props}>
            <VideoContainer
                className={cx('video-container', {
                    'border border-green-500': !videoEnabled,
                    'border border-gray-500': videoEnabled,
                })}
            >
                {stream && <VideoElement stream={stream} className="w-full" muted={muted} />}
                {!videoEnabled && (
                    <div className="video-placeholder text-3xl text-white capitalize">{name}</div>
                )}
                <div className="name text-white text-sm">{name}</div>
                <div className="controls text-white">
                    <span className="mr-2">
                        {videoEnabled ? (
                            <VideocamIcon className="text-lg" />
                        ) : (
                            <VideocamOffIcon className="text-lg" />
                        )}
                    </span>
                    <span>
                        {' '}
                        {audioEnabled ? (
                            <MicIcon className="text-lg" />
                        ) : (
                            <MicOffIcon className="text-lg" />
                        )}
                    </span>
                </div>
            </VideoContainer>
        </div>
    );
};

export default ConnectionVideoItem;
