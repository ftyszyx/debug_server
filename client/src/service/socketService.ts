import { io } from "socket.io-client";
import { GetToken } from "@/util/tools";
import { SOCKET_IO_URL } from "@/config";

class SocketService {
  isconnected = false;
  private readonly socket = io(SOCKET_IO_URL, {
    autoConnect: false,
  });

  connectWithAuthToken() {
    const token = GetToken();
    console.log("connect socket io with", SOCKET_IO_URL, token);
    this.socket.auth = { token };
    this.socket.connect();
    this.socket.on("connect", () => {
      this.isconnected = true;
      console.log("socket connected");
    });
    this.socket.on("disconnect", () => {
      this.isconnected = false;
      console.log("socket disconnected");
    });
  }

  disconnect() {
    this.socket.disconnect();
  }

  sendMessage(message_type: string, data: any) {
    console.log("send data", data);
    this.socket.emit(message_type, data);
  }

  subscribeToMessages(message_type: string) {
    this.socket.on(message_type, (value) => {
      console.log("get message", message_type, value);
    });
  }
}

export const socketService = new SocketService();
