import { io } from "socket.io-client";
const URL = import.meta.env.SOCKET_URL;
console.log("url", URL);
export const socket = io(URL, {
  autoConnect: false,
});
