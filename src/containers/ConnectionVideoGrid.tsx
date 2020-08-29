import React from 'react';
import { Connection } from '../lib/meeting';
import styled from 'styled-components';
import ConnectionVideoItem from '../components/ConnectionVideoItem';
import { GRID_MAP } from '../config/video-view-grid';
import { BreakPointEnum } from '../types';

const ConnectionVideoGridWrapper = styled.div`
    .item {
        position: relative;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;
interface ConnectionVideoGridProps {
    connections: Connection[];
    breakpoint: BreakPointEnum;
    width: number;
    height: number;
}
const ConnectionVideoGrid: React.FC<ConnectionVideoGridProps> = ({
    connections,
    breakpoint,
    width,
    height,
}) => {
    const totalItems = connections.length;
    const selectedGrid = GRID_MAP[breakpoint];
    const gridArea = selectedGrid[totalItems];
    const [row, column] = gridArea;

    const gridItemWidth = (width - 5 * column) / column;
    const gridItemHeight = (height - 5 * row) / row;

    const gridTemplateColumns = `${gridItemWidth}px `.repeat(column).trim();
    const gridTemplateRows = `${gridItemHeight}px `.repeat(row).trim();
    let gridTemplateAreas = '';
    let item = 0;
    for (let i = 0; i < row; i++) {
        let columnArea = '';
        for (let j = 0; j < column; j++) {
            item++;
            columnArea += `item${item} `;
        }
        gridTemplateAreas += `'${columnArea}' `;
        gridTemplateAreas = gridTemplateAreas.trim();
    }

    return (
        <ConnectionVideoGridWrapper
            className={`span-${totalItems}`}
            style={{
                height: height + 'px',
                display: 'grid',
                gridTemplateColumns,
                gridTemplateRows,
                gridTemplateAreas,
                gridGap: '5px',
                padding: '5px',
            }}
        >
            {connections.map((connection, index) => {
                return (
                    <ConnectionVideoItem
                        className={`item item-${index + 1}`}
                        stream={
                            connection.connectionType === 'self'
                                ? connection.localStream
                                : connection.remoteStream
                        }
                        name={connection.name}
                        audioEnabled={connection.audioEnabled}
                        videoEnabled={connection.videoEnabled}
                        muted={connection.muted}
                        key={connection.userId}
                        style={{
                            width: `${gridItemWidth}px`,
                            height: `${gridItemHeight}px`,
                            gridArea: `item${index + 1}`,
                        }}
                    />
                );
            })}
        </ConnectionVideoGridWrapper>
    );
};

export default ConnectionVideoGrid;
