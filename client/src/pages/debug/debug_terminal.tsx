import { useRouterStore } from "kl_router";
import ChatSideBar from "@/components/chat/chat_sidebar";
import ChatHedaer from "@/components/chat/chat_header";
import ChatView from "@/components/chat/chat_view";
import ChatInput from "@/components/chat/chat_input";
import { useEffect, useMemo } from "react";
import { MenuParamNull } from "@/config";
import { ClientStore, useDebugClientStore } from "@/models";
export default function DebugTerminal() {
  const route_data = useRouterStore();
  const client_store = useDebugClientStore() as ClientStore;
  const chat_id = route_data.match?.params["id"];
  console.log("chat_id", chat_id);
  useEffect(() => {
    client_store.FetchAll();
  }, []);
  const cur_client_info = useMemo(() => {
    if (chat_id == MenuParamNull) return;
    return client_store.items.find((x) => x.id.toString() == chat_id);
  }, [chat_id, client_store]);
  return (
    <div className="flex bg-dark text-gray-100">
      <ChatSideBar></ChatSideBar>
      <div className="flex h-screen flex-grow flex-col items-stretch">
        <ChatHedaer client={cur_client_info}></ChatHedaer>
        <ChatView></ChatView>
        <ChatInput></ChatInput>
      </div>
    </div>
  );
}
