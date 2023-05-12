import { useEffect, useRef, useState } from "react";
import { data } from "./data.tsx";

function App() {
  const [isPlaying, setPlaying] = useState(false);
  const [isSuffle, setSuffle] = useState(false);
  const [isLiked, setLiked] = useState(false);
  const [isDisliked, setDisliked] = useState(false);
  const [isRepeat, setRepeat] = useState("1");
  const [currentPlaylist, setCurrentPlaylist] = useState(data);
  const [currentSong, setCurrentSong] = useState(currentPlaylist[0]);
  const [currentAudio, setCurrentAudio] = useState<any>(
    new Audio(currentPlaylist[0].src)
  );
  const [totalTimeString, setTotalTime] = useState("");
  const [restTimeString, setRestTime] = useState("00:00");
  const [maxRangeNumber, setMaxRange] = useState(0);
  const [currentRangeNumber, setCurrentRange] = useState(0);

  // console.log("max", maxRangeNumber);
  // console.log("CurrentRange", currentRangeNumber);

  const setCurrentSongTotalTime = () => {
    currentAudio.addEventListener("loadedmetadata", () => {
      const totalMinutes = Math.floor(currentAudio.duration / 60);
      const totalSeconds = Math.floor(currentAudio.duration % 60);
      const formattedTotalTime = `${totalMinutes
        .toString()
        .padStart(2, "0")}:${totalSeconds.toString().padStart(2, "0")}`;
      setTotalTime(formattedTotalTime);
    });
  };

  const setCurrentSongRestTime = () => {
    currentAudio.addEventListener("timeupdate", () => {
      const rest = currentAudio.currentTime;
      const restMinutes = Math.floor(rest / 60);
      const restSeconds = Math.floor(rest % 60);
      const formattedRestTime = `${restMinutes
        .toString()
        .padStart(2, "0")}:${restSeconds.toString().padStart(2, "0")}`;
      setRestTime(formattedRestTime);
      setCurrentRange(rest);
    });
  };

  const setCurrentSongMaxTime = () => {
    currentAudio.addEventListener("loadedmetadata", () => {
      const maxDuration = currentAudio.duration;
      setMaxRange(maxDuration);
    });
  };

  useEffect(() => {
    setCurrentSongTotalTime();
    setCurrentSongMaxTime();
    setCurrentSongRestTime();
  }, [currentAudio, currentAudio.duration, currentAudio.currentTime]);

  const handleInputRange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const position = parseFloat(event.target.value);
    currentAudio.currentTime = position;
    setCurrentRange(position);
    setCurrentSongRestTime();
  };

  const handlePlayClick = () => {
    if (currentAudio.paused) {
      currentAudio.play();
      setPlaying(!isPlaying);
    } else {
      currentAudio.pause();
      setPlaying(!isPlaying);
    }
  };
  // console.log("c", currentSong);
  // console.log("c", currentAudio);

  const setCurrentRefAudio = useRef<any>();
  const setCurrentForwardIndex = useRef<any>();
  const setCurrentSongIndex = useRef<any>();

  const [index, setIndex] = useState(0);

  const handleForwardClick = () => {
    const currentIndex = currentPlaylist.indexOf(currentSong);
    if (currentIndex !== currentPlaylist.length - 1) {
      if (currentAudio.paused && setCurrentRefAudio.current === undefined) {
        const indexUpdated = currentIndex + 1;
        setCurrentRange(0);
        setRestTime("00:00");
        setCurrentSong(currentPlaylist[indexUpdated]);
        setCurrentAudio(new Audio(currentSong.src));
        setCurrentSongTotalTime();
        setCurrentSongRestTime();
        setCurrentSongMaxTime();
        setCurrentRefAudio.current = new Audio(
          currentPlaylist[indexUpdated].src
        );
        setPlaying(!isPlaying);
        setCurrentRefAudio.current.play();
      }
      if (!currentAudio.paused && setCurrentRefAudio.current === undefined) {
        const indexUpdated = currentIndex + 1;
        setCurrentRange(0);
        setRestTime("00:00");
        setCurrentSong(currentPlaylist[indexUpdated]);
        setCurrentAudio(new Audio(currentSong.src));
        setCurrentSongTotalTime();
        setCurrentSongRestTime();
        setCurrentSongMaxTime();
        setCurrentRefAudio.current = new Audio(
          currentPlaylist[indexUpdated].src
        );
        setCurrentRefAudio.current.play();
      }
      if (
        !setCurrentRefAudio.current.paused &&
        currentPlaylist.indexOf(currentSong) === currentIndex
      ) {
        currentAudio.pause();
      }
      if (
        // !setCurrentRefAudio.current.paused &&
        // currentPlaylist.indexOf(currentSong) > currentIndex - 1
        true
      ) {
        setIndex(index + 1);
        setCurrentForwardIndex.current = index;
        const indexUpdated = currentIndex + 1;
        // setCurrentRange(0);
        // setRestTime("00:00");
        setCurrentSong(currentPlaylist[indexUpdated]);
        setCurrentAudio(new Audio(currentSong.src));
        // setCurrentSongTotalTime();
        // setCurrentSongRestTime();
        // setCurrentSongMaxTime();
        setCurrentRefAudio.current = new Audio(
          currentPlaylist[indexUpdated].src
        );
        setCurrentSongIndex.current = currentPlaylist[indexUpdated];

        console.log("song index in", setCurrentSongIndex.current);
        console.log("ref index in", setCurrentForwardIndex.current);
        console.log("index in", indexUpdated);
      }
    }
  };

  const handleSuffleClick = () => {
    setSuffle(!isSuffle);
  };

  const handleRepeatClick = () => {
    setRepeat(isRepeat === "1" ? "2" : isRepeat === "2" ? "3" : "1");
  };

  const handleLikedClick = () => {
    setLiked(!isLiked);
  };

  const handleDislikedClick = () => {
    setDisliked(!isDisliked);
  };

  return (
    <section className="background bg-orange-200 h-screen w-screen flex justify-center items-center relative m-0">
      <div className="media-player h-[350px] w-[700px] bg-zinc-900 flex justify-evenly items-center relative  m-0 py-[20px] px-[0px] rounded-[20px] drop-shadow-[0px_0px_15px_rgba(0,0,0,.5)]">
        <div className="song-cover-img w-[40%] object-cover bg-zinc-600 m-0 rounded-[20px] overflow-hidden">
          <img src={currentSong.cover} alt="song-cover" />
        </div>
        <div className="song-content  w-[50%] h-[100%] m-0 flex justify-center items-center flex-col">
          <div className="song-copy m-0  h-[80%] w-[100%]">
            <button className="song-copy h-min w-min ml-auto flex">
              <i className="fa-solid fa-music my-[10px] mx-[10px] text-[30px] hover:scale-105"></i>
            </button>
            <h2 className="text-[30px] font-bold mt-[20px] px-[20px]">
              {currentSong.song}
            </h2>
            <h3 className="text-[18px] italic px-[20px]">
              {currentSong.artist}
            </h3>
            <div className="like-buttons w-[100%] flex gap-[20px] mt-[20px] px-[20px]">
              <button className="h-min w-min" onClick={handleDislikedClick}>
                {isDisliked === false ? (
                  <i className="fa-regular fa-thumbs-down text-[20px] hover:scale-105"></i>
                ) : (
                  <i className="fa-solid fa-thumbs-down text-[20px] hover:scale-105"></i>
                )}
              </button>
              <button className="h-min w-min " onClick={handleLikedClick}>
                {isLiked === false ? (
                  <i className="fa-regular fa-thumbs-up  text-[20px] hover:scale-105"></i>
                ) : (
                  <i className="fa-solid fa-thumbs-up text-[20px] hover:scale-105"></i>
                )}
              </button>
            </div>
          </div>
          <div className="song-range w-[85%]  h-[auto] flex flex-col justify-center items-center ">
            <input
              type="range"
              className=" w-full h-0.5 bg-grey rounded outline-none accent-white"
              min={0}
              max={maxRangeNumber}
              value={currentRangeNumber}
              onChange={handleInputRange}
            ></input>
            <div className="w-[100%] flex mt-[10px]">
              <span className=" text-[10px] w-[min] flex  mr-[auto] ">
                {restTimeString}
              </span>
              <span className=" text-[10px]  w-[min] flex ml-[auto] ">
                {totalTimeString}
              </span>
            </div>
          </div>
          <div className="song-buttons-actions m-0 h-[20%] w-[100%] flex justify-center items-center gap-[40px]">
            <button onClick={handleSuffleClick}>
              {isSuffle === false ? (
                <img
                  src="../ASSETS/shuffle-icon.png"
                  alt="suffle-icon"
                  className="h-[20px] object-cover invert hover:scale-105 opacity-50"
                ></img>
              ) : (
                <img
                  src="../ASSETS/shuffle-icon.png"
                  alt="suffle-icon"
                  className="h-[20px] object-cover invert hover:scale-105"
                ></img>
              )}
            </button>
            <button>
              <img
                src="../ASSETS/backward-icon.png"
                alt="backward-icon"
                className="h-[20px] object-cover invert hover:scale-105"
              ></img>
            </button>
            <button onClick={handlePlayClick}>
              {isPlaying === false ? (
                <img
                  src="../ASSETS/play-icon.png"
                  alt="play-icon"
                  className="h-[25px] object-cover invert hover:scale-105"
                ></img>
              ) : (
                <img
                  src="../ASSETS/pause-icon.png"
                  alt="pause-icon"
                  className="h-[25px] object-cover invert hover:scale-105"
                ></img>
              )}
            </button>
            <button>
              <img
                src="../ASSETS/forward-icon.png"
                alt="forward-icon"
                className="h-[20px] object-cover invert hover:scale-105"
                onClick={handleForwardClick}
              ></img>
            </button>
            <button onClick={handleRepeatClick}>
              {isRepeat === "1" ? (
                <img
                  src="../ASSETS/repeat-icon.png"
                  alt="repeat-icon"
                  className="h-[20px] object-cover invert hover:scale-105 opacity-50"
                ></img>
              ) : isRepeat === "2" ? (
                <img
                  src="../ASSETS/repeat-icon.png"
                  alt="repeat-icon"
                  className="h-[20px] object-cover invert hover:scale-105"
                ></img>
              ) : isRepeat === "3" ? (
                <img
                  src="../ASSETS/repeat-1-icon.png"
                  alt="repeat-1-icon"
                  className="h-[20px] object-cover invert hover:scale-105"
                ></img>
              ) : (
                <img
                  src="../ASSETS/repeat-icon.png"
                  alt="repeat-icon"
                  className="h-[20px] object-cover invert hover:scale-105 opacity-50"
                ></img>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;
