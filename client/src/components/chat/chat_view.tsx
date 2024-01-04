import { UserStore } from "@/entity/user.entity";
import { ChatLogStoreType, UseUserStore, useChatStore } from "@/models";
import { useEffect, useMemo, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ChatMessage from "./chat_message";
import { ChatRoom } from "@/entity/chat_room.entity";

interface ChatViewProps {
  client?: ChatRoom;
  inputOffset: number;
}
export default function ChatView(props: ChatViewProps) {
  const chatLogStore = useChatStore() as ChatLogStoreType;
  const userstore = UseUserStore() as UserStore;
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  // const isWindowFocus = useRef(true);
  useEffect(() => {
    if (props.client) {
      chatLogStore.getMore(props.client.id, true);
    }
  }, [props.client]);
  const curLogInfo = useMemo(() => {
    console.log("get curlog");
    if (props.client) {
      return chatLogStore.getLogsByGuid(props.client?.id);
    }
  }, [useChatStore, props.client]);
  useEffect(() => {
    console.log("cur log", curLogInfo);
  }, [curLogInfo]);
  console.log("have more", curLogInfo ? curLogInfo.logs.length < curLogInfo.total : false);

  return (
    <InfiniteScroll
      inverse
      dataLength={curLogInfo?.total || 0}
      next={() => {
        console.log("get next");
        if (props.client) {
          console.log("get next2");
          chatLogStore.getMore(props.client?.id, false);
        }
      }}
      hasMore={curLogInfo ? curLogInfo.logs.length < curLogInfo.total : false}
      loader={<div className="flex justify-center py-3">loading..</div>}
      style={{ display: "flex", flexDirection: "column-reverse" }}
      height={`calc(100vh - ${100 + props.inputOffset}px)`}
    >
      <div className="flex flex-col items-stretch gap-3 pt-10 pb-1">
        {curLogInfo &&
          props.client &&
          curLogInfo.logs.map((item) => {
            return (
              <ChatMessage
                key={item.id.toString()}
                client_name={props.client!.nick}
                message={item}
                leftOrRight={item.from_user == userstore.user_base?.id.toString()}
              ></ChatMessage>
            );
          })}
        <div ref={scrollBottomRef}></div>
      </div>
    </InfiniteScroll>
  );
}
