import { useRouterStore } from "kl_router";
import ChatSideBar from "@/components/chat/chat_sidebar";
import ChatHedaer from "@/components/chat/chat_header";
import ChatView from "@/components/chat/chat_view";
import { socket } from "@/util/socket";
import ChatInput from "@/components/chat/chat_input";
import { useEffect, useMemo, useState } from "react";
import { MenuParamNull, SOCKETIO_DEBUGCMD_REQ, SOCKETIO_DEBUGCMD_RESP, SocketIO_Debug_cmd } from "@/config";
import { ChatLogStoreType, ClientStore, UseUserStore, useChatStore, useDebugClientStore } from "@/models";
import { socketService } from "@/service/socketService";
import { WebClientReq } from "@/entity/chat_log.entity";
import { UserStore } from "@/entity/user.entity";
export default function DebugTerminal() {
  const userstore = UseUserStore() as UserStore;
  const route_data = useRouterStore();
  const client_store = useDebugClientStore() as ClientStore;
  const ChatLog_store = useChatStore() as ChatLogStoreType;
  const chat_id = route_data.match?.params["id"];
  const [loading, setLoading] = useState(false);
  console.log("chat_id", chat_id);
  useEffect(() => {
    client_store.FetchAll();
  }, []);
  useEffect(() => {
    socketService.connectWithAuthToken();
    socketService.subscribeToMessages(SOCKETIO_DEBUGCMD_RESP);
    return () => {
      socketService.disconnect();
    };
  }, []);
  useEffect(() => {
    setLoading(socketService.isconnected == false);
  }, [socketService.isconnected]);
  const SendMessage = (text: string) => {
    // setLoading(true);
    // socket.timeout(5000).emit(SocketIO_Debug_cmd, text, () => {
    //   // if (cur_client_info) {
    //   //   ChatLog_store.getMore(cur_client_info?.guid, true);
    //   // }
    //   setLoading(false);
    // });
  };
  const cur_client_info = useMemo(() => {
    if (chat_id == MenuParamNull) return;
    return client_store.items.find((x) => x.id.toString() == chat_id);
  }, [chat_id, client_store]);
  return (
    <div className="flex bg-dark text-gray-100">
      <ChatSideBar></ChatSideBar>
      <div className="flex h-screen flex-grow flex-col items-stretch">
        <ChatHedaer client={cur_client_info}></ChatHedaer>
        <ChatView client={cur_client_info} inputOffset={16}></ChatView>
        <ChatInput
          onSendMessage={(data) => {
            if (cur_client_info) {
              let req_data: WebClientReq = Object.assign(data, {
                client_guid: cur_client_info?.guid,
                from_user_id: userstore.user_base!.id,
              });
              socketService.sendMessage(SOCKETIO_DEBUGCMD_REQ, req_data);
            }
          }}
          disabled={loading}
        ></ChatInput>
      </div>
    </div>
  );
}
