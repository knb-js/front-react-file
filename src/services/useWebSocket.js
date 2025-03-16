import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export const useWebSocket = () => {
  const [status, setStatus] = useState('Desconectado');
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    // Agregar polyfill para global si no está definido
    if (typeof global === 'undefined') {
      var global = window;
    }
    
    // Crear la conexión WebSocket
    const socket = new SockJS('http://localhost:8080/file-processor');
    const client = Stomp.over(socket);

    client.connect({}, (frame) => {
      setStatus('Conectado');
      console.log('Conectado: ' + frame);
    });

    setStompClient(client);

    return () => {
      if (client) {
        client.disconnect(() => {
          setStatus('Desconectado');
        });
      }
    };
  }, []);

  const sendMessage = (message) => {
    if (stompClient) {
      stompClient.send('/app/processFile', {}, JSON.stringify({ message }));
    }
  };

  return { status, sendMessage };
};
