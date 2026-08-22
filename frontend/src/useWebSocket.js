import { useState, useEffect, useRef, useCallback } from 'react';

export function useWebSocket(url = 'ws://localhost:8000/ws/realtime/') {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [latestEvent, setLatestEvent] = useState(null);
  const wsRef = useRef(null);

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        setIsConnected(true);
        console.log('✅ WebSocket Connected to Django Channels:', url);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const timestamp = new Date().toLocaleTimeString();
          const eventItem = { ...data, timestamp, id: Date.now() + Math.random() };

          setLatestEvent(eventItem);
          setMessages((prev) => [eventItem, ...prev.slice(0, 49)]); // Keep last 50 events
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log('⚠️ WebSocket Disconnected. Reconnecting in 3s...');
        setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = (err) => {
        console.error('WebSocket Error:', err);
      };

      wsRef.current = ws;
    } catch (e) {
      console.error('WebSocket init error:', e);
    }
  }, [url]);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const sendPayload = (action, data = {}) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action, ...data, timestamp: new Date().toISOString() }));
    }
  };

  return { isConnected, messages, latestEvent, sendPayload };
}
