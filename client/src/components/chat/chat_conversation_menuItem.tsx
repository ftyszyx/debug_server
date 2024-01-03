import { PagePath } from "@/entity/api_path";
import { DebugClient } from "@/entity/debug_client.entity";
import { TerminalInfo, TerminalStoreType, useTerminalStore } from "@/models/terminal.store";
import { CloseOutlined } from "@ant-design/icons";
import { Link } from "kl_router";

interface ChatConversationMenuItemProps {
  conversation: TerminalInfo;
  cur_client: DebugClient;
  my_client: DebugClient;
}
export default function ChatConversationMenuItem(props: ChatConversationMenuItemProps) {
  const select_flag = props.cur_client.guid == props.my_client.guid;
  const terminalStore_del = useTerminalStore((state) => state!.removeItem) as TerminalStoreType["removeItem"];

  return (
    <Link
      to={`${PagePath.DebugTerminal}/${props.my_client.id}`}
      className={`hover:bg-dark-lighten group relative flex items-stretch gap-2 py-2 px-5 transition duration-300 ${
        select_flag ? "!bg-[#9056d2]" : "!bg-green-300"
      }`}
    >
      <div className="flex flex-grow flex-col items-start gap-1 py-1">
        <p className="max-w-[240px] overflow-hidden text-ellipsis whitespace-nowrap text-white">{props.my_client.name}</p>
        <p className="max-w-[240px] flex-grow overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-400">
          {props.conversation.room.create_time}
        </p>
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
  );
}
