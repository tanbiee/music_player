import { useReducer, useRef, useState } from "react";

const initialAudioState = {
    isPlaying: false,
    isLoading: false,
    isMuted: false,
    volume: 1,
    loopEnabled: false,
    shuffleEnabled: false,
    currentTime: 0,
    duration: 0,
    audioSrc: null,
    audioRef: null,
    audioList: [],
    currentAudioIndex: null,
    currentSong: null,
}

// Reducers
function audioreducer(state, action) {
    switch (action.type) {
        case "LOADING":
            return { ...state, isLoading: true };
        case "PLAY":
            return { ...state, isPlaying: true, isLoading: false };
        case "PAUSE":
            return { ...state, isPlaying: false, isLoading: false };
        case "MUTE":
            return { ...state, isMuted: true };
        case "UNMUTE":
            return { ...state, isMuted: false };
        case "SET_VOLUME":
            return { ...state, volume: action.payload };
        case "SET_LOOP":
            return { ...state, loopEnabled: !state.loopEnabled, shuffleEnabled: false };
        case "SET_SHUFFLE":
            return { ...state, shuffleEnabled: !state.shuffleEnabled, loopEnabled: false };
        case "SET_PLAYBACK_SPEED":
            return { ...state, playbackSpeed: action.payload };
        case "SET_CURRENT_TRACK":
            return { ...state, currentAudioIndex: action.payload.index, currentSong: action.payload.song, isLoading: true };
        case "SET_CURRENT_TIME":
            return { ...state, currentTime: action.payload };
        default:
            return state;
    }
}

const useAudioPlayer = (songs) => {
    const [audioState, dispatch] = useReducer(audioreducer, initialAudioState);
    const audioRef = useRef(null);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [loopEnabled, setLoopEnabled] = useState(false);
    const [shuffleEnabled, setShuffleEnabled] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [audioSrc, setAudioSrc] = useState(null);
    const [audioList, setAudioList] = useState([]);
    const [currentAudioIndex, setCurrentAudioIndex] = useState(null);
    const [currentSong, setCurrentSong] = useState(null);
    const previousVolumeRef = useRef(1);


    const playSongAtIndex = (index) => {
        if (!songs || songs.length === 0) {
            console.warn("No song avaliable to play");
            return;
        }

        if (index < 0 || index >= songs.length) {
            console.warn("Invalid index");
            return;
        }

        const song = songs[index];
        // setCurrentAudioIndex(index);
        // setCurrentSong(song);
        dispatch({ type: "SET_CURRENT_TRACK", payload: { index, song } });
        dispatch({ type: "SET_CURRENT_TIME", payload: 0 });

        const audio = audioRef.current;
        if (!audio) return;

        dispatch({ type: "LOADING" });
        audio.load();
        audio.playbackRate = audioState.playbackSpeed;
        audio
            .play()
            .then(() => dispatch({ type: "PLAY" }))
            .catch((error) => console.error("Play Error", error));
    };

    const handleTogglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.paused) {
            audio.play().then(() => dispatch({ type: "PLAY" }))
                .catch((error) => console.error("Play Error", error));
        } else {
            audio.pause();
            dispatch({ type: "PAUSE" });
        }
    };

    const handleNext = () => {
        if (!songs || !songs.length) return;

        // if shuffle is enabled
        if (audioState.shuffleEnabled && songs.length > 1) {
            let randomIndex = audioState.currentAudioIndex;
            while (randomIndex === audioState.currentAudioIndex) {
                randomIndex = Math.floor(Math.random() * songs.length);
            }
            playSongAtIndex(randomIndex);
            return;
        }

        if (audioState.currentAudioIndex === songs.length - 1) {
            if (audioState.loopEnabled) {
                playSongAtIndex(0);
            } else {
                dispatch({ type: "PAUSE" });
            }
        } else {
            playSongAtIndex(audioState.currentAudioIndex + 1);
        }
    };

    const handlePrev = () => {
        if (!songs || !songs.length) return;

        if (audioState.currentAudioIndex === null) {
            playSongAtIndex(0);
            return;
        }

        const prevIndex = (audioState.currentAudioIndex - 1 + songs.length) % songs.length;
        playSongAtIndex(prevIndex);
    };



    const handleEnded = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audioState.loopEnabled) {
            audio.currentTime = 0;
            audio.play().then(() => { dispatch({ type: "PLAY" }); dispatch({ type: "SET_CURRENT_TIME", payload: 0 }) }).catch((error) => console.error("Play Error", error));
        }

        else {
            handleNext();
        }
    };

    const handleToggleMute = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audioState.isMuted) {
            const restoreVolume = previousVolumeRef.current;
            audio.muted = false;
            dispatch({ type: "UNMUTE" });
            dispatch({ type: "SET_VOLUME", payload: restoreVolume });
        } else {
            previousVolumeRef.current = audioState.volume;
            audio.muted = true;
            audio.volume = 0;
            dispatch({ type: "MUTE" });
            dispatch({ type: "SET_VOLUME", payload: 0 });
        }
    };

    const handleToggleLoop = () => {
        dispatch({ type: "SET_LOOP" });
    }

    const handleToggleShuffle = () => {
        dispatch({ type: "SET_SHUFFLE" });
    };

    const handleSetPlaybackSpeed = (speed) => {
        const audio = audioRef.current;
        dispatch({ type: "SET_PLAYBACK_SPEED", payload: speed });
        if (audio) {
            audio.playbackRate = speed;
        }
    };

    const handleSeek = (time) => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = time;
        dispatch({ type: "SET_CURRENT_TIME", payload: time });
    };

    const handleVolumeChange = (volume) => {
        const audio = audioRef.current;

        if (volume > 0) {
            previousVolumeRef.current = volume;
        }
        dispatch({ type: "SET_VOLUME", payload: volume });
        if (!audio) return;
        audio.volume = volume;

        if (volume === 0) {
            audio.muted = true;
            dispatch({ type: "MUTE" });
        } else if (audioState.isMuted) {
            audio.muted = false;
            dispatch({ type: "UNMUTE" });
        }
    };

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (!audio) return;
        dispatch({ type: "SET_CURRENT_TIME", payload: audio.currentTime || 0 });
    };

    const handleLoadedMetadata = () => {
        const audio = audioRef.current;
        if (!audio) return;
        setDuration(audio.duration || 0);
        audio.playbackRate = audioState.playbackSpeed;
        audio.muted = audioState.isMuted;
        audio.volume = audioState.volume;

        dispatch({ type: "PLAY" });
    };

    return {
        // Audio ref
        audioRef,

        // current Song state
        currentIndex: audioState.currentAudioIndex,
        currentSong: audioState.currentSong,
        isPlaying: audioState.isPlaying,
        currentTime: audioState.currentTime,
        duration,
        volume: audioState.volume,
        isMuted: audioState.isMuted,
        playbackSpeed: audioState.playbackSpeed,
        loopEnabled: audioState.loopEnabled,
        shuffleEnabled: audioState.shuffleEnabled,

        // Playback controls
        playSongAtIndex,
        handleTogglePlay,
        handleNext,
        handlePrev,
        handleToggleMute,
        handleToggleLoop,
        handleToggleShuffle,
        handleSetPlaybackSpeed,
        handleSeek,
        handleVolumeChange,

        // Audio event handlers
        handleTimeUpdate,
        handleLoadedMetadata,
        handleEnded,

        // feature control functions
        handleToggleMute,
        handleToggleLoop,
        handleToggleShuffle,
        handleSetPlaybackSpeed,
        handleSeek,
        handleVolumeChange,
    }
};

export default useAudioPlayer;


