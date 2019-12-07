export default class WAVEInterface {
    static audioContext: AudioContext;
    static bufferSize: number;
    playbackNode: AudioBufferSourceNode;
    recordingNodes: AudioNode[];
    recordingStream: MediaStream;
    buffers: Float32Array[][];
    encodingCache?: Blob;
    get bufferLength(): number;
    get audioDuration(): number;
    get audioData(): Blob;
    startRecording(): Promise<unknown>;
    stopRecording(): void;
    startPlayback(loop: boolean, onended: () => void): Promise<unknown>;
    stopPlayback(): void;
    reset(): void;
}
