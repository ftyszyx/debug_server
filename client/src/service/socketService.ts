import { io, Socket } from "socket.io-client";

import { AddMessageDto } from "../models/message";

class SocketService {
  private readonly socket = io(process.env.SOCKET_URL, {
    autoConnect: false,
  });

  connectWithAuthToken(token: string) {
    this.socket.auth = { token };
    this.socket.connect();
    this.socket.on("connect", () => {
      console.log("socket on connected");
    });
    this.socket.on("disconnect", () => {
      console.log("socket on disconnected");
    });
  }

  disconnect() {
    this.socket.disconnect();
  }

  sendMessage(data: AddMessageDto) {
    this.socket.emit("message", data);
  }

  subscribeToMessages(message_type: string) {
    this.socket.on(message_type, (value) => {
      console.log("get message", message_type,value);
    });
  }
}

export const socketService = new SocketService();
