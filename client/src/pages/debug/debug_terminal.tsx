import { useRouterStore } from "kl_router";
import ChatSideBar from "@/components/chat/chat_sidebar";
import ChatHedaer from "@/components/chat/chat_header";
import ChatView from "@/components/chat/chat_view";
import { socket } from "@/util/socket";
import ChatInput from "@/components/chat/chat_input";
import { useEffect, useMemo, useState } from "react";
import { MenuParamNull, SocketIO_Debug_cmd } from "@/config";
import { ChatLogStoreType, ClientStore, useChatStore, useDebugClientStore } from "@/models";
export default function DebugTerminal() {
  const route_data = useRouterStore();
  const client_store = useDebugClientStore() as ClientStore;
  const ChatLog_store = useChatStore() as ChatLogStoreType;
  const chat_id = route_data.match?.params["id"];
  const [isConnect, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log("chat_id", chat_id);
  useEffect(() => {
    client_store.FetchAll();
  }, []);
  useEffect(() => {
    setLoading(true);
    console.log("connect socket");
    function onConnect() {
      console.log("socket connet");
      setIsConnected(true);
      setLoading(false);
    }
    function onDisconnect() {
      console.log("socket disconnect");
      setIsConnected(false);
    }

    function onDebugMessage(value) {
      console.log("get msg", value);
      if (cur_client_info) {
        ChatLog_store.getMore(cur_client_info?.guid, true);
      }
    }
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(SocketIO_Debug_cmd, onDebugMessage);
    socket.connect();
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(SocketIO_Debug_cmd, onDebugMessage);
      socket.disconnect();
    };
  }, []);
  const SendMessage = (text: string) => {
    setLoading(true);
    socket.timeout(5000).emit(SocketIO_Debug_cmd, text, () => {
      if (cur_client_info) {
        ChatLog_store.getMore(cur_client_info?.guid, true);
      }
      setLoading(false);
    });
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
          onSendMessage={(text) => {
            SendMessage(text);
          }}
          disabled={loading}
        ></ChatInput>
      </div>
    </div>
  );
}
