import { ChatLog } from "@/entity/chat_log.entity";

interface ChatMessageProps {
  message: ChatLog;
  client_name: string;
  leftOrRight: boolean;
}
export default function ChatMessage(props: ChatMessageProps) {
  return (
    <div className={`mb-4 w-full flex ${props.leftOrRight ? "" : " text-right"}`}>
      <div className="flex-2">{props.client_name}</div>
      <div className="flex-1 px-2 flex-col">
        <div
          className={`inline-block bg-gray-300 rounded-full p-2 px-6 text-gray-700 ${
            props.leftOrRight ? " bg-gray-200" : " bg-blue-600"
          }`}
        >
          <span className={props.leftOrRight ? "text-gray-500" : "text-white"}>{props.message.text}</span>
        </div>
        <div className=" text-gray-500 text-sm">{new Date(props.message.create_time).toLocaleString()}</div>
      </div>
    </div>
  );
}
