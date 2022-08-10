import { Form, Input, InputNumber } from "antd";
import React from "react";

function EditableCell({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  form,
  ...restProps
}) {
  const inputNode =
    inputType === "number" ? (
      <Form.Item
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `Please enter ${dataIndex}`,
          },
        ]}
        style={{
          margin: 0,
        }}>
        <InputNumber placeholder={title} min={1} />
      </Form.Item>
    ) : (
      <Form.Item
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `Please enter ${dataIndex}`,
            whitespace: true,
          },
        ]}
        style={{
          margin: 0,
        }}>
        <Input placeholder={title} maxLength={30} />
      </Form.Item>
    );

  return <td {...restProps}>{editing ? inputNode : children}</td>;
}

export default EditableCell;
