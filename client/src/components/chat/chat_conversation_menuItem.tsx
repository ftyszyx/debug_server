import { PagePath } from "@/entity/api_path";
import { TerminalInfo } from "@/models/terminal.store";
import { useHistory, Link, useMatch } from "kl_router";

interface ChatConversationMenuItemProps {
  conversation: TerminalInfo;
}
export default function ChatConversationMenuItem(props: ChatConversationMenuItemProps) {
  const match = useMatch();
  const { id } = match?.params as { id: string };
  return (
    <Link
      to={`${PagePath.DebugTerminal}/${props.conversation.client.id}`}
      className={`hover:bg-dark-lighten group relative flex items-stretch gap-2 py-2 px-5 transition duration-300 ${
        props.conversation.client.id.toString() === id ? "!bg-[#252F3C]" : "!bg-green-300"
      }`}
    >
      <div className="flex flex-grow flex-col items-start gap-1 py-1">
        <p className="max-w-[240px] overflow-hidden text-ellipsis whitespace-nowrap text-white">
          {props.conversation.client.name}
        </p>
        <p className="max-w-[240px] flex-grow overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-400">
          {props.conversation.create_time.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
