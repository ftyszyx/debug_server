import { SendOutlined } from "@ant-design/icons";
import { useRef, useState, FormEvent } from "react";
interface ChatInputProps {
  onSendMessage: (text: string) => void;
  disabled: boolean;
}
export default function ChatInput(props: ChatInputProps) {
  const textInputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    props.onSendMessage(inputValue);
    setInputValue("");
  };

  return (
    <div className="border-dark-lighten flex h-16 items-stretch gap-1 border-t px-4 ">
      <form onSubmit={handleFormSubmit} className="flex flex-grow items-stretch gap-1">
        <div className="relative flex flex-grow items-center">
          <input
            disabled={props.disabled}
            maxLength={1000}
            ref={textInputRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            className="bg-dark-lighten h-9 w-full rounded-full pl-3 pr-10 outline-none"
            type="text"
            placeholder="输入命令..."
          />
          <button disabled={props.disabled} className="text-primary flex flex-shrink-0 items-center text-2xl">
            <SendOutlined />
          </button>
        </div>
      </form>
    </div>
  );
}
