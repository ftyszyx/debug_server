import { ListReq, ListResp, PageReq } from "@/entity/api.entity";
import { ApiPath } from "@/entity/api_path";
import { ChatLog } from "@/entity/chat_log.entity";
import { DebugClient } from "@/entity/debug_client.entity";
import { UserStore } from "@/entity/user.entity";
import { ChatLogStoreType, UseUserStore, useChatStore } from "@/models";
import { MyFetchPost } from "@/util/fetch";
import { useEffect, useMemo, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ChatMessage from "./chat_message";

interface ChatViewProps {
  client?: DebugClient;
  inputOffset: number;
}
export default function ChatView(props: ChatViewProps) {
  const chatLogStore = useChatStore() as ChatLogStoreType;
  const userstore = UseUserStore() as UserStore;
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  // const isWindowFocus = useRef(true);
  useEffect(() => {
    if (props.client) {
      chatLogStore.getMore(props.client.guid, true);
    }
  }, [props.client]);
  const curLogInfo = useMemo(() => {
    if (props.client) {
      return chatLogStore.getLogsByGuid(props.client?.guid);
    }
  }, [useChatStore, props.client]);
  return (
    <InfiniteScroll
      dataLength={curLogInfo?.total || 0}
      next={() => {
        if (props.client) {
          chatLogStore.getMore(props.client?.guid);
        }
      }}
      inverse
      hasMore={chatDatas.length < total}
      loader={<div className="flex justify-center py-3">loading..</div>}
      style={{ display: "flex", flexDirection: "column-reverse" }}
      height={`calc(100vh - ${100 + props.inputOffset}px)`}
    >
      <div className="flex flex-col items-stretch gap-3 pt-10 pb-1">
        {chatDatas.map((item) => {
          return <ChatMessage message={item} leftOrRight={item.from_user == userstore.user_base?.id.toString()}></ChatMessage>;
        })}
        <div ref={scrollBottomRef}></div>
      </div>
    </InfiniteScroll>
  );
}