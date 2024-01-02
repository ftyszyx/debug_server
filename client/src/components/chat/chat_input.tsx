import { ClientReq } from "@/entity/socketio.entity";
import { SendOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
interface ChatInputProps {
  onSendMessage: (data: ClientReq) => void;
  disabled: boolean;
}
export default function ChatInput(props: ChatInputProps) {
  const [data_form] = useForm<ClientReq>();
  const handleFormSubmit = async (value: ClientReq) => {
    console.log("subimt", value);
    props.onSendMessage(value);
    data_form.resetFields();
  };

  return (
    <div className="border-dark-lighten flex h-16 items-stretch gap-1 border-t px-4 ">
      <Form<ClientReq>
        form={data_form}
        layout="inline"
        name="control-hooks"
        onFinish={handleFormSubmit}
        style={{ maxWidth: 600 }}
        initialValues={{ cmd: "", param: "" }}
      >
        <Form.Item name="cmd" label="命令" rules={[{ required: true }]}>
          <Input className="bg-dark-lighten h-9 w-full rounded-full pl-3 pr-10 outline-none" />
        </Form.Item>
        <Form.Item name="param" label="参数">
          <Input className="bg-dark-lighten h-9 w-full rounded-full pl-3 pr-10 outline-none" />
        </Form.Item>
        <Form.Item>
          <button disabled={props.disabled} className="text-primary flex flex-shrink-0 items-center text-2xl">
            <SendOutlined />
          </button>
        </Form.Item>
      </Form>
    </div>
  );
}
