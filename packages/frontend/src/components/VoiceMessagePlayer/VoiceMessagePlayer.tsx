import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import getBlobDuration from 'get-blob-duration';
import clsx from 'clsx';
import { ReactComponent as PlayIcon } from 'assets/icons/play-icon.svg';
import { ReactComponent as PauseIcon } from 'assets/icons/pause-icon.svg';
import './VoiceMessagePlayer.scss';

type VoiceMessagePlayerProps = {
  className?: string;
  audioBlob: Blob;
};

export const VoiceMessagePlayer: React.FC<VoiceMessagePlayerProps> = ({ className, audioBlob }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [percentageValue, setPercentageValue] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState(0);

  const audioSrc = useMemo(() => URL.createObjectURL(audioBlob), [audioBlob]);
  const audioElement = audioRef.current;

  const handleRangeChange = (event: React.ChangeEvent) => {
    if (!audioElement) {
      return;
    }

    const target = event.target as HTMLInputElement;
    const pickedDuraton = (Number(target.value) / 100) * duration;
    audioElement.currentTime = pickedDuraton;
  };

  const onTimeUpdate = useCallback(() => {
    if (!audioElement) {
      return;
    }

    const currentTime = audioElement.currentTime;
    const percentageValue = Math.round((currentTime / duration) * 100);
    setPercentageValue(Number.isNaN(percentageValue) ? 0 : percentageValue);
  }, [audioElement, duration]);

  const getAudioDuration = useCallback(async () => {
    setDuration(await getBlobDuration(audioBlob));
  }, [audioBlob]);

  useEffect(() => {
    getAudioDuration();
  }, [getAudioDuration]);

  const onEnded = useCallback(async () => {
    setPercentageValue(0);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (!audioElement) {
      return () => {};
    }

    audioElement.addEventListener('timeupdate', onTimeUpdate);
    audioElement.addEventListener('ended', onEnded);

    return () => {
      audioElement.removeEventListener('timeupdate', onTimeUpdate);
      audioElement.removeEventListener('ended', onEnded);
    }
  }, [audioElement, onEnded, onTimeUpdate]);

  const togglePlay = async () => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
        setIsPlaying(false);
      } else {
        await audioElement.play();
        setIsPlaying(true);
      }
    }
  };

  const getDurationCopy = () => {
    const convertSecondsToTime = (seconds: number) => {
      return Math.floor(seconds / 60).toString().padStart(2, '0') + ':' + Math.floor(seconds % 60).toString().padStart(2, '0');
    };

    if (!audioElement) {
      return convertSecondsToTime(duration || 0);
    }

    const currentTime = (percentageValue / 100) * duration;
    return convertSecondsToTime(currentTime) + ' / ' + convertSecondsToTime(duration || 0);
  };



  return (
    <div className={clsx('voice-message-player', className)}>
      <button
        onClick={togglePlay}
        type="button"
        className="voice-message-player__control"
      >
        {isPlaying ? (
          <PauseIcon className="voice-message-player__control-icon" />
        ) : (
          <PlayIcon className="voice-message-player__control-icon" />
        )}
      </button>

      <div className="voice-message-player__core">
        <div className="voice-message-player__range-wrapper">
          <audio ref={audioRef} preload="metadata" className="voice-message-player__root" src={audioSrc} />
          <input
            className="voice-message-player__range"
            type="range"
            min="0"
            max="100"
            step="1"
            value={percentageValue}
            onChange={handleRangeChange}
          />
          <div className="voice-message-player__container">
            <div className="voice-message-player__line" />
            <div
              style={{
                left: `${percentageValue}%`,
                transform: `translate(-${percentageValue}%, -50%)`
              }}
              className="voice-message-player__pointer"
            />
          </div>
        </div>
        <div className="voice-message-player__duration">
          {getDurationCopy()}
        </div>
      </div>
    </div>
  );
};
