import { UserStore } from "@/entity/user.entity";
import { ChatLogStoreType, UseUserStore, useChatStore } from "@/models";
import { useEffect, useMemo, useRef, useState } from "react";
import ChatMessage from "./chat_message";
import { ChatRoom } from "@/entity/chat_room.entity";

import InfiniteScroll from "@/components/scroll/infinite_scroll";
interface ChatViewProps {
  client?: ChatRoom;
  inputOffset: number;
}
export default function ChatView(props: ChatViewProps) {
  const chatLogStore = useChatStore() as ChatLogStoreType;
  const userstore = UseUserStore() as UserStore;
  const [roominfo, setRoominfo] = useState<ChatRoom>();
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (roominfo) {
      chatLogStore.getMore(roominfo.id, true);
    }
  }, [roominfo]);
  useEffect(() => {
    setRoominfo(props.client);
  }, [props.client]);
  const curLogInfo = useMemo(() => {
    if (roominfo) {
      return chatLogStore.getLogsByRoomid(roominfo.id);
    }
  }, [useChatStore, roominfo]);
  const moveToBottom = () => {
    scrollBottomRef.current?.scrollIntoView();
    // setTimeout(() => {
    //   scrollBottomRef.current?.scrollIntoView();
    // }, 100);
  };
  const newLogId = useMemo(() => {
    let logid = 0;
    if (curLogInfo && curLogInfo.logs.length > 0) {
      logid = curLogInfo.logs[curLogInfo.logs.length - 1].id;
    }
    return logid;
  }, [curLogInfo, curLogInfo?.logs.length]);
  useEffect(() => {
    moveToBottom();
  }, [newLogId]);

  return (
    <InfiniteScroll
      inverse
      dataLength={curLogInfo?.logs.length || 0}
      next={() => {
        console.log("getmore next 1", roominfo);
        if (roominfo) {
          console.log("get next2");
          chatLogStore.getMore(roominfo.id, false);
        }
      }}
      hasMore={curLogInfo ? curLogInfo?.logs.length < curLogInfo?.total : false}
      loader={<div className="flex justify-center py-3 text-red-500">加载中。。。</div>}
      // height={200}
      endMessage={
        <div className="flex justify-center py-3 ">
          <span className=" text-red-500">到顶了</span>
        </div>
      }
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
                leftOrRight={item.from_user != userstore.user_base?.id.toString()}
              ></ChatMessage>
            );
          })}
        <div ref={scrollBottomRef}></div>
      </div>
    </InfiniteScroll>
  );
}
