var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as React from 'react';
import WAVEInterface from './waveInterface';
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
        // handle new initialAudio being passed in
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
            React.createElement("button", { className: [
                    'AudioRecorder-button',
                    this.state.audioData ? 'hasAudio' : '',
                    this.state.isPlaying ? 'isPlaying' : '',
                    this.state.isRecording ? 'isRecording' : '',
                ].join(' '), onClick: this.onButtonClick },
                this.state.audioData && !this.state.isPlaying && this.props.playLabel,
                this.state.audioData && this.state.isPlaying && this.props.playingLabel,
                !this.state.audioData && !this.state.isRecording && this.props.recordLabel,
                !this.state.audioData && this.state.isRecording && this.props.recordingLabel),
            this.state.audioData &&
                React.createElement("button", { className: "AudioRecorder-remove", onClick: this.onRemoveClick }, this.props.removeLabel),
            this.state.audioData && this.props.downloadable &&
                React.createElement("button", { className: "AudioRecorder-download", onClick: function () { return function sendData(apiEndpoint, data, config) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, axios.post(apiEndpoint, data, config)
                                            .then(function (res) { return console.log('Response from AudioRecorder: ', res.data); })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    }; } }, this.props.downloadLabel)));
    };
    AudioRecorder.defaultProps = {
        loop: false,
        downloadable: true,
        className: '',
        style: {},
        filename: 'output.wav',
        playLabel: '🔊 Play',
        playingLabel: '❚❚ Playing',
        recordLabel: '● Record',
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
