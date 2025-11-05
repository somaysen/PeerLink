import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import VideoView from "./VideoView";
import CallControls from "./CallController";

export default function VideoCall() {
  const [peerId, setPeerId] = useState("");
  const [friendId, setFriendId] = useState("");
  const [currentCall, setCurrentCall] = useState(null);
  const [inCall, setInCall] = useState(false);
  const [isDark, setIsDark] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [copied, setCopied] = useState(false);

  const myVideoRef = useRef(null);
  const partnerVideoRef = useRef(null);
  const peerRef = useRef(null);
  const streamRef = useRef(null);

  // Detect theme changes dynamically
  useEffect(() => {
    const listener = (e) => setIsDark(e.matches);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  // ✅ Initialize Peer only once
  useEffect(() => {
    const peer = new Peer();
    peerRef.current = peer;

    peer.on("open", (id) => setPeerId(id));

    // When incoming call
    peer.on("call", async (incomingCall) => {
      const stream = await startMedia(); // start camera when incoming call
      incomingCall.answer(stream);

      incomingCall.on("stream", (remoteStream) => {
        partnerVideoRef.current.srcObject = remoteStream;
      });

      incomingCall.on("close", stopMedia);

      setCurrentCall(incomingCall);
      setInCall(true);
    });

    return () => peer.destroy();
  }, []);

  // 🎥 Start Camera & Mic only when needed
  async function startMedia() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    streamRef.current = stream;
    if (myVideoRef.current) myVideoRef.current.srcObject = stream;
    return stream;
  }

  // 📴 Stop camera & mic when call ends
  function stopMedia() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (myVideoRef.current) myVideoRef.current.srcObject = null;
    if (partnerVideoRef.current) partnerVideoRef.current.srcObject = null;
    setInCall(false);
  }

  // 📞 Start a call
  const handleCall = async () => {
    const stream = await startMedia();
    const call = peerRef.current.call(friendId, stream);

    call.on("stream", (remoteStream) => {
      partnerVideoRef.current.srcObject = remoteStream;
    });

    call.on("close", stopMedia);

    setCurrentCall(call);
    setInCall(true);
  };

  // ❌ End call
  const handleEndCall = () => {
    if (currentCall) {
      currentCall.close();
      stopMedia();
      setCurrentCall(null);
    }
  };

  // 📋 Copy Peer ID
  const handleCopy = () => {
    if (!peerId) return;
    navigator.clipboard.writeText(peerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex flex-col items-center p-6 min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-2xl font-bold mb-4">🎥 P2P Video Call</h1>

      <div
        className={`mb-4 p-4 rounded-xl shadow-md flex flex-col items-center gap-2 ${
          isDark ? "bg-gray-800" : "bg-white border border-gray-300"
        }`}
      >
        <p>Your ID:</p>
        <div className="flex items-center gap-2">
          <p
            className={`font-mono text-sm px-2 py-1 rounded-md ${
              isDark ? "text-green-400 bg-gray-700" : "text-green-700 bg-gray-100"
            }`}
          >
            {peerId || "Loading..."}
          </p>
          <button
            onClick={handleCopy}
            className={`px-3 py-1 rounded-md text-sm transition-all duration-200 ${
              copied
                ? "bg-green-500 text-white"
                : isDark
                ? "bg-gray-700 hover:bg-gray-600 text-green-300"
                : "bg-gray-200 hover:bg-gray-300 text-green-700"
            }`}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Enter Friend ID"
        className={`px-4 py-2 mb-4 rounded-md w-64 border outline-none transition-colors duration-200 ${
          isDark
            ? "bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-green-400"
            : "bg-white text-black border-gray-300 focus:ring-2 focus:ring-green-600"
        }`}
        value={friendId}
        onChange={(e) => setFriendId(e.target.value)}
      />

      <CallControls inCall={inCall} onCall={handleCall} onEndCall={handleEndCall} />

      <div className="flex gap-6 mt-6 flex-wrap justify-center">
        <VideoView ref={myVideoRef} muted label="You" />
        <VideoView ref={partnerVideoRef} label="Friend" />
      </div>
    </div>
  );
}
