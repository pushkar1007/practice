"use client";

import React, { useEffect, useState, useCallback } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { FaCirclePause, FaCirclePlay } from "react-icons/fa6";
import { IoMdSkipForward, IoMdSkipBackward } from "react-icons/io";
import { HiOutlineQueueList } from "react-icons/hi2";
import { RxSpeakerLoud } from "react-icons/rx";
import { Slider } from "../ui/slider";

const PlayerControls = () => {
  const {
    currentSong,
    isPlaying,
    duration,
    currentTime,
    togglePlay,
    nextSong,
    prevSong,
    setVolume,
    setDuration,
    setCurrentTime,
    seek,
    audio,
  } = usePlayerStore();

  const [isSeeking, setIsSeeking] = useState(false);

  const handleSeekChange = useCallback(
    (value: number[]) => {
      setIsSeeking(true);
      setCurrentTime(value[0]);
    },
    [setCurrentTime]
  );

  const handleSeekCommit = useCallback(
    (value: number[]) => {
      seek(value[0]);
      setIsSeeking(false);
    },
    [seek]
  );

  const handleVolumeChange = useCallback(
    (value: number[]) => {
      setVolume(value[0] / 100);
    },
    [setVolume]
  );

  useEffect(() => {
    if (!audio) return;

    const updateTime = () => !isSeeking && setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);

    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", nextSong);

    return () => {
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", nextSong);
    };
  }, [audio, isSeeking, setCurrentTime, setDuration, nextSong]);

  return (
    <div className="flex w-full h-full items-center justify-between gap-4 py-2 px-4 mt-[-8px] text-white">
      {currentSong ? (
        <div className="flex gap-2 items-center w-[300px]">
          <img
            className="w-[80px] h-[80px] object-cover rounded"
            src={currentSong.thumbnail}
            alt={currentSong.title}
          />

          <h3 className="truncate font-semibold">{currentSong.title}</h3>
        </div>
      ) : (
        <div className="w-[300px] h-[80px]" />
      )}

      <div className="w-[300px] flex flex-col justify-center items-center">
        <div className="flex flex-col items-center w-[300px]">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeekChange}
            onValueCommit={handleSeekCommit}
          />
          <div className="flex justify-between text-xs w-full mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <div className="flex justify-center items-center gap-4">
          <button className="cursor-pointer" onClick={prevSong}>
            <IoMdSkipBackward size={24} />
          </button>
          <button className="cursor-pointer" onClick={togglePlay}>
            {isPlaying ? (
              <FaCirclePause size={32} />
            ) : (
              <FaCirclePlay size={32} />
            )}
          </button>
          <button className="cursor-pointer" onClick={nextSong}>
            <IoMdSkipForward size={24} />
          </button>
        </div>
      </div>

      <div className="flex w-[300px] gap-4 justify-center items-center">
        <HiOutlineQueueList size={24} />
        <div className="flex gap-2 w-[120px]">
          <RxSpeakerLoud size={24} />
          <Slider
            defaultValue={[100]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  );
};

export const formatTime = (time: number) => {
  if (!time || isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export default PlayerControls;
