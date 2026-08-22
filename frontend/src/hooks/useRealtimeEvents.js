import { useEffect, useMemo, useState } from "react";

const getRealtimeUrl = () => {
  const explicit = import.meta.env.VITE_WS_URL;
  if (explicit) return explicit;
  const backend = import.meta.env.VITE_BACKEND_URL;
  if (backend) {
    const url = new URL(backend);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    url.pathname = "/ws/realtime/";
    url.search = "";
    return url.toString();
  }
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/ws/realtime/`;
};

export const useRealtimeEvents = (enabled = true) => {
  const url = useMemo(getRealtimeUrl, []);
  const [status, setStatus] = useState("idle");
  const [lastEvent, setLastEvent] = useState(null);

  useEffect(() => {
    if (!enabled) return undefined;
    let socket;
    let cancelled = false;
    try {
      setStatus("connecting");
      socket = new WebSocket(url);
      socket.onopen = () => !cancelled && setStatus("connected");
      socket.onmessage = (event) => {
        if (cancelled) return;
        try { setLastEvent(JSON.parse(event.data)); } catch { setLastEvent({ type: "MESSAGE", payload: event.data }); }
      };
      socket.onerror = () => !cancelled && setStatus("error");
      socket.onclose = () => !cancelled && setStatus("disconnected");
    } catch {
      setStatus("error");
    }
    return () => { cancelled = true; socket?.close(); };
  }, [enabled, url]);

  return { status, lastEvent, url };
};
