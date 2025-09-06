"use client";

import { useSongStore } from "@/store/songStore";
import { usePlayerStore } from "@/store/playerStore";
import { useEffect, use, useState } from "react";
import { Vibrant } from "node-vibrant/browser";
import { IoMdPlay } from "react-icons/io";
import { CiClock2 } from "react-icons/ci";
import { getAudioDuration } from "@/lib/getAudioduration";
import { formatTime } from "@/components/feature-specific/PlayerControls";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const [bgColor, setBgColor] = useState("#1e1e1e");
  const [durations, setDurations] = useState<number[]>([]);

  const fetchSongsofAlbum = useSongStore((state) => state.fetchSongsOfAlbum);
  const data = useSongStore((state) => state.albumWithSongs);

  const { playSong } = usePlayerStore();

  const { id } = use(params);

  useEffect(() => {
    const loadSongs = async () => {
      fetchSongsofAlbum(id);
    };
    loadSongs();
  }, [id, fetchSongsofAlbum]);

  useEffect(() => {
    if (!data?.album?.thumbnail) return;

    Vibrant.from(data?.album?.thumbnail)
      .getPalette()
      .then((palette: any) => {
        const vibrant = palette.LightVibrant?.hex || "#1e1e1e";
        setBgColor(vibrant);
      })
      .catch((err: any) => console.error("Vibrant error:", err));
  }, [data?.album?.thumbnail]);

  useEffect(() => {
    const fetchDurations = async () => {
      if (!data?.songs?.length) return;

      try {
        const results = await Promise.all(
          data.songs.map((song) => getAudioDuration(song.audio))
        );
        setDurations(results);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDurations();
  }, [data?.songs]);

  const handlePlayRandom = () => {
    if (!data?.songs?.length) return;

    const randomIndex = Math.floor(Math.random() * data.songs.length);
    const randomSong = data.songs[randomIndex];

    usePlayerStore.setState({ queue: data.songs });

    playSong(randomSong);
  };

  return (
    <div className="bg-[#1e1e1e] h-full w-full rounded-lg overflow-y-auto relative">
      <div
        className="absolute inset-x-0 top-0 h-[50%] pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, ${bgColor}, #1e1e1e9e)`,
          transition: "background 0.5s ease-in-out",
        }}
      />

      <div className="flex items-center p-[30px] gap-8 relative z-10 min-h-[300px]">
        <img
          src={data?.album?.thumbnail}
          className="w-[220px] h-[220px] rounded-[6px] shadow-2xl/30"
        />
        <div className="space-y-4">
          <h1 className="text-8xl font-extrabold">{data?.album?.title}</h1>
          <p>{data?.album?.description}</p>
        </div>
      </div>

      <div className="relative z-10 px-[30px] pb-10 space-y-4">
        <div
          onClick={handlePlayRandom}
          className="bg-[#1DB954] size-[60px] rounded-full flex items-center justify-center transform transition-transform duration-200 hover:bg-[#2bd566] hover:scale-104 cursor-pointer"
        >
          <IoMdPlay size={30} color="black" className="ml-[3px]" />
        </div>

        <div className="flex items-center">
          <p className="w-[5%] flex justify-center">#</p>
          <p className="w-[80%]">Title</p>
          <div className="w-[15%] flex justify-center">
            <CiClock2 />
          </div>
        </div>
        <hr className="my-4 border-gray-700 w-full" />
        <div className="mt-6 space-y-4">
          {data?.songs?.length ? (
            data.songs.map((song, index) => (
              <div key={song.id} className="flex items-center">
                <div className="w-[5%] flex justify-center">
                  <h3>{index + 1}</h3>
                </div>
                <div className="w-[80%] flex gap-4">
                  <img
                    src={song?.thumbnail}
                    className="w-[50px] h-[50px] rounded-[2px]"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{song.title}</h3>
                    <p className="text-sm text-gray-300">{song.description}</p>
                  </div>
                </div>
                <div className="w-[15%] flex justify-center">
                  {durations[index] ? formatTime(durations[index]) : "--:--"}
                </div>
              </div>
            ))
          ) : (
            <p>No songs found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
