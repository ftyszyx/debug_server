import { ChatRoom } from "@/entity/chat_room.entity";
import { ChatLogStoreType, useChatStore } from "@/models";
import { useMemo } from "react";

export default function ChatHedaer(props: { client?: ChatRoom }) {
  const chatlogStore = useChatStore() as ChatLogStoreType;
  const chatloginfo = useMemo(() => {
    if (props.client) {
      return chatlogStore.getLogsByRoomid(props.client.id);
    }
    return null;
  }, [props.client, chatlogStore]);
  return (
    <div className="border-dark-lighten flex  flex-col justify-start items-start border-b px-5">
      <div>{props.client ? props.client.nick : ""}</div>
      {chatloginfo && <div>{`已加载${chatloginfo.logs.length}/共有${chatloginfo.total}`}</div>}
    </div>
  );
}
