var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
import WAVEInterface from './waveInterface';
import Button from '@material-ui/core/Button';
import MicIcon from '@material-ui/icons/Mic';
import axios from 'axios';
;
;
var AudioRecorder = /** @class */ (function (_super) {
    __extends(AudioRecorder, _super);
    function AudioRecorder() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.waveInterface = new WAVEInterface();
        _this.state = {
            isRecording: false,
            isPlaying: false,
            audioData: _this.props.initialAudio
        };
        _this.onAudioEnded = function () {
            _this.setState({ isPlaying: false });
            if (_this.props.onEnded)
                _this.props.onEnded();
        };
        _this.onRemoveClick = function () {
            _this.waveInterface.reset();
            if (_this.state.audioData && _this.props.onChange)
                _this.props.onChange({ duration: 0, audioData: null });
            _this.setState({
                isPlaying: false,
                isRecording: false,
                audioData: null,
            });
        };
        // onDownloadClick = () => downloadBlob(this.state.audioData, this.props.filename);
        _this.onSendData = function () { return axios.post(_this.props.apiEndPoint, _this.state.audioData, _this.props.config)
            .then(function (res) { return res.data; }); };
        _this.onButtonClick = function (event) {
            if (_this.state.audioData) {
                if (_this.state.isPlaying) {
                    _this.stopPlayback();
                    event.preventDefault();
                }
                else {
                    _this.startPlayback();
                }
            }
            else {
                if (_this.state.isRecording) {
                    _this.stopRecording();
                }
                else {
                    _this.startRecording();
                }
            }
        };
        return _this;
    }
    AudioRecorder.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.initialAudio &&
            nextProps.initialAudio !== this.props.initialAudio &&
            this.state.audioData &&
            nextProps.initialAudio !== this.state.audioData) {
            this.waveInterface.reset();
            this.setState({
                audioData: nextProps.initialAudio,
                isPlaying: false,
                isRecording: false,
            });
        }
    };
    AudioRecorder.prototype.componentWillMount = function () { this.waveInterface.reset(); };
    AudioRecorder.prototype.componentWillUnmount = function () { this.waveInterface.reset(); };
    AudioRecorder.prototype.startRecording = function () {
        var _this = this;
        if (!this.state.isRecording) {
            this.waveInterface.startRecording()
                .then(function () {
                _this.setState({ isRecording: true });
                if (_this.props.onRecordStart)
                    _this.props.onRecordStart();
            })
                .catch(function (err) { throw err; });
        }
    };
    AudioRecorder.prototype.stopRecording = function () {
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
    };
    AudioRecorder.prototype.startPlayback = function () {
        var _this = this;
        if (!this.state.isPlaying) {
            this.waveInterface.startPlayback(this.props.loop, this.onAudioEnded).then(function () {
                _this.setState({ isPlaying: true });
                if (_this.props.onPlay)
                    _this.props.onPlay();
            });
        }
    };
    AudioRecorder.prototype.stopPlayback = function () {
        this.waveInterface.stopPlayback();
        this.setState({ isPlaying: false });
        if (this.props.onAbort)
            this.props.onAbort();
    };
    AudioRecorder.prototype.render = function () {
        return (React.createElement("div", { className: "AudioRecorder" },
            React.createElement(Button, { variant: "contained", color: "secondary", onClick: this.onButtonClick, style: {
                    backgroundColor: 'red',
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    color: 'white',
                    border: '2px solid white',
                    margin: '2rem'
                } },
                this.state.audioData && !this.state.isPlaying && this.props.playLabel,
                this.state.audioData && this.state.isPlaying && this.props.playingLabel,
                !this.state.audioData && !this.state.isRecording && this.props.recordLabel,
                !this.state.audioData && this.state.isRecording && this.props.recordingLabel),
            this.state.audioData &&
                React.createElement("button", { className: "AudioRecorder-remove", onClick: this.onRemoveClick, style: {
                        backgroundColor: 'gold',
                        width: '90px',
                        height: '90px',
                        borderRadius: '50%',
                        color: 'white',
                        border: '2px solid white',
                        margin: '2rem'
                    } }, this.props.removeLabel),
            this.state.audioData && this.props.downloadable &&
                React.createElement("button", { className: "AudioRecorder-download", onClick: this.onSendData, style: {
                        backgroundColor: 'dodgerblue',
                        width: '90px',
                        height: '90px',
                        borderRadius: '50%',
                        color: 'white',
                        border: '2px solid white',
                        margin: '2rem'
                    } }, this.props.downloadLabel)));
    };
    AudioRecorder.defaultProps = {
        loop: false,
        downloadable: true,
        className: '',
        style: {},
        filename: 'output.wav',
        playLabel: '🔊 Play',
        playingLabel: '❚❚ Playing',
        recordLabel: [React.createElement(MicIcon, null)],
        recordingLabel: '● Recording',
        removeLabel: '✖ Remove',
        downloadLabel: '\ud83d\udcbe Save',
        apiEndPoint: 'http://127.0.0.1:5000/',
        config: {
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
            }
        }
    };
    return AudioRecorder;
}(React.Component));
export default AudioRecorder;
