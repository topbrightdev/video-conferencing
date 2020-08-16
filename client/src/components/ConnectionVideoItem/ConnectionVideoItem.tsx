import React, { DetailedHTMLProps, HTMLAttributes } from 'react';
import VideoElement from '../VideoElement';

type DivDetailedProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

interface ConnectionVideoItemProps extends DivDetailedProps {
    stream?: MediaStream | null;
    name: string;
}

const ConnectionVideoItem: React.FC<ConnectionVideoItemProps> = ({ stream, name, ...props }) => {
    return (
        <div {...props}>
            <div className="video-container">
                {stream && <VideoElement stream={stream} className="w-full" />}
                <div className="name text-white text-sm">{name}</div>
            </div>
        </div>
    );
};

export default ConnectionVideoItem;
