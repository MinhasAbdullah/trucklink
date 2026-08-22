import React, { useState } from 'react';
import { Activity, Radio, Send, Terminal, Zap, ShieldCheck } from 'lucide-react';

export default function RealtimeConsole({ isConnected, messages, sendPayload }) {
  const [testMessage, setTestMessage] = useState('');
  const [senderName, setSenderName] = useState('Dispatcher Alpha');

  const handleSendTest = (e) => {
    e.preventDefault();
    if (!testMessage.trim()) return;
    sendPayload('broadcast_test', {
      sender: senderName,
      message: testMessage,
    });
    setTestMessage('');
  };

  const handlePing = () => {
    sendPayload('ping');
  };

  return (
    <div className="space-y-6">
      {/* Realtime Stream Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Django Channels ASGI WebSockets</span>
          </div>
          <h2 className="text-xl font-bold text-white">Live Real-time Event Feed</h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Bi-directional WebSockets (`ws://localhost:8000/ws/realtime/`). Broadcasts load updates, matches, and media uploads instantly.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-mono font-semibold ${
            isConnected 
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400' 
              : 'bg-rose-950/60 border-rose-500/40 text-rose-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`}></span>
            <span>{isConnected ? 'Channels Connected' : 'Disconnected'}</span>
          </div>

          <button
            onClick={handlePing}
            disabled={!isConnected}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors disabled:opacity-50"
          >
            Send WS Ping
          </button>
        </div>
      </div>

      {/* Test Message Broadcaster */}
      <form onSubmit={handleSendTest} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Sender (e.g., Driver #401)"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 md:w-48"
        />
        <input
          type="text"
          placeholder="Type message to broadcast to all connected WebSocket clients..."
          value={testMessage}
          onChange={(e) => setTestMessage(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          disabled={!isConnected || !testMessage.trim()}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Broadcast</span>
        </button>
      </form>

      {/* Terminal Live Stream Feed */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 text-slate-400">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-200">ws/realtime/ Event Log</span>
          </div>
          <span className="text-[10px] text-slate-500">{messages.length} events logged</span>
        </div>

        <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-2">
          {messages.length === 0 ? (
            <div className="py-8 text-center text-slate-600">
              Listening for events... Try posting a load, matching, or sending a test message.
            </div>
          ) : (
            messages.map((msg) => {
              const isMatchAccepted = msg.type === 'MATCH_ACCEPTED';
              const isNewLoad = msg.type === 'NEW_LOAD_POSTED';
              const isUpload = msg.type === 'FILE_UPLOADED_CLOUDINARY';

              const eventColor = isMatchAccepted 
                ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                : isNewLoad
                ? 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300'
                : isUpload
                ? 'border-amber-500/40 bg-amber-950/20 text-amber-300'
                : 'border-slate-800 bg-slate-900/60 text-slate-300';

              return (
                <div key={msg.id} className={`p-3 rounded-xl border ${eventColor} transition-all space-y-1`}>
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800">
                        {msg.type}
                      </span>
                      {isMatchAccepted && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <span className="text-slate-500 text-[10px]">{msg.timestamp}</span>
                  </div>

                  <pre className="text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap pt-1 font-mono">
                    {JSON.stringify(msg.payload || msg, null, 2)}
                  </pre>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
