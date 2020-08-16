import React, { DetailedHTMLProps, VideoHTMLAttributes, useEffect, useRef } from 'react';

type VideoDetailedProps = DetailedHTMLProps<
    VideoHTMLAttributes<HTMLVideoElement>,
    HTMLVideoElement
>;
interface VideoElementProps extends VideoDetailedProps {
    stream: MediaStream;
}

const VideoElement: React.FC<VideoElementProps> = ({ stream, ...props }) => {
    const ref = useRef<HTMLVideoElement>(null);

    const initElement = () => {
        if (ref?.current) {
            ref.current.volume = 0.1;
            ref.current.muted = true;
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
    return <video {...props} ref={ref} autoPlay playsInline />;
};

export default VideoElement;
