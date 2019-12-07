import * as React from 'react';
import WAVEInterface from './waveInterface';
interface AudioRecorderProps {
    initialAudio?: Blob;
    downloadable?: boolean;
    loop?: boolean;
    filename?: string;
    className?: string;
    style?: Object;
    onAbort?: () => void;
    onChange?: (AudioRecorderChangeEvent: any) => void;
    onEnded?: () => void;
    onPause?: () => void;
    onPlay?: () => void;
    onRecordStart?: () => void;
    classes: () => void;
    playLabel?: string;
    playingLabel?: string;
    recordLabel?: string;
    recordingLabel?: string;
    removeLabel?: string;
    downloadLabel?: string;
    apiEndPoint?: string;
    config?: Object;
}
interface AudioRecorderState {
    isRecording: boolean;
    isPlaying: boolean;
    audioData?: Blob;
}
export default class AudioRecorder extends React.Component<AudioRecorderProps, AudioRecorderState> {
    waveInterface: WAVEInterface;
    classes: Record<"recordButton", string>;
    state: AudioRecorderState;
    static defaultProps: {
        loop: boolean;
        downloadable: boolean;
        className: string;
        style: {};
        filename: string;
        playLabel: string;
        playingLabel: string;
        recordLabel: string;
        recordingLabel: string;
        removeLabel: string;
        downloadLabel: string;
        apiEndPoint: string;
        config: {
            headers: {
                "Content-Type": string;
                "Access-Control-Allow-Origin": string;
            };
        };
    };
    componentWillReceiveProps(nextProps: any): void;
    componentWillMount(): void;
    componentWillUnmount(): void;
    startRecording(): void;
    stopRecording(): void;
    startPlayback(): void;
    stopPlayback(): void;
    onAudioEnded: () => void;
    onRemoveClick: () => void;
    onSendData: () => Promise<any>;
    onButtonClick: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
    render(): JSX.Element;
}
export {};
