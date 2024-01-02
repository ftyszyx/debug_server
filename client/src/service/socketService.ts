import { io } from "socket.io-client";
import { GetToken } from "@/util/tools";
import { SOCKET_IO_URL } from "@/config";
import { JoinRoomReq, SocketIoMessageType } from "@/entity/socketio.entity";
import { ChatRoom } from "@/entity/chat_room.entity";

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

  addListener<T>(message_type: string, callback: (data: T) => void) {
    this.socket.on(message_type, callback);
  }

  addOnceListener<T>(message_type: string, callback: (data: T) => void) {
    this.socket.once(message_type, callback);
  }

  removeListener<T>(message_type: string, callback: (data: T) => void) {
    this.socket.off(message_type, callback);
  }

  joinRoom(req: JoinRoomReq, callback?: (data: ChatRoom) => void) {
    if (callback) this.socket.once(SocketIoMessageType.Join_room, callback);
    this.socket.emit(SocketIoMessageType.Join_room, req);
  }

  leaveRoom(roomid: string) {
    this.socket.emit(SocketIoMessageType.leave_room, roomid);
  }
}

export const socketService = new SocketService();
