import { FieldInfo } from "@/entity/form.entity";
import { OperateCode, OperateTypeInfo } from "@/entity/page.entity";
import { getValidErrMsg } from "@/util/valid";
import { Form, Modal, message } from "antd";

const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 16 } };
export interface EditPanelChildProps {
  disabled: boolean;
}
interface EditPanelProps<T> {
  title: string;
  fieldlist: FieldInfo[];
  initalvalues?: Partial<T>;
  show_type: OperateTypeInfo;
  show: boolean;
  onOk?: (data: T) => Promise<void>;
  onCancel?: () => void;
  children?: React.ReactNode;
  children_render?: (params: EditPanelChildProps) => JSX.Element;
  loading?: boolean;
}
export default function CommonEditPanel<T>(props: EditPanelProps<T>) {
  const [form] = Form.useForm();
  // console.log("render editpanel", props);
  // useEffect(() => {
  //   console.log("reset form");
  //   form.resetFields();
  // }, [props.initalvalues]);
  return (
    <Modal
      title={props.title}
      open={props.show}
      onOk={async () => {
        const values = (await form.validateFields().catch((err) => {
          //
          console.log("err:", err);
          message.error("错误:" + getValidErrMsg(err));
        })) as T;
        if (values) if (props.onOk) props.onOk({ ...values });
      }}
      onCancel={() => {
        if (props.onCancel) props.onCancel();
      }}
      confirmLoading={props.loading || false}
    >
      <Form {...formItemLayout} form={form} initialValues={props.initalvalues}>
        {props.fieldlist.map((item) => {
          const show_flag = (item.field_operate & props.show_type.op_code) >= 1;
          // console.log("show:", show_flag, item, item.field_operate & props.show_type.op_code);
          if (show_flag)
            return (
              <Form.Item label={item.label} name={item.field_name} rules={item.edit_rules || []} key={item.field_name}>
                <item.field_Element {...item.edit_props} disabled={props.show_type.op_code == OperateCode.See}>
                  {item.SelectOpsRender && item.SelectOpsRender()}
                </item.field_Element>
              </Form.Item>
            );
          return null;
        })}
        {props.children && props.children}
        {props.children_render && props.children_render({ disabled: props.show_type.op_code == OperateCode.See })}
      </Form>
    </Modal>
  );
}
