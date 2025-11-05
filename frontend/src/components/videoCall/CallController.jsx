import React from "react";

export default function CallControls({ inCall, onCall, onEndCall }) {
  return (
    <div className="flex gap-4">
      {!inCall ? (
        <button
          onClick={onCall}
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          📞 Start Call
        </button>
      ) : (
        <button
          onClick={onEndCall}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          ❌ End Call
        </button>
      )}
    </div>
  );
}
