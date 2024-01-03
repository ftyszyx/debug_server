import { ClientStore, useDebugClientStore } from "@/models/client.store";
import { useEffect, useState } from "react";
import { useHistory } from "kl_router";
import { PagePath } from "@/entity/api_path";
import { CloseOutlined } from "@ant-design/icons";

interface ChatSelectConversationProps {
  onClose: () => void;
}
export default function ChatSelectConversation(props: ChatSelectConversationProps) {
  const useClientsStore = useDebugClientStore() as ClientStore;
  const history = useHistory();

  const [selected, setSelected] = useState<string[]>([]);
  useEffect(() => {
    useClientsStore.FetchAll(true);
  }, []);
  const handleToggle = (uid: string) => {
    if (selected.includes(uid)) {
      setSelected(selected.filter((item) => item !== uid));
    } else {
      setSelected([...selected, uid]);
    }
  };
  const handleCreateConversation = () => {
    console.log("selected", selected);
    if (selected.length <= 0) return;
    let goto_url = "";
    for (let i = 0; i < selected.length; i++) {
      const clientinfo = useClientsStore.items.find((x) => x.guid == selected[i]);
      console.log("selected", clientinfo);
      if (clientinfo != null) {
        if (goto_url == "") {
          goto_url = `${PagePath.DebugTerminal}/${clientinfo.id}`;
        }
      }
    }
    console.log("goto_url", goto_url);
    if (goto_url != "") {
      props.onClose();
      history.push(goto_url);
    }
  };
  return (
    <div
      onClick={() => props.onClose()}
      className="fixed top-0 left-0 z-20 flex h-full w-full items-center justify-center bg-[#00000080]"
    >
      <div onClick={(e) => e.stopPropagation()} className="bg-dark mx-3 w-full max-w-[500px] overflow-hidden rounded-lg">
        <div className="border-dark-lighten flex items-center justify-between border-b py-3 px-3">
          <div className="flex-1"></div>
          <div className="flex flex-1 items-center justify-center">
            <h1 className="whitespace-nowrap text-center text-2xl">新建对话</h1>
          </div>
          <div className="flex flex-1 items-center justify-end">
            <button
              onClick={() => props.onClose()}
              className="bg-dark-lighten flex h-8 w-8 items-center justify-center rounded-full"
            >
              <CloseOutlined></CloseOutlined>
            </button>
          </div>
        </div>
        <div className="flex h-96 flex-col items-stretch gap-2 overflow-y-auto py-2">
          {useClientsStore.items.map((doc) => (
            <div
              key={doc.guid}
              onClick={() => handleToggle(doc.guid)}
              className="hover:bg-dark-lighten flex cursor-pointer items-center gap-2 px-5 py-2 transition"
            >
              <input className="flex-shrink-0 cursor-pointer" type="checkbox" checked={selected.includes(doc.guid)} readOnly />
              <p>{doc.name}</p>
            </div>
          ))}
        </div>
        <div className="border-dark-lighten flex justify-end border-t p-3">
          <button
            disabled={selected.length === 0}
            onClick={handleCreateConversation}
            className=" bg-slate-900 text-white rounded-lg py-2 px-3 "
          >
            开启对话
          </button>
        </div>
      </div>
    </div>
  );
}
