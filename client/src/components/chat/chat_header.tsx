import { DebugClient } from "@/entity/debug_client.entity";

export default function ChatHedaer(props: { client?: DebugClient }) {
  return (
    <div className="border-dark-lighten flex h-20 items-center justify-between border-b px-5">
      <div className="flex flex-grow items-center gap-3">{props.client ? props.client.name : ""}</div>
    </div>
  );
}
