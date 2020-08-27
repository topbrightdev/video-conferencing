import React from 'react';
import { Connection } from '../lib/meeting';
import styled from 'styled-components';
import ConnectionVideoItem from '../components/ConnectionVideoItem';

const ConnectionVideoGrid = styled.div`
    display: grid;
    height: calc(100vh - 6rem);
    .item {
        position: relative;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    &.span-1 {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        gap: 1px 1px;
        grid-template-areas: 'a';
        .item-1 {
            grid-area: a;
        }
    }
    &.span-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr;
        gap: 1px 1px;
        grid-template-areas: 'a b';
        .item-1 {
            grid-area: a;
        }
        .item-2 {
            grid-area: b;
        }
    }
    &.span-3,
    &.span-4 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 1px 1px;
        grid-template-areas: 'a b ' 'c d';
        .item-1 {
            grid-area: a;
        }
        .item-2 {
            grid-area: b;
        }
        .item-3 {
            grid-area: c;
        }
        .item-4 {
            grid-area: d;
        }
    }

    &.span-5,
    &.span-6 {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 1px 1px;
        grid-template-areas: 'a b c' 'd e f';
        .item-1 {
            grid-area: a;
        }
        .item-2 {
            grid-area: b;
        }
        .item-3 {
            grid-area: c;
        }
        .item-4 {
            grid-area: d;
        }
        .item-5 {
            grid-area: e;
        }
        .item-6 {
            grid-area: f;
        }
    }
    &.span-7,
    &.span-8 {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 1px 1px;
        grid-template-areas: 'a b c d' 'f e g h';
        .item-1 {
            grid-area: a;
        }
        .item-2 {
            grid-area: b;
        }
        .item-3 {
            grid-area: c;
        }
        .item-4 {
            grid-area: d;
        }
        .item-5 {
            grid-area: e;
        }
        .item-6 {
            grid-area: f;
        }
        .item-7 {
            grid-area: g;
        }
        .item-8 {
            grid-area: h;
        }
    }
    &.span-9,
    &.span-10,
    &.span-11,
    &.span-12 {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr;
        gap: 1px 1px;
        grid-template-areas: 'a b c d' 'f e g h' 'i j k l';
        .item-1 {
            grid-area: a;
        }
        .item-2 {
            grid-area: b;
        }
        .item-3 {
            grid-area: c;
        }
        .item-4 {
            grid-area: d;
        }
        .item-5 {
            grid-area: e;
        }
        .item-6 {
            grid-area: f;
        }
        .item-7 {
            grid-area: g;
        }
        .item-8 {
            grid-area: h;
        }
        .item-9 {
            grid-area: i;
        }
        .item-10 {
            grid-area: j;
        }
        .item-11 {
            grid-area: k;
        }
        .item-12 {
            grid-area: l;
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
    const height = window.innerHeight - 100;
    const totalConnection = connections.length + 1;

    return (
        <ConnectionVideoGrid
            className={`span-${totalConnection}`}
            style={{ height: height + 'px', display: 'grid' }}
        >
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
