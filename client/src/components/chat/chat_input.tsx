import { ClientReq } from "@/entity/socketio.entity";
import { Button, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
interface ChatInputProps {
  onSendMessage: (data: ClientReq) => void;
  disabled: boolean;
}
export default function ChatInput(props: ChatInputProps) {
  const [data_form] = useForm<ClientReq>();
  const handleFormSubmit = async (value: ClientReq) => {
    props.onSendMessage(value);
    data_form.resetFields();
  };

  return (
    <div className="border-dark-lighten flex h-16 items-stretch gap-1 border-t px-4 ">
      <Form<ClientReq>
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 24 }}
        form={data_form}
        layout="horizontal"
        name="control-hooks"
        className="flex flex-row flex-nowrap w-full"
        onFinish={handleFormSubmit}
        // style={{ maxWidth: 1000 }}
        initialValues={{ cmd: "", param: "" }}
      >
        <Form.Item name="cmd" label="命令" rules={[{ required: true }]}>
          <Input className="bg-dark-lighten h-9 w-full rounded-full pl-3 pr-10 outline-none" />
        </Form.Item>
        <Form.Item name="param" label="参数" className=" w-[500px]">
          <Input className="bg-dark-lighten h-9 w-full rounded-full pl-3 pr-10 outline-none" />
        </Form.Item>
        <Form.Item className=" absolute right-3">
          <Button disabled={props.disabled} type="primary" htmlType="submit">
            发送
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
