import { Socket, io } from "socket.io-client";
import { GetToken } from "@/util/tools";
import { SOCKET_IO_URL } from "@/config";
import { JoinRoomReq, SocketIoMessageType } from "@/entity/socketio.entity";
import { ChatRoom } from "@/entity/chat_room.entity";
import { create } from "kl_state";

export interface SocketIOServiceStore {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  socket: Socket;
  sendMessage: (message_type: string, data: any) => void;
  addListener: <T>(message_type: string, callback: (data: T) => void) => void;
  addOnceListener: <T>(message_type: string, callback: (data: T) => void) => void;
  removeListener: <T>(message_type: string, callback: (data: T) => void) => void;
  joinRoom: (req: JoinRoomReq, callback?: (data: ChatRoom) => void) => void;
  leaveRoom: (roomid: string) => void;
}
export const useSocketIOStore = create<SocketIOServiceStore>((set, get) => {
  let ret: SocketIOServiceStore = {
    isConnected: false,
    socket: io(SOCKET_IO_URL, {
      autoConnect: false,
    }),
    connect() {
      const token = GetToken();
      const info = get();
      console.log("connect socket io with", SOCKET_IO_URL, token);
      info.socket.auth = { token };
      info.socket.connect();
      info.socket.on("connect", () => {
        console.log("socket connected");
        set((state) => {
          return { ...state, isConnected: true };
        });
      });

      this.socket.on("disconnect", () => {
        set((state) => {
          return { ...state, isConnected: false };
        });
        console.log("socket disconnected");
      });
    },
    disconnect() {
      console.log("disconnect socket io");
      get().socket.disconnect();
    },

    sendMessage(message_type: string, data: any) {
      console.log("send data", data);
      get().socket.emit(message_type, data);
    },

    addListener<T>(message_type: string, callback: (data: T) => void) {
      get().socket.on(message_type, callback);
    },

    addOnceListener<T>(message_type: string, callback: (data: T) => void) {
      get().socket.once(message_type, callback);
    },

    removeListener<T>(message_type: string, callback: (data: T) => void) {
      get().socket.off(message_type, callback);
    },

    joinRoom(req: JoinRoomReq, callback?: (data: ChatRoom) => void) {
      console.log("send join room req", req);
      if (callback) get().socket.once(SocketIoMessageType.Join_room, callback);
      get().socket.emit(SocketIoMessageType.Join_room, req);
    },

    leaveRoom(roomid: string) {
      get().socket.emit(SocketIoMessageType.leave_room, roomid);
    },
  };
  return ret;
});
