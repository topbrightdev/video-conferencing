import React from 'react';
import { Connection } from '../lib/meeting';
import VideoElement from '../components/VideoElement';
import styled from 'styled-components';

const RemoteConnectionGrid = styled.div`
    display: grid;
    .item {
        position: relative;
        padding: 0.5rem;
        justify-self: center;
        align-self: center;
        .video-container {
            position: relative;
            .name {
                position: absolute;
                padding: 0.25rem 0.5rem;
                bottom: 0.5rem;
                left: 0.5rem;
                background-color: rgba(0, 0, 0, 0.5);
            }
        }
    }
    & video {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    &.span-1 {
        grid-template-columns: [col-1] 100%;
        grid-template-rows: [row-1] calc(100vh - 4rem);
        .item-1 {
            grid-column-start: col-1 1;
        }
    }
    &.span-2 {
        grid-template-columns: [col-1] 50% [col-2] 50%;
        grid-template-rows: [row-1] calc(100vh - 4rem);
        .item-1 {
            grid-column-start: col-1;
        }
        .item-2 {
            grid-column-start: col-2 1;
        }
    }
    &.span-3 {
        grid-template-columns: [col-1] 50% [col-2] 50%;
        grid-template-rows: [row-1] calc(50vh - 2rem) [row-2] calc(50vh - 2rem);
        .item-1 {
            grid-column-start: col-1 1;
            grid-row-start: row-1 1;
        }
        .item-2 {
            grid-column-start: col-2 1;
            grid-row-start: row-1 1;
        }
        .item-3 {
            grid-column-start: col-1 1;
            grid-row-start: row-2 1;
        }
    }
    &.span-4 {
        grid-template-columns: [col-1] 50% [col-2] 50%;
        grid-template-rows: [row-1] calc(50vh - 2rem) [row-2] calc(50vh - 2rem);
        .item-1 {
            grid-column-start: col-1 1;
            grid-row-start: row-1 1;
        }
        .item-2 {
            grid-column-start: col-2 1;
            grid-row-start: row-1 1;
        }
        .item-3 {
            grid-column-start: col-1 1;
            grid-row-start: row-2 1;
        }
        .item-4 {
            grid-column-start: col-2 1;
            grid-row-start: row-2 1;
        }
    }
`;
interface RemoteConnectionsProps {
    connections: Connection[];
}
const RemoteConnections: React.FC<RemoteConnectionsProps> = ({ connections }) => {
    return (
        <RemoteConnectionGrid className={`span-${connections.length}`}>
            {connections.map((connection, index) => {
                console.log(connections);
                return (
                    <div className={`item item-${index + 1}`}>
                        <div className="video-container">
                            {connection.remoteStream && (
                                <VideoElement stream={connection.remoteStream} className="w-full" />
                            )}
                            <div className="name text-white text-sm">{connection.name}</div>
                        </div>
                    </div>
                );
            })}
        </RemoteConnectionGrid>
    );
};

export default RemoteConnections;
