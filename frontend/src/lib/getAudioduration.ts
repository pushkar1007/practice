export const getAudioDuration = (url: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.src = url;
    audio.preload = "metadata";

    audio.onloadedmetadata = () => {
      resolve(audio.duration);
    };

    audio.onerror = (err) => {
      reject(`Failed to load audio: ${err}`);
    };
  });
};
