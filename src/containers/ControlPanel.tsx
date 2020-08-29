import React from 'react';
import Button from '../components/commons/Button';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import ChatIcon from '@material-ui/icons/Chat';

interface ControlPanelProps {
    videoEnabled: boolean;
    audioEnabled: boolean;
    isChatOpen: boolean;
    onVideoToggle: () => void;
    onAudioToggle: () => void;
    onChatToggle: () => void;
    isHost: boolean;
    onEndClick: () => void;
    onInviteClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onLeaveClick: () => void;
    isConnectionFailed: boolean;
    onReconnect: () => void;
}
const ControlPanel: React.FC<ControlPanelProps> = ({
    videoEnabled,
    audioEnabled,
    onVideoToggle,
    onAudioToggle,
    isChatOpen,
    onChatToggle,
    isHost,
    onEndClick,
    onInviteClick,
    onLeaveClick,
    isConnectionFailed,
    onReconnect,
}) => {
    return (
        <div className="flex control-panel justify-center h-16 items-center px-4 bg-gray-700">
            {!isConnectionFailed ? (
                <>
                    <Button size="small" color="primary" className="mr-4" onClick={onVideoToggle}>
                        {videoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
                    </Button>
                    <Button size="small" color="primary" className="mr-4" onClick={onAudioToggle}>
                        {audioEnabled ? <MicIcon /> : <MicOffIcon />}
                    </Button>
                    <Button
                        size="small"
                        color={isChatOpen ? 'secondary' : 'primary'}
                        className="mr-4"
                        onClick={onChatToggle}
                    >
                        <ChatIcon />
                    </Button>

                    <Button size="small" color="secondary" onClick={onInviteClick} className="mr-4">
                        Invite
                    </Button>
                    <Button size="small" color="secondary" onClick={onLeaveClick} className="mr-4">
                        Leave
                    </Button>
                    {isHost && (
                        <Button size="small" color="danger" onClick={onEndClick}>
                            End
                        </Button>
                    )}
                </>
            ) : (
                <Button size="small" color="secondary" onClick={onReconnect} className="mr-4">
                    Reconnect
                </Button>
            )}
        </div>
    );
};

export default ControlPanel;
