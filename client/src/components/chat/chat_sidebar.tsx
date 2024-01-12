import { useHistory } from "kl_router";
import { Button } from "antd";
import { useEffect, useState } from "react";
import ChatSelectConversation from "./chat_select_conversation";
import { TerminalStoreType, useTerminalStore } from "@/models/terminal.store";
import ChatConversationMenuItem from "./chat_conversation_menuItem";
import { PagePath } from "@/entity/api_path";
import { ClientStore, useDebugClientStore } from "@/models";
import { DebugClient } from "@/entity/debug_client.entity";
import { ChatRoom } from "@/entity/chat_room.entity";
import { MenuParamNull } from "@/config";

interface ChatSideBarProps {
  cur_clientInfo?: DebugClient;
  cur_room?: ChatRoom;
}
export default function ChatSideBar(props: ChatSideBarProps) {
  const [showNewConversation, setShowNewConversation] = useState(false);
  const useTerminal = useTerminalStore() as TerminalStoreType;
  const clients_store = useDebugClientStore() as ClientStore;
  const history = useHistory();
  useEffect(() => {
    clients_store.FetchAll(true);
  }, []);
  useEffect(() => {
    if (props.cur_room == null) return;
    if (useTerminal.items.findIndex((x) => x.room.id == props.cur_room!.id) > 0) return;
    if (useTerminal.items.length > 0) {
      const useroom = useTerminal.items[0];
      const clientinfo = getClientInfo(useroom.room);
      if (clientinfo) {
        let goto_url = `${PagePath.DebugTerminal}/${clientinfo.id}`;
        history.push(goto_url);
      }
      return;
    }
    let goto_url = `${PagePath.DebugTerminal}/${MenuParamNull}`;
    // console.log("goto url2", goto_url);
    history.push(goto_url);
  }, [useTerminal.items]);

  function getClientInfo(room: ChatRoom) {
    return clients_store.items.find((x) => room.users.includes(x.guid));
  }
  return (
    <>
      <div className={`flex w-1/3 flex-col items-stretch border-r border-dark-lighten`}>
        <div className="flex  items-center justify-between border-b border-dark-lighten px-6 py-5">
          {/* <Link to={PagePath.DebugClients} className="flex items-center gap-1">
            <Icon className=" text-xl" type="icon-terminal"></Icon>
            <h1 className="text-xl">Cmd</h1>
          </Link> */}
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
        <div className=" h-full overflow-auto px-2 py-1">
          {props.cur_clientInfo &&
            useTerminal.items.map((item) => {
              return (
                <ChatConversationMenuItem
                  conversation={item}
                  cur_client={props.cur_clientInfo!}
                  my_client={getClientInfo(item.room)}
                  key={item.room.name}
                ></ChatConversationMenuItem>
              );
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
