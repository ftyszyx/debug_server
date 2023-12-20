import { useRouterStore } from "kl_router";
// import SideBar from "@/components/Home/SideBar";
export default function DebugTerminal() {
  const route_data = useRouterStore();
  const chat_id = route_data.match?.params["id"];
  console.log("chat_id", chat_id);
  return (
    <div className="flex">
      {/* <SideBar /> */}
      {/* <div className="flex h-screen flex-grow flex-col items-stretch">
        {loading ? (
          <>
            <div className="border-dark-lighten h-20 border-b"></div>
            <div className="flex-grow"></div>
            <InputSection disabled />
          </>
        ) : !conversation || error || !conversation.users.includes(currentUser?.uid as string) ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-6">
            <img className="h-32 w-32 object-cover" src="/error.svg" alt="" />
            <p className="text-center text-lg">Conversation does not exists</p>
          </div>
        ) : (
          <>
            <ChatHeader conversation={conversation} />
            <ChatView
              replyInfo={replyInfo}
              setReplyInfo={setReplyInfo}
              inputSectionOffset={inputSectionOffset}
              conversation={conversation}
            />
            <InputSection
              setInputSectionOffset={setInputSectionOffset}
              replyInfo={replyInfo}
              setReplyInfo={setReplyInfo}
              disabled={false}
            />
          </>
        )}
      </div> */}
    </div>
  );
}
