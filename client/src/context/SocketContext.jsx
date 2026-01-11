import { createContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [activeTopic, setActiveTopic] = useState(null); // <--- NEW

  useEffect(() => {
    // Check your port! Mine is 5000.
    const newSocket = io("http://localhost:5000"); 
    setSocket(newSocket);

    // Listen for status object: { isLive: true, topic: "Arrays" }
    newSocket.on("session-status", (data) => {
      // Handle both old format (boolean) and new format (object)
      if (typeof data === 'boolean') {
          setIsLive(data);
      } else {
          setIsLive(data.isLive);
          setActiveTopic(data.topic); // <--- Save the topic
      }
    });

    return () => newSocket.close();
  }, []);

  return (
    // Expose activeTopic to the app
    <SocketContext.Provider value={{ socket, isLive, activeTopic }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;