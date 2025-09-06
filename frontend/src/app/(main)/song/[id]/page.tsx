"use client";

import { formatTime } from "@/components/feature-specific/PlayerControls";
import { getAudioDuration } from "@/lib/getAudioduration";
import { usePlayerStore } from "@/store/playerStore";
import { useSongStore } from "@/store/songStore";
import { useRouter } from "next/navigation";
import { Vibrant } from "node-vibrant/browser";
import { use, useEffect, useState } from "react";
import { CiClock2 } from "react-icons/ci";
import { IoMdPlay } from "react-icons/io";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const [bgColor, setBgColor] = useState("#1e1e1e");
  const [durations, setDurations] = useState<number[]>([]);
  const [recommendedDuration, setResommendedDuration] = useState<number[]>([]);

  const fetchSong = useSongStore((state) => state.fetchSong);
  const fetchSongsOfAlbum = useSongStore((state) => state.fetchSongsOfAlbum);
  const fetchAllSongs = useSongStore((state) => state.fetchAllSongs);
  const getRecommendedSongs = useSongStore(
    (state) => state.getRecommendedSongs
  );
  const recommendedSongs = useSongStore((state) => state.recommendedSongs);
  const song = useSongStore((state) => state.song);
  const data = useSongStore((state) => state.albumWithSongs);
  const { playSong } = usePlayerStore();
  const router = useRouter();

  const { id } = use(params);

  useEffect(() => {
    const loadSong = async () => {
      fetchSong(id);
    };
    loadSong();
  }, [id, fetchSong]);

  useEffect(() => {
    if (!song?.thumbnail) return;

    Vibrant.from(song?.thumbnail)
      .getPalette()
      .then((palette: any) => {
        const vibrant = palette.LightVibrant?.hex || "#1e1e1e";
        setBgColor(vibrant);
      })
      .catch((err: any) => console.error("Vibrant error:", err));
  }, [song?.thumbnail]);

  useEffect(() => {
    if (!song?.album_id) return;

    const loadSongs = async () => {
      fetchSongsOfAlbum(song?.album_id);
    };
    loadSongs();
  }, [song?.album_id, fetchSongsOfAlbum]);

  useEffect(() => {
    const fetchDurations = async () => {
      if (!data?.songs?.length) return;

      try {
        const results = await Promise.all(
          data.songs.map((song) => getAudioDuration(song.audio))
        );
        const recommendedSongsResult = await Promise.all(
          recommendedSongs.map((song) => getAudioDuration(song.audio))
        );
        setDurations(results);
        setResommendedDuration(recommendedSongsResult);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDurations();
  }, [data?.songs]);

  useEffect(() => {
    const loadSongs = async () => {
      await fetchAllSongs();
      await getRecommendedSongs(useSongStore.getState().songs, 5);
    };

    loadSongs();
  }, [fetchAllSongs, getRecommendedSongs]);

  const handlePlay = () => {
    if (!song) return;

    usePlayerStore.setState((state) => {
      const exists = state.queue.some((s) => s.id === song.id);
      if (exists) {
        return state;
      }
      return { queue: [...state.queue, song] };
    });

    playSong(song);
  };

  return (
    <div className="bg-[#1e1e1e] h-full w-full rounded-lg overflow-y-auto relative">
      <div
        className="absolute inset-x-0 top-0 h-[50%]"
        style={{
          background: `linear-gradient(to bottom, ${bgColor}, #1e1e1e9e)`,
          transition: "background 0.5s ease-in-out",
        }}
      >
        <div className="flex items-center p-[30px] gap-8 relative z-10 min-h-[300px]">
          <img
            src={song?.thumbnail}
            className="w-[220px] h-[220px] rounded-[6px] shadow-2xl/30"
          />
          <div className="space-y-4">
            <h1 className="text-8xl font-extrabold">{song?.title}</h1>
            <p>{song?.description}</p>
          </div>
        </div>
        <div className="relative z-10 px-[30px] pb-10 space-y-4">
          <div
            onClick={handlePlay}
            className="bg-[#1DB954] size-[60px] rounded-full flex items-center justify-center transform transition-transform duration-200 hover:bg-[#2bd566] hover:scale-104 cursor-pointer"
          >
            <IoMdPlay size={30} color="black" className="ml-[3px]" />
          </div>
          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-semibold">
              More Songs from Same Album
            </h2>
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
                data.songs
                  .filter((s) => s.id !== song?.id)
                  .map((s, index) => {
                    const durationForSong =
                      durations[data.songs.findIndex((d) => d.id === s.id)];

                    return (
                      <div key={s.id} className="flex items-center">
                        <div className="w-[5%] flex justify-center">
                          <h3>{index + 1}</h3>
                        </div>
                        <div className="w-[80%] flex gap-4">
                          <img
                            src={s?.thumbnail}
                            className="w-[50px] h-[50px] rounded-[2px]"
                          />
                          <div>
                            <h3
                              className="text-xl font-semibold hover:underline cursor-pointer"
                              onClick={() => router.push(`/song/${s?.id}`)}
                            >
                              {s.title}
                            </h3>
                            <p
                              className="text-sm text-gray-300 hover:underline cursor-pointer"
                              onClick={() => router.push(`/song/${s?.id}`)}
                            >
                              {s.description}
                            </p>
                          </div>
                        </div>
                        <div className="w-[15%] flex justify-center">
                          {durationForSong
                            ? formatTime(durationForSong)
                            : "--:--"}
                        </div>
                      </div>
                    );
                  })
              ) : (
                <p>No songs found.</p>
              )}
            </div>
          </div>
          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-semibold">Songs you may Like</h2>
            <div className="flex items-center">
              <p className="w-[5%] flex justify-center">#</p>
              <p className="w-[80%]">Title</p>
              <div className="w-[15%] flex justify-center">
                <CiClock2 />
              </div>
            </div>
            <hr className="my-4 border-gray-700 w-full" />
            <div className="mt-6 space-y-4">
              {recommendedSongs?.length ? (
                recommendedSongs
                  .filter((s) => s.id !== song?.id)
                  .map((s, index) => {
                    const durationForSong =
                      recommendedDuration[
                        recommendedSongs.findIndex((d) => d.id === s.id)
                      ];

                    return (
                      <div key={s.id} className="flex items-center">
                        <div className="w-[5%] flex justify-center">
                          <h3>{index + 1}</h3>
                        </div>
                        <div className="w-[80%] flex gap-4">
                          <img
                            src={s?.thumbnail}
                            className="w-[50px] h-[50px] rounded-[2px]"
                          />
                          <div>
                            <h3
                              className="text-xl font-semibold hover:underline cursor-pointer"
                              onClick={() => router.push(`/song/${s?.id}`)}
                            >
                              {s.title}
                            </h3>
                            <p
                              className="text-sm text-gray-300 hover:underline cursor-pointer"
                              onClick={() => router.push(`/song/${s?.id}`)}
                            >
                              {s.description}
                            </p>
                          </div>
                        </div>
                        <div className="w-[15%] flex justify-center">
                          {durationForSong
                            ? formatTime(durationForSong)
                            : "--:--"}
                        </div>
                      </div>
                    );
                  })
              ) : (
                <p>No songs found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
