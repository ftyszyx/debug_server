import { PagePath } from "@/entity/api_path";
import { DebugClient } from "@/entity/debug_client.entity";
import { TerminalInfo, TerminalStoreType, useTerminalStore } from "@/models/terminal.store";
import { CloseOutlined } from "@ant-design/icons";
import { Link } from "kl_router";

interface ChatConversationMenuItemProps {
  conversation: TerminalInfo;
  cur_client: DebugClient;
  my_client?: DebugClient;
}
export default function ChatConversationMenuItem(props: ChatConversationMenuItemProps) {
  const terminalStore_del = useTerminalStore((state) => state!.removeItem) as TerminalStoreType["removeItem"];
  return (
    props.my_client && (
      <div
        className={` cursor-pointer transform hover:scale-105 duration-300 transition-transform bg-white mb-4 rounded p-4 flex shadow-md ${
          props.cur_client.guid == props.my_client!.guid ? " border-l-2 border-red-500 border-solid" : ""
        }`}
      >
        <Link to={`${PagePath.DebugTerminal}/${props.my_client.id}`}>
          <div className="flex flex-grow flex-col items-start gap-1 py-1">
            <p className=" truncate">{props.my_client.name}</p>
            {/* <p className="">{props.conversation.room.create_time}</p> */}
            <button
              onClick={() => {
                terminalStore_del(props.conversation.room.id);
              }}
              className=" absolute top-4 right-4 bg-dark-lighten flex h-8 w-8 items-center justify-center rounded-full"
            >
              <CloseOutlined></CloseOutlined>
            </button>
          </div>
        </Link>
      </div>
    )
  );
}
