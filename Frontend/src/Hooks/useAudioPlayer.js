import { useReducer, useRef, useState, useEffect } from "react";

const initialAudioState = {
    isPlaying: false,
    isLoading: false,
    isMuted: false,
    volume: 1,
    loopEnabled: false,
    shuffleEnabled: false,
    playbackSpeed: 1,
    currentTime: 0,
    duration: 0,
    currentAudioIndex: null,
    currentSong: null,
};

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
        case "TOGGLE_LOOP":
            return { ...state, loopEnabled: !state.loopEnabled, shuffleEnabled: false };
        case "TOGGLE_SHUFFLE":
            return { ...state, shuffleEnabled: !state.shuffleEnabled, loopEnabled: false };
        case "SET_PLAYBACK_SPEED":
            return { ...state, playbackSpeed: action.payload };
        case "SET_CURRENT_TRACK":
            return { ...state, currentAudioIndex: action.payload.index, currentSong: action.payload.song, isLoading: true };
        case "SET_CURRENT_TIME":
            return { ...state, currentTime: action.payload };
        case "SET_DURATION":
            return { ...state, duration: action.payload };
        default:
            return state;
    }
}

const useAudioPlayer = (songs) => {
    const [audioState, dispatch] = useReducer(audioreducer, initialAudioState);
    const audioRef = useRef(null);
    const previousVolumeRef = useRef(1);

    const playSongAtIndex = (index) => {
        if (!songs || songs.length === 0) {
            console.warn("No song available to play");
            return;
        }

        if (index < 0 || index >= songs.length) {
            console.warn("Invalid index");
            return;
        }

        const song = songs[index];
        dispatch({ type: "SET_CURRENT_TRACK", payload: { index, song } });
        dispatch({ type: "SET_CURRENT_TIME", payload: 0 });

        // Trigger play logic in useEffect or directly if audioRef is ready
        // But better to rely on state changes and effect, though here we force load
        setTimeout(() => {
            const audio = audioRef.current;
            if (audio) {
                dispatch({ type: "LOADING" });
                audio.load();
                audio.play()
                    .then(() => dispatch({ type: "PLAY" }))
                    .catch((error) => console.error("Play Error", error));
            }
        }, 0);
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
                // Optionally reset to start
                dispatch({ type: "SET_CURRENT_TIME", payload: 0 });
                if (audioRef.current) audioRef.current.currentTime = 0;
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

        // Check if songs exist
        const prevIndex = (audioState.currentAudioIndex - 1 + songs.length) % songs.length;
        playSongAtIndex(prevIndex);
    };

    const handleEnded = () => {
        // Auto play next logic
        // If loop is on, it behaves like 'repeat one' OR 'repeat list'.
        // Standard behavior: Loop usually means 'repeat list' or 'repeat one'.
        // Code originally implemented 'repeat list' logic inside handleNext.
        // But user might want 'repeat one'.
        // Let's assume 'Loop' button means 'Repeat One' for now based on icon <RiLoopRightLine>?
        // Actually usually Loop = Repeat List, Loop 1 = Repeat One.
        // The original code had: if (loopEnabled) { audio.currentTime = 0; play... } which is Repeat One.
        // Let's stick to Repeat One for 'Loop' since there is only one button?
        // Wait, current icon is RiLoopRightLine.
        // If the user wants Loop (Repeat List), then handleNext() logic is correct.
        // If the user wants key "Loop" to mean "Repeat Current Song", then:

        if (audioState.loopEnabled) {
            const audio = audioRef.current;
            if (audio) {
                audio.currentTime = 0;
                audio.play();
            }
        } else {
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
            audio.volume = restoreVolume;
        } else {
            previousVolumeRef.current = audioState.volume;
            audio.muted = true;
            audio.volume = 0;
            dispatch({ type: "MUTE" });
            dispatch({ type: "SET_VOLUME", payload: 0 });
        }
    };

    const handleToggleLoop = () => {
        dispatch({ type: "TOGGLE_LOOP" });
    }

    const handleToggleShuffle = () => {
        dispatch({ type: "TOGGLE_SHUFFLE" });
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
        dispatch({ type: "SET_DURATION", payload: audio.duration || 0 });

        // Apply duplicate state settings to audio element
        audio.playbackRate = audioState.playbackSpeed;
        audio.muted = audioState.isMuted;
        audio.volume = audioState.volume;

        if (audioState.isPlaying) {
            audio.play().catch(e => console.error(e));
        }
    };

    return {
        // Audio ref
        audioRef,

        // State
        currentIndex: audioState.currentAudioIndex,
        currentSong: audioState.currentSong,
        isPlaying: audioState.isPlaying,
        currentTime: audioState.currentTime,
        duration: audioState.duration,
        volume: audioState.volume,
        isMuted: audioState.isMuted,
        playbackSpeed: audioState.playbackSpeed,
        loopEnabled: audioState.loopEnabled,
        shuffleEnabled: audioState.shuffleEnabled,

        // Controls
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

        // Event Handlers
        handleTimeUpdate,
        handleLoadedMetadata,
        handleEnded,
    }
};

export default useAudioPlayer;


