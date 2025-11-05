import { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';

export default function ChatComponent() {
  const [myId, setMyId] = useState('');
  const [friendId, setFriendId] = useState('');
  const [messageBox, setMessageBox] = useState('');
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [copied, setCopied] = useState(false);
  // Theme state to avoid undefined `isDark` usage in JSX
  const [isDark, setIsDark] = useState(() => {
    try {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      return false;
    }
  });

  const peerRef = useRef(null);
  const connectionRef = useRef(null);

  useEffect(() => {
    const peer = new Peer();
    peerRef.current = peer;

    peer.on('open', (id) => {
      setMyId(id);
    });

    peer.on('error', (err) => {
      console.error('Peer error:', err);
    });

    // Receiver side
    peer.on('connection', (conn) => {
      connectionRef.current = conn;
      setConnected(true);
      conn.on('data', (data) => {
        setMessages((prev) => [...prev, { text: data, sender: 'Friend' }]);
      });
    });

    return () => {
      peer.destroy();
    };
  }, []);

  const connectBtn = () => {
    if (!peerRef.current) return;
    if (!friendId || !friendId.trim()) return;

    const connection = peerRef.current.connect(friendId.trim());
    connectionRef.current = connection;

    connection.on('open', () => {
      setConnected(true);
    });

    connection.on('data', (data) => {
      setMessages((prev) => [...prev, { text: data, sender: 'Friend' }]);
    });
    connection.on('error', (err) => {
      console.error('Connection error:', err);
    });
  };

  const sendBtn = () => {
    if (connectionRef.current && messageBox.trim()) {
      connectionRef.current.send(messageBox);
      setMessages((prev) => [...prev, { text: messageBox, sender: 'You' }]);
      setMessageBox('');
    }
  };

  // Copy ID to clipboard
  const handleCopy = async () => {
    if (myId) {
      await navigator.clipboard.writeText(myId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    
     <div className={`flex flex-col items-center p-6 min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`} >
        <div className="flex justify-center items-center min-h-screen bg-gradient-to from-indigo-500 via-purple-500 to-pink-500 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="bg-indigo-600 text-white p-4 text-center relative">
              <h1 className="text-2xl font-semibold">PeerJS Chat</h1>

              <div className="flex items-center justify-center mt-2">
                <p className="text-sm opacity-90 truncate max-w-[200px]">{myId || 'Generating ID...'}</p>
                {myId && (
                  <button
                    onClick={handleCopy}
                    className="ml-2 bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-md text-xs"
                  >
                    Copy
                  </button>
                )}
                {/* Theme toggle - keeps `isDark` defined and usable in the top-level className */}
                <button
                  onClick={() => setIsDark((v) => !v)}
                  className="ml-2 bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-md text-xs"
                  aria-pressed={isDark}
                  aria-label="Toggle theme"
                >
                  {isDark ? 'Light' : 'Dark'}
                </button>
              </div>

              {copied && (
                <p className="absolute right-3 top-3 bg-green-500 text-white text-xs px-2 py-1 rounded-md animate-fadeIn">
                  Copied!
                </p>
              )}
            </div>

            {/* Body */}
            <div className="p-4">
              {!connected ? (
                <>
                  <input
                    type="text"
                    placeholder="Enter your friend's ID"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 text-black focus:ring-indigo-400 outline-none mb-3"
                    value={friendId}
                    onChange={(e) => setFriendId(e.target.value)}
                  />
                  <button
                    onClick={connectBtn}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-all"
                  >
                    Connect to Friend
                  </button>
                </>
              ) : (
                <>
                  <div className="h-80 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                    {messages.length === 0 ? (
                      <p className="text-gray-400 text-center mt-10">No messages yet...</p>
                    ) : (
                      messages.map((msg, i) => (
                        <div
                          key={i}
                          className={`my-2 flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] px-3 py-2 rounded-xl text-sm ${
                              msg.sender === 'You'
                                ? 'bg-indigo-500 text-black rounded-br-none'
                                : 'bg-gray-200 text-gray-900 rounded-bl-none'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex mt-4 gap-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-auto border text-zinc-700 border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                      value={messageBox}
                      onChange={(e) => setMessageBox(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendBtn()}
                    />
                    <button
                      onClick={sendBtn}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 rounded-lg transition-all"
                    >
                      Send
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
    </div>
  );
}
