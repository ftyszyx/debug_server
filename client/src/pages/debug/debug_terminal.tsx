import { useRouterStore } from "kl_router";
import ChatSideBar from "@/components/chat/chat_sidebar";
import ChatHedaer from "@/components/chat/chat_header";
import ChatView from "@/components/chat/chat_view";
import ChatInput from "@/components/chat/chat_input";
export default function DebugTerminal() {
  const route_data = useRouterStore();
  const chat_id = route_data.match?.params["id"];
  console.log("chat_id", chat_id);
  return (
    <div className="flex bg-dark text-gray-100">
      <ChatSideBar></ChatSideBar>
      <div className="flex h-screen flex-grow flex-col items-stretch">
        <ChatHedaer></ChatHedaer>
        <ChatView></ChatView>
        <ChatInput></ChatInput>
      </div>
    </div>
  );
}
