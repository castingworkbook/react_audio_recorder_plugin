import * as React from 'react';
import WAVEInterface from './waveInterface';
import Button from '@material-ui/core/Button';
import MicIcon from '@material-ui/icons/Mic';
import SaveIcon from '@material-ui/icons/Save';
import GraphicEqIcon from '@material-ui/icons/GraphicEq';
import DeleteIcon from '@material-ui/icons/Delete';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import axios from 'axios';

interface AudioRecorderChangeEvent {
  duration: number,
  audioData?: Blob,
}
interface AudioRecorderProps {
  initialAudio?: Blob,
  downloadable?: boolean,
  loop?: boolean,
  filename?: string,
  className?: string,

  onAbort?: () => void,
  onChange?: (AudioRecorderChangeEvent) => void,
  onEnded?: () => void,
  onPause?: () => void,
  onPlay?: () => void,
  onRecordStart?: () => void,

  playLabel?: string,
  playingLabel?: string,
  recordLabel?: string,
  recordingLabel?: string,
  removeLabel?: string,
  downloadLabel?: string,
  apiEndPoint?: string,
  config?: Object,
};

interface AudioRecorderState {
  isRecording: boolean,
  isPlaying: boolean,
  audioData?: Blob
};

export default class AudioRecorder extends React.Component<AudioRecorderProps, AudioRecorderState> {
  waveInterface = new WAVEInterface();

  state: AudioRecorderState = {
    isRecording: false,
    isPlaying: false,
    audioData: this.props.initialAudio
  };

  static defaultProps = {
    loop: false,
    downloadable: true,
    className: '',
    style: {},
    filename: 'output.wav',
    playLabel: [<PlayArrowIcon />],
    playingLabel: [<PauseIcon />],
    recordLabel: [<MicIcon />],
    recordingLabel: [<GraphicEqIcon />],
    removeLabel: [<DeleteIcon />],
    downloadLabel: [<SaveIcon />],
    apiEndPoint: 'http://127.0.0.1:5000/',
    config: {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      }
    }
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.initialAudio &&
      nextProps.initialAudio !== this.props.initialAudio &&
      this.state.audioData &&
      nextProps.initialAudio !== this.state.audioData
    ) {
      this.waveInterface.reset();
      this.setState({
        audioData: nextProps.initialAudio,
        isPlaying: false,
        isRecording: false,
      });
    }
  }

  componentWillMount() { this.waveInterface.reset(); }
  componentWillUnmount() { this.waveInterface.reset(); }

  startRecording() {
    if (!this.state.isRecording) {
      this.waveInterface.startRecording()
        .then(() => {
          this.setState({ isRecording: true });
          if (this.props.onRecordStart) this.props.onRecordStart();
        })
        .catch((err) => { throw err; });
    }
  }

  stopRecording() {
    this.waveInterface.stopRecording();

    this.setState({
      isRecording: false,
      audioData: this.waveInterface.audioData
    });

    if (this.props.onChange) {
      this.props.onChange({
        duration: this.waveInterface.audioDuration,
        audioData: this.waveInterface.audioData
      });
    }
  }

  startPlayback() {
    if (!this.state.isPlaying) {
      this.waveInterface.startPlayback(this.props.loop, this.onAudioEnded).then(() => {
        this.setState({ isPlaying: true });
        if (this.props.onPlay) this.props.onPlay();
      });
    }
  }

  stopPlayback() {
    this.waveInterface.stopPlayback();
    this.setState({ isPlaying: false });
    if (this.props.onAbort) this.props.onAbort();
  }

  onAudioEnded = () => {
    this.setState({ isPlaying: false });
    if (this.props.onEnded) this.props.onEnded();
  };

  onRemoveClick = () => {
    this.waveInterface.reset();
    if (this.state.audioData && this.props.onChange) this.props.onChange({ duration: 0, audioData: null });
    this.setState({
      isPlaying: false,
      isRecording: false,
      audioData: null,
    });
  };


  // onDownloadClick = () => downloadBlob(this.state.audioData, this.props.filename);
  onSendData = () => axios.post(this.props.apiEndPoint, this.state.audioData, this.props.config)
    .then(res => res.data);

  onButtonClick = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    if (this.state.audioData) {
      if (this.state.isPlaying) {
        this.stopPlayback();
        event.preventDefault();
      } else {
        this.startPlayback();
      }
    } else {
      if (this.state.isRecording) {
        this.stopRecording();
      } else {
        this.startRecording();
      }
    }
  };

  render() {
    return (
      <div className="AudioRecorder">
        <Button
          variant="contained"
          color="secondary"
          onClick={this.onButtonClick}
          style={{
            backgroundColor: 'red',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            color: 'white',
            border: '2px solid white',
            margin: '2rem'
          }}
        >
          {/* className={
            [
              'AudioRecorder-button',
              this.state.audioData ? 'hasAudio' : '',
              this.state.isPlaying ? 'isPlaying' : '',
              this.state.isRecording ? 'isRecording' : '',
            ].join(' ')
          } */}
          {this.state.audioData && !this.state.isPlaying && this.props.playLabel}
          {this.state.audioData && this.state.isPlaying && this.props.playingLabel}
          {!this.state.audioData && !this.state.isRecording && this.props.recordLabel}
          {!this.state.audioData && this.state.isRecording && this.props.recordingLabel}
        </Button>
        {this.state.audioData &&
          <button
            className="AudioRecorder-remove"
            onClick={this.onRemoveClick}
            style={{
              backgroundColor: 'gold',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              color: 'white',
              border: '2px solid white',
              margin: '2rem'
            }}
          >
            {this.props.removeLabel}
          </button>
        }
        {this.state.audioData && this.props.downloadable &&
          <button
            className="AudioRecorder-download"
            onClick={this.onSendData}
            style={{
              backgroundColor: 'dodgerblue',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              color: 'white',
              border: '2px solid white',
              margin: '2rem'
            }}
          >
            {this.props.downloadLabel}
          </button>
        }
      </div>
    );
  }
}
