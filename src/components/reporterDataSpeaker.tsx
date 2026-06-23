
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import StopIcon from "@mui/icons-material/Stop";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useEffect, useState } from "react";

const ReporterDataSpeaker = ({ newsItems }: any) => {
    const [isPaused, setIsPaused] = useState(false);
    const [isReading, setIsReading] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [loading, setLoading] = useState(true);
    const [voice, setVoice] = useState(null);
    const [tamilVoice, setTamilVoice] = useState(null);
    const [hindiVoice, setHindiVoice] = useState(null);
    const [languageCode, setLanguageCode] = useState("en");

    useEffect(() => {
        const path = window.location.pathname;
        const segments = path.split("/").filter((segment) => segment.trim() !== ""); // Split path and remove empty segments
        let detectedLanguageCode = "en"; // Default language code
        if (segments.length >= 2) {
            detectedLanguageCode = segments[0]; // Assuming language code is the first segment (/en/politics)
        }
        setLanguageCode(detectedLanguageCode);
        const handleVoicesChanged = () => {
            const voices = window.speechSynthesis.getVoices();
            const femaleVoice: any = voices.find(voice => voice.name.includes('Google US English') || voice.name.includes('Microsoft David - English (United States)')) || null;
            setVoice(femaleVoice);
            const tamil: any = voices.find(voice => voice.lang === 'ta-IN') || null;
            setTamilVoice(tamil);
            const hindi: any = voices.find(voice => voice.lang === 'hi-IN') || null;
            setHindiVoice(hindi);
        };
        handleVoicesChanged();
        window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
        return () => {
            window.speechSynthesis.cancel();
            window.speechSynthesis.onvoiceschanged = null; // Remove event listener on unmount
        };
    }, []);

    const stripHtmlTags = (html: any) => {
        return html.replace(/<[^>]*>/g, ''); // Removes all HTML tags
    };

    const handleReadAloud = () => {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            const speech = new SpeechSynthesisUtterance();
            const contentToRead = `${newsItems?.title || ''}. ${newsItems?.longcontent || ''}`;
            const plainText = stripHtmlTags(contentToRead);
            speech.text = plainText;
            if (languageCode === "ta") {
                speech.lang = "ta-IN"; // Tamil
                if (tamilVoice) {
                    speech.voice = tamilVoice;
                }
            } else if (languageCode === "hi") {
                speech.lang = "hi-IN"; // Hindi
                if (hindiVoice) {
                    speech.voice = hindiVoice;
                }
            } else {
                speech.lang = "en-US"; // Default to English
                if (voice) {
                    speech.voice = voice;
                }
            }
            speech.rate = 1; // Adjust speech rate as needed
            speech.pitch = 1; // Adjust pitch as needed
            speech.onstart = () => {
                setIsReading(true); // Set reading state
                setShowControls(true); // Show controls when reading starts
            };
            speech.onend = () => {
                setIsReading(false); // Reset reading state
                setShowControls(false); // Hide controls when reading ends
            };
            window.speechSynthesis.speak(speech);
        } else {
            console.error("Sorry, your browser does not support text-to-speech.");
        }
    };


    const stopReading = () => {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            setIsReading(false);
            setIsPaused(false);
            setShowControls(false);
        }
    };

    const pauseReading = () => {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.pause();
            setIsPaused(true);
        }
    };

    const resumeReading = () => {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.resume();
            setIsPaused(false);
        }
    };

    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const newsDate = new Date(newsItems?.newsdatetime);
    const monthName = monthNames[newsDate.getMonth()];
    return (
        <ul className="authar-info d-flex flex-wrap">
            {newsItems?.reporter && (
                <>
                    <li className='author-name' style={{ fontSize: '11px', color: "black" }}>{newsItems?.reporter}</li>

                    <li style={{ fontSize: '11px', color: "black", padding: '0px 0px' }}>|</li>
                </>
            )}

            <li
                className="date"
                style={{ fontSize: "11px", color: "black" }}
            >
                {newsItems?.newsdatetime && (
                    <>
                        {`${(
                            "0" + new Date(newsItems.newsdatetime).getDate()
                        ).slice(-2)} ${monthName} ${new Date(
                            newsItems.newsdatetime
                        ).getFullYear()}  ${(
                            "0" +
                            new Date(newsItems.newsdatetime).getHours()
                        ).slice(-2)}:${(
                            "0" +
                            new Date(newsItems.newsdatetime).getMinutes()
                        ).slice(-2)}`}
                    </>
                )}
            </li>

            {languageCode !== "ta" && (
                <>
                    <li
                        style={{
                            fontSize: "11px",
                            color: "black",
                            padding: "0px 0px",
                        }}
                    >
                        |
                    </li>
                    <li
                        className="d-flex align-items-center"
                        style={{
                            marginTop: "-5px",
                            fontSize: "15px",
                            padding: "0px",
                        }}
                    >
                        <button
                            onClick={() => {
                                handleReadAloud();
                                setIsReading(true);
                            }}
                            style={{
                                background: "none",
                                border: "none",
                                padding: "2",
                                cursor: "pointer",
                            }}
                        >
                            <VolumeUpIcon
                                style={{
                                    fontSize: "15px",
                                    color:
                                        window.matchMedia &&
                                            window.matchMedia(
                                                "(prefers-color-scheme: dark)"
                                            ).matches
                                            ? "black"
                                            : "black",
                                }}
                            />{" "}
                            {/* Speaker Icon */}
                        </button>
                        {showControls && (
                            <>
                                <button
                                    onClick={stopReading}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        padding: "2",
                                        cursor: "pointer",
                                    }}
                                >
                                    <StopIcon
                                        style={{
                                            fontSize: "15px",
                                            color:
                                                window.matchMedia &&
                                                    window.matchMedia(
                                                        "(prefers-color-scheme: dark)"
                                                    ).matches
                                                    ? "black"
                                                    : "black",
                                        }}
                                    />{" "}
                                    {/* Stop Icon */}
                                </button>
                                <button
                                    onClick={pauseReading}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        padding: "2",
                                        cursor: "pointer",
                                    }}
                                    disabled={isPaused}
                                >
                                    <PauseIcon
                                        style={{
                                            fontSize: "15px",
                                            color: isPaused
                                                ? "gray"
                                                : window.matchMedia &&
                                                    window.matchMedia(
                                                        "(prefers-color-scheme: dark)"
                                                    ).matches
                                                    ? "black"
                                                    : "black",
                                        }}
                                    />{" "}
                                    {/* Pause Icon */}
                                </button>
                                <button
                                    onClick={resumeReading}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        padding: "2",
                                        cursor: "pointer",
                                    }}
                                    disabled={!isPaused}
                                >
                                    <PlayArrowIcon
                                        style={{
                                            fontSize: "15px",
                                            color:
                                                window.matchMedia &&
                                                    window.matchMedia(
                                                        "(prefers-color-scheme: dark)"
                                                    ).matches
                                                    ? "black"
                                                    : "black",
                                        }}
                                    />{" "}
                                    {/* Play Icon */}
                                </button>
                            </>
                        )}
                    </li>
                </>
            )}
        </ul>
    )
}
export default ReporterDataSpeaker;