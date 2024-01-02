import { useRouterStore } from "kl_router";
import ChatSideBar from "@/components/chat/chat_sidebar";
import ChatHedaer from "@/components/chat/chat_header";
import ChatView from "@/components/chat/chat_view";
import ChatInput from "@/components/chat/chat_input";
import { useEffect, useState } from "react";
import { MenuParamNull } from "@/config";
import { ChatLogStoreType, TerminalInfo, TerminalStoreType, UseUserStore, useChatStore, useTerminalStore } from "@/models";
import { socketService } from "@/service/socketService";
import { UserStore } from "@/entity/user.entity";
import { ChatRoom, GetChatRoomReq } from "@/entity/chat_room.entity";
import { MyFetchPost } from "@/util/fetch";
import { ApiPath } from "@/entity/api_path";
import { SocketIoMessageType, WebClientReq, WebClientResp } from "@/entity/socketio.entity";
import { DebugClient } from "@/entity/debug_client.entity";
import { IdReq, IdsReq } from "@/entity/api.entity";
export default function DebugTerminal() {
  const userstore = UseUserStore() as UserStore;
  const logStore = useChatStore() as ChatLogStoreType;
  const route_data = useRouterStore();
  const client_id = route_data.match?.params["id"];
  const [loading, setLoading] = useState(false);
  const [roominfo, setRoominfo] = useState<ChatRoom>();
  const [clientInfo, setClientInfo] = useState<DebugClient>();
  const terminalStore = useTerminalStore() as TerminalStoreType;
  console.log("roomid", client_id);
  useEffect(() => {
    socketService.connectWithAuthToken();
    return () => {
      socketService.disconnect();
    };
  }, []);
  function onJoinOk(data: ChatRoom) {
    console.log("get join resp", data);
    if (clientInfo != null) {
      if (data.users.indexOf(clientInfo.guid) >= 0) {
        console.log("get room", data);
        setRoominfo(data);
      }
    }
    const terminal_info: TerminalInfo = { room: data };
    terminalStore.addItem(terminal_info);
  }
  useEffect(() => {
    socketService.addListener(SocketIoMessageType.Join_room_resp, onJoinOk);
    socketService.addListener(SocketIoMessageType.Debug_cmd_rep, onGetMessage);
    return () => {
      socketService.removeListener(SocketIoMessageType.Debug_cmd_rep, onJoinOk);
      socketService.removeListener(SocketIoMessageType.Debug_cmd_rep, onGetMessage);
    };
  });
  useEffect(() => {
    if (client_id && client_id != MenuParamNull && socketService.isconnected) {
      getRoomInfo(client_id);
    }
  }, [client_id, socketService.isconnected]);
  useEffect(() => {
    setLoading(socketService.isconnected == false);
  }, [socketService.isconnected]);
  async function getRoomInfo(guid: string) {
    try {
      setLoading(true);
      const guid_num = parseInt(guid);
      const client_res = await MyFetchPost<DebugClient, IdReq>(ApiPath.getDebugClientById, { id: guid_num });
      setClientInfo(client_res);
      socketService.joinRoom({ guid: client_res.guid });
    } finally {
      setLoading(false);
    }
  }
  function onGetMessage(data: WebClientResp) {
    console.log("get data", data);
    if (roominfo) {
      logStore.getMore(roominfo.id, true);
    }
  }
  return (
    <div className="flex bg-dark text-gray-100">
      <ChatSideBar></ChatSideBar>
      <div className="flex h-screen flex-grow flex-col items-stretch">
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
              socketService.sendMessage(SocketIoMessageType.Debug_cmd_req, req_data);
            }
          }}
          disabled={roominfo != null && roominfo != undefined && loading == false}
        ></ChatInput>
      </div>
    </div>
  );
}
