import { ChatLog } from "@/entity/chat_log.entity";
import { DebugClient } from "@/entity/debug_client.entity";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

interface ChatViewProps {
  client?: DebugClient;
}
export default function ChatView(props: ChatViewProps) {
  const [chatDatas, SetChatDatas] = useState<ChatLog[]>([]);
  useEffect(() => {
    if (props.client) {
    }
  }, props.client);
  async function getChatLogs(params: type) {}
  return (
    <InfiniteScroll
      dataLength={data?.size as number}
      next={() => setLimitCount((prev) => prev + 10)}
      inverse
      hasMore={(data?.size as number) >= limitCount}
      loader={
        <div className="flex justify-center py-3">
          <Spin />
        </div>
      }
      style={{ display: "flex", flexDirection: "column-reverse" }}
      height={`calc(100vh - ${144 + inputSectionOffset}px)`}
    >
      <div className="flex flex-col items-stretch gap-3 pt-10 pb-1">
        {data?.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as MessageItem))
          .map((item, index) => (
            <Fragment key={item.id}>
              {item.sender === currentUser?.uid ? (
                <RightMessage replyInfo={replyInfo} setReplyInfo={setReplyInfo} message={item} />
              ) : (
                <LeftMessage
                  replyInfo={replyInfo}
                  setReplyInfo={setReplyInfo}
                  message={item}
                  index={index}
                  docs={data?.docs}
                  conversation={conversation}
                />
              )}
              {Object.entries(conversation.seen).filter(([key, value]) => key !== currentUser?.uid && value === item.id).length >
                0 && (
                <div className="flex justify-end gap-[1px] px-8">
                  {Object.entries(conversation.seen)
                    .filter(([key, value]) => key !== currentUser?.uid && value === item.id)
                    .map(([key, value]) => (
                      <AvatarFromId key={key} uid={key} size={14} />
                    ))}
                </div>
              )}
            </Fragment>
          ))}
        <div ref={scrollBottomRef}></div>
      </div>
    </InfiniteScroll>
  );
}
