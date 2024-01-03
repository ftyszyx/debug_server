import { Link, useHistory } from "kl_router";
import Icon from "../icon";
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
  console.log("chat side bar change", useTerminal.items, props.cur_room);
  const clients_store = useDebugClientStore() as ClientStore;
  const history = useHistory();
  useEffect(() => {
    clients_store.FetchAll(true);
  }, []);
  useEffect(() => {
    console.log("chat side item change", useTerminal.items, props.cur_room);
    if (props.cur_room == null) return;
    if (useTerminal.items.findIndex((x) => x.room.id == props.cur_room!.id) > 0) return;
    if (useTerminal.items.length > 0) {
      const useroom = useTerminal.items[0];
      const clientinfo = getClientInfo(useroom.room);
      let goto_url = `${PagePath.DebugTerminal}/${clientinfo.id}`;
      history.push(goto_url);
      console.log("goto url1", goto_url);
      return;
    }
    let goto_url = `${PagePath.DebugTerminal}/${MenuParamNull}`;
    console.log("goto url2", goto_url);
    history.push(goto_url);
  }, [useTerminal.items]);

  function getClientInfo(room: ChatRoom): DebugClient {
    return clients_store.items.find((x) => room.users.includes(x.guid))!;
  }
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
