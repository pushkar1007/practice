"use client";

import MusicCard from "@/components/ui/musicCard";
import { useSongStore } from "@/store/songStore";
import { useEffect } from "react";

const Page = () => {
  const items = ["All", "Music", "Podcasts"];
  const { songs, albums, fetchAllSongs, fetchAllAlbums } = useSongStore();
  useEffect(() => {
    fetchAllSongs();
    fetchAllAlbums();
  }, [fetchAllSongs, fetchAllAlbums]);
  return (
    <div className="w-full h-full bg-[#1e1e1e] rounded-lg space-y-4 p-[24px] overflow-y-auto">
      <div className="flex gap-4">
        {items.map((item) => (
          <div
            key={item}
            className="bg-[#3d3d3d] p-[6px] px-[16px] rounded-[500px] cursor-pointer"
          >
            <p>{item}</p>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold">Most Listened Albums</h3>
        <div className="flex gap-4">
          {albums.map((album) => (
            <div key={album.id}>
              <MusicCard
                id={album.id}
                image={album.thumbnail}
                title={album.title}
                description={album.description}
                isAlbum
              />
            </div>
          ))}
        </div>
      </div>
      <div className="w-[96%] space-y-2/">
        <h3 className="text-xl font-bold">Most Listened Songs</h3>
        <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-900">
          {songs.map((song) => (
            <div key={song.id}>
              <MusicCard
                id={song.id}
                image={song.thumbnail}
                description={song.description}
                title={song.title}
                song={song}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
