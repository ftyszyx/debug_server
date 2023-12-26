import { ChatLog } from "@/entity/chat_log.entity";

interface ChatMessageProps {
  message: ChatLog;
  leftOrRight: boolean;
}
export default function ChatMessage(props: ChatMessageProps) {
  return (
    <div
      key={props.message.id}
      className={`group relative flex items-stretch gap-2 px-8 ${props.leftOrRight ? "" : "flex-row-reverse"}`}
    >
      <div className="bg-dark-lighten rounded-lg p-2 text-white after:border-dark-lighten relative after:absolute after:right-full after:bottom-[6px] after:border-8 after:border-t-transparent after:border-l-transparent"></div>
      {props.message.text}
    </div>
  );
}
