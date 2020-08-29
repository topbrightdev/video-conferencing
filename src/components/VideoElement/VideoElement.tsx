import React, { DetailedHTMLProps, VideoHTMLAttributes, useEffect, useRef } from 'react';

type VideoDetailedProps = DetailedHTMLProps<
    VideoHTMLAttributes<HTMLVideoElement>,
    HTMLVideoElement
>;
interface VideoElementProps extends VideoDetailedProps {
    stream: MediaStream;
    muted?: boolean;
}

const VideoElement: React.FC<VideoElementProps> = ({ stream, muted = true, ...props }) => {
    const ref = useRef<HTMLVideoElement>(null);

    const initElement = () => {
        if (ref?.current) {
            ref.current.volume = muted ? 0.1 : 1.0;
            ref.current.muted = muted;
        }
    };

    const attachStream = () => {
        if (ref.current) {
            ref.current.srcObject = stream;
        }
    };
    useEffect(() => {
        initElement();
        attachStream();
        // eslint-disable-next-line
    }, []);
    return (
        <video
            {...props}
            ref={ref}
            autoPlay
            playsInline
            onContextMenu={(event) => {
                event.preventDefault();
            }}
        />
    );
};

export default VideoElement;
