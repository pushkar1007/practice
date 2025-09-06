"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { IoMdPlay } from "react-icons/io";
import { usePlayerStore } from "@/store/playerStore";
import { Song } from "@/store/songStore";

interface MusicCardProps {
  id: string;
  image?: string;
  title: string;
  description?: string;
  isAlbum?: boolean;
  song?: Song;
}

const MusicCard: React.FC<MusicCardProps> = ({
  id,
  image,
  title,
  description,
  isAlbum = false,
  song,
}) => {
  const router = useRouter();
  const playSong = usePlayerStore((state) => state.playSong);
  const togglePlay = usePlayerStore((state) => state.togglePlay);
  const currentSong = usePlayerStore((state) => state.currentSong);
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!song) return;

    if (!currentSong || currentSong.id !== song.id) {
      playSong(song); 
    } else {
      togglePlay();
    }
  };

  const handleClick = () => {
    isAlbum ? router.push(`/album/${id}`) : router.push(`/song/${id}`);
  };
  return (
    <div
      className="w-[182px] p-4 rounded-lg hover:bg-[#282828] transition duration-300 group cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={image}
          alt="thumbnail"
          className="w-full h-[150px] object-cover rounded-lg"
        />
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition duration-300">
          <div
            onClick={handlePlay}
            className="bg-[#1DB954] size-[40px] rounded-full flex items-center justify-center transform transition-transform duration-200 hover:bg-[#2bd566] hover:scale-104"
          >
            <IoMdPlay size={20} color="black" className="ml-[3px]" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-0 mt-3">
        <h3 className="truncate">{title}</h3>
        <p className="text-[#909090] text-sm  truncate">{description}</p>
      </div>
    </div>
  );
};

export default MusicCard;
