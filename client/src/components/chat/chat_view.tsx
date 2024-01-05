import { UserStore } from "@/entity/user.entity";
import { ChatLogStoreType, UseUserStore, useChatStore } from "@/models";
import { useEffect, useMemo, useRef } from "react";
import ChatMessage from "./chat_message";
import { ChatRoom } from "@/entity/chat_room.entity";

import InfiniteScroll from "@/components/scroll/infinite_scroll";
interface ChatViewProps {
  client?: ChatRoom;
  inputOffset: number;
}
export default function ChatView(props: ChatViewProps) {
  console.log("render chatview", props);
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

  console.log(
    "have more",
    curLogInfo?.logs.length,
    curLogInfo?.total,
    curLogInfo ? curLogInfo.logs.length < curLogInfo.total : false
  );

  const getMore = () => {
    console.log("get next", props.client);
    if (props.client) {
      console.log("get next2");
      chatLogStore.getMore(props.client?.id, false);
    }
  };
  return (
    // <div id="scrolllabeldiv" className=" h-full">
    <InfiniteScroll
      inverse
      dataLength={curLogInfo?.logs.length || 0}
      next={getMore}
      hasMore={true}
      loader={<div className="flex justify-center py-3">loading..</div>}
      height={400}
      endMessage="no more message"
      // height={`calc(100vh - ${100 + props.inputOffset}px)`}
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
                leftOrRight={item.from_user != userstore.user_base?.id.toString()}
              ></ChatMessage>
            );
          })}
        <div ref={scrollBottomRef}></div>
      </div>
    </InfiniteScroll>
    // </div>
  );
}
