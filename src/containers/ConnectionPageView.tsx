import React, { DetailedHTMLProps, useState, useRef } from 'react';
import { Connection } from '../lib/meeting';
import styled from 'styled-components';
import { getBreakPoint } from '../util/breakpoint.util';
import { VIDEO_PER_PAGE } from '../config/video-view-grid';
import { BreakPointEnum } from '../types';
import ConnectionVideoGrid from './ConnectionVideoGrid';
import ReactResizeDetector from 'react-resize-detector';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

type DetailDivProps = DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

interface ConnectionPageViewItemProps extends DetailDivProps {
    connections: Connection[];
    breakpoint: BreakPointEnum;
    width: number;
    height: number;
}
const ConnectionPageViewItem: React.FC<ConnectionPageViewItemProps> = ({
    connections,
    breakpoint,
    width,
    height,
    ...props
}) => {
    return (
        <div {...props} className="pageview-item">
            <ConnectionVideoGrid
                connections={connections}
                breakpoint={breakpoint}
                width={width}
                height={height}
            />
        </div>
    );
};
const ConnectionPageViewWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;
    .pageview-item {
        display: flex;
        justify-content: center;
    }
    .prev {
        position: fixed;
        top: 50%;
        left: 1rem;
        color: white;
        cursor: pointer;
    }
    .next {
        position: fixed;
        top: 50%;
        right: 1rem;
        color: white;
        cursor: pointer;
    }
`;

interface ConnectionPageViewProps {
    connections: Connection[];
    local: {
        stream: MediaStream;
        videoEnabled: boolean;
        audioEnabled: boolean;
        name: string;
    };
}
const ConnectionPageView: React.FC<ConnectionPageViewProps> = ({ connections, local }) => {
    const pageViewRef = useRef<HTMLDivElement>(null);
    const totalConnections = connections.length + 1;
    const [{ width, height, breakpoint }, setDimension] = useState({
        width: window.innerWidth,
        height: window.innerHeight - 100,
        breakpoint: getBreakPoint(),
    });
    const [currentPage, setCurrentPage] = useState(0);

    const videoPerPage = VIDEO_PER_PAGE[breakpoint];

    const totalPages = Math.ceil(totalConnections / videoPerPage);

    const renderPages = () => {
        const pages = [];
        const selfViewConnection = new Connection({
            userId: '',
            stream: local.stream,
            name: local.name,
            videoEnabled: local.videoEnabled,
            audioEnabled: local.audioEnabled,
            connectionType: 'self',
            muted: true,
        });
        const connectionsWithSelfview = [selfViewConnection, ...connections];
        for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
            const start = pageIndex * videoPerPage;
            const end = start + videoPerPage;
            pages.push(
                <ConnectionPageViewItem
                    connections={connectionsWithSelfview.slice(start, end)}
                    breakpoint={breakpoint}
                    width={width}
                    height={height}
                    style={{
                        width: `${width}px`,
                        height: `${height}px`,
                        // transform: `translateX(${pageIndex * width}px)`,
                    }}
                />,
            );
        }
        return pages;
    };
    const handleResize = (width: number|undefined, height: number|undefined) => {
        setDimension({
            width: window.innerWidth,
            height: window.innerHeight - 100,
            breakpoint: getBreakPoint(),
        });
    };
    const handlePrev = () => {
        setCurrentPage(currentPage - 1);
    };
    const handleNext = () => {
        setCurrentPage(currentPage + 1);
    };
    return (
        <ReactResizeDetector
            onResize={handleResize}
            refreshMode="throttle"
            refreshRate={500}
            targetRef={pageViewRef}
        >
            <ConnectionPageViewWrapper ref={pageViewRef}>
                <div
                    style={{
                        width: `${width * totalPages}px`,
                        height: `${height}px`,
                        transform: `translateX(-${currentPage * width}px)`,
                        display: 'flex',
                    }}
                >
                    {renderPages()}
                </div>
                {currentPage > 0 && (
                    <div onClick={handlePrev} className="prev">
                        <ArrowBackIosIcon />
                    </div>
                )}
                {currentPage < totalPages - 1 && (
                    <div onClick={handleNext} className="next">
                        <ArrowForwardIosIcon />
                    </div>
                )}
            </ConnectionPageViewWrapper>
        </ReactResizeDetector>
    );
};

export default ConnectionPageView;
