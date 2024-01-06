import { useRouterStore } from "kl_router";
import ChatSideBar from "@/components/chat/chat_sidebar";
import ChatHedaer from "@/components/chat/chat_header";
import ChatView from "@/components/chat/chat_view";
import ChatInput from "@/components/chat/chat_input";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { MenuParamNull } from "@/config";
import { ChatLogStoreType, TerminalInfo, TerminalStoreType, UseUserStore, useChatStore, useTerminalStore } from "@/models";
import { SocketIOServiceStore, useSocketIOStore } from "@/models/socket_io.store";
import { UserStore } from "@/entity/user.entity";
import { ChatRoom } from "@/entity/chat_room.entity";
import { MyFetchPost } from "@/util/fetch";
import { ApiPath } from "@/entity/api_path";
import { SocketIoMessageType, WebClientReq, WebClientResp } from "@/entity/socketio.entity";
import { DebugClient } from "@/entity/debug_client.entity";
import { IdReq } from "@/entity/api.entity";

interface TerminalStateInfo {
  room?: ChatRoom;
}
export default function DebugTerminal() {
  const socketStore = useSocketIOStore() as SocketIOServiceStore;
  const userstore = UseUserStore() as UserStore;
  const logStore = useChatStore() as ChatLogStoreType;
  const route_data = useRouterStore();
  const client_id = route_data.match?.params["id"];
  const [loading, setLoading] = useState(false);
  const [roominfo, setRoominfo] = useState<ChatRoom>();
  const [clientInfo, setClientInfo] = useState<DebugClient>();
  const stateInfoRef = useRef<TerminalStateInfo>({ room: roominfo });
  const terminalStore_add = useTerminalStore((state) => state!.addItem) as TerminalStoreType["addItem"];
  // console.log("render terminal target_client", client_id, "loading", loading, "roominfo", roominfo);
  useEffect(() => {
    socketStore.connect();
    return () => {
      socketStore.disconnect();
    };
  }, []);
  useEffect(() => {
    stateInfoRef.current.room = roominfo;
  }, [roominfo]);
  const onJoinOk = useCallback((data: ChatRoom) => {
    console.log("join ok", data);
    setRoominfo(data);
    const terminal_info: TerminalInfo = { room: data };
    terminalStore_add(terminal_info);
  }, []);
  const onGetMessage = useCallback((data: WebClientResp) => {
    console.log("on get message", data, roominfo);
    if (stateInfoRef.current.room) {
      logStore.getMore(stateInfoRef.current.room.id, true);
    }
  }, []);
  useEffect(() => {
    socketStore.addListener(SocketIoMessageType.Join_room_resp, onJoinOk);
    socketStore.addListener(SocketIoMessageType.Debug_cmd_rep, onGetMessage);
    return () => {
      socketStore.removeListener(SocketIoMessageType.Debug_cmd_rep, onJoinOk);
      socketStore.removeListener(SocketIoMessageType.Debug_cmd_rep, onGetMessage);
    };
  }, []);

  useEffect(() => {
    if (client_id && client_id != MenuParamNull && socketStore.isConnected) {
      getRoomInfo(client_id);
    } else {
      setRoominfo(undefined);
    }
  }, [client_id, socketStore.isConnected]);

  async function getRoomInfo(guid: string) {
    try {
      console.log("join room", guid);
      setLoading(true);
      const guid_num = parseInt(guid);
      const client_res = await MyFetchPost<DebugClient, IdReq>(ApiPath.getDebugClientById, { id: guid_num });
      setClientInfo(client_res);
      socketStore.joinRoom({ guid: client_res.guid, nick: client_res.name });
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex bg-gray-100 text-base w-full h-full">
      <ChatSideBar cur_clientInfo={clientInfo} cur_room={roominfo}></ChatSideBar>
      <div className="flex w-full flex-grow flex-col items-stretch">
        <ChatHedaer client={roominfo}></ChatHedaer>
        <ChatView client={roominfo} inputOffset={16}></ChatView>
        <ChatInput
          onSendMessage={(data) => {
            if (roominfo) {
              const user_id = userstore.user_base!.id;
              let guid = "";
              for (let i = 0; i < roominfo.users.length; i++) {
                const id = roominfo.users[i];
                if (id != user_id.toString()) {
                  guid = id;
                  break;
                }
              }
              let req_data: WebClientReq = Object.assign(data, {
                room_id: roominfo?.id,
                client_guid: guid,
              });
              socketStore.sendMessage(SocketIoMessageType.Debug_cmd_req, req_data);
            }
          }}
          disabled={roominfo == undefined || loading || socketStore.isConnected == false}
        ></ChatInput>
      </div>
    </div>
  );
}
