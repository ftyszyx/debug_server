import { Link } from "kl_router";
import Icon from "../icon";
import { Button } from "antd";
import { useState } from "react";
import ChatSelectConversation from "./chat_select_conversation";
import { TerminalStoreType, useTerminalStore } from "@/models/terminal.store";
import ChatConversationMenuItem from "./chat_conversation_menuItem";
import { PagePath } from "@/entity/api_path";
export default function ChatSideBar() {
  const [showNewConversation, setShowNewConversation] = useState(false);
  const useTerminal = useTerminalStore() as TerminalStoreType;
  return (
    <>
      <div className={`border-dark-lighten h-screen flex-shrink-0 overflow-y-auto overflow-x-hidden border-r w-[350px]`}>
        <div className="border-dark-lighten flex h-20 items-center justify-between border-b px-6">
          <Link to={PagePath.DebugClients} className="flex items-center gap-1">
            <Icon className=" text-xl" type="icon-terminal"></Icon>
            <h1 className="text-xl">Cmd</h1>
          </Link>
          <div className="flex items-center gap-1">
            <Button
              type="primary"
              onClick={() => {
                setShowNewConversation(true);
              }}
            >
              添加对话
            </Button>
          </div>
        </div>
        <div>
          {useTerminal.items.map((item) => {
            return <ChatConversationMenuItem conversation={item} key={item.room.name}></ChatConversationMenuItem>;
          })}
        </div>
      </div>
      {showNewConversation && (
        <ChatSelectConversation
          onClose={() => {
            setShowNewConversation(false);
          }}
        ></ChatSelectConversation>
      )}
    </>
  );
}
