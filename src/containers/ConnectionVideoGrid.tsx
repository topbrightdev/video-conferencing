import React from 'react';
import { Connection } from '../lib/meeting';
import styled from 'styled-components';
import ConnectionVideoItem from '../components/ConnectionVideoItem';

const ConnectionVideoGrid = styled.div`
    display: grid;
    .item {
        position: relative;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    &.span-1 {
        grid-template-columns: [col-1] 100%;
        grid-template-rows: [row-1] calc(100vh - 6rem);
        .item-1 {
            grid-column-start: col-1 1;
            height: 100%;
        }
    }
    &.span-2 {
        grid-template-columns: [col-1] 50% [col-2] 50%;
        grid-template-rows: [row-1] calc(100vh - 6rem);
        .item-1 {
            grid-column-start: col-1;
            height: 100%;
        }
        .item-2 {
            grid-column-start: col-2 1;
            height: 100%;
        }
    }
    &.span-3 {
        grid-template-columns: [col-1] 50% [col-2] 50%;
        grid-template-rows: [row-1] calc(50vh - 3rem) [row-2] calc(50vh - 3rem);
        .item-1 {
            grid-column-start: col-1 1;
            grid-row-start: row-1 1;
            height: 50%;
        }
        .item-2 {
            grid-column-start: col-2 1;
            grid-row-start: row-1 1;
            height: 50%;
        }
        .item-3 {
            grid-column-start: col-1 1;
            grid-row-start: row-2 1;
            height: 50%;
        }
    }
    &.span-4 {
        grid-template-columns: [col-1] 50% [col-2] 50%;
        grid-template-rows: [row-1] calc(50vh - 3rem) [row-2] calc(50vh - 3rem);
        .item-1 {
            grid-column-start: col-1 1;
            grid-row-start: row-1 1;
            height: 50%;
        }
        .item-2 {
            grid-column-start: col-2 1;
            grid-row-start: row-1 1;
            height: 50%;
        }
        .item-3 {
            grid-column-start: col-1 1;
            grid-row-start: row-2 1;
            height: 50%;
        }
        .item-4 {
            grid-column-start: col-2 1;
            grid-row-start: row-2 1;
            height: 50%;
        }
    }
`;
interface RemoteConnectionsProps {
    connections: Connection[];
    local: {
        stream: MediaStream;
        name: string;
        audioEnabled: boolean;
        videoEnabled: boolean;
    };
}
const RemoteConnections: React.FC<RemoteConnectionsProps> = ({ connections, local }) => {
    return (
        <ConnectionVideoGrid className={`span-${connections.length + 1}`}>
            <ConnectionVideoItem
                className={`item item-1`}
                stream={local.stream}
                name={local.name}
                audioEnabled={local.audioEnabled}
                videoEnabled={local.videoEnabled}
                muted
                key={'local-connection'}
            />
            {connections.map((connection, index) => {
                return (
                    <ConnectionVideoItem
                        className={`item item-${index + 2}`}
                        stream={connection.remoteStream}
                        name={connection.name}
                        audioEnabled={connection.audioEnabled}
                        videoEnabled={connection.videoEnabled}
                        muted={false}
                        key={connection.userId}
                    />
                );
            })}
        </ConnectionVideoGrid>
    );
};

export default RemoteConnections;
