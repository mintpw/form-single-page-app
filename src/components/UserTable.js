import { Button, Card, Form, Popconfirm, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import { Userdata } from "../mock/UserData";
import EditableCell from "./EditableCell";

const UserTable = () => {
  const [form] = Form.useForm();

  const [data, setData] = useState(Userdata);
  const [editingKey, setEditingKey] = useState("");
  const [newKey, setNewKey] = useState(2);

  const isEditing = (record) => record.key === editingKey;

  const editRowHandle = (record) => {
    form.setFieldsValue({
      name: "",
      age: "",
      nickname: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancelEditHandle = () => {
    const filterRow = data.filter((item) => item.name !== "");
    setData(filterRow);
    setEditingKey("");
  };

  const saveRowHandle = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey("");
        localStorage.setItem("userData", JSON.stringify(newData));
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
        localStorage.setItem("userData", newData);
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const deleteRowHandle = (key) => {
    const newData = [...data];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      newData.splice(index, 1);
      localStorage.setItem("userData", JSON.stringify(newData));
      setData(newData);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("userData")) {
      const userLocalStorage = JSON.parse(localStorage.getItem("userData"));
      if (userLocalStorage.length > 0) {
        setData(userLocalStorage);
        setNewKey(
          parseInt(userLocalStorage[userLocalStorage.length - 1].key) + 1
        );
      }
    }
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "30%",
      editable: true,
    },
    {
      title: "Age",
      dataIndex: "age",
      width: "15%",
      editable: true,
    },
    {
      title: "Nickname",
      dataIndex: "nickname",
      width: "30%",
      editable: true,
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "10%",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button onClick={() => saveRowHandle(record.key)} type="primary">
              Save
            </Button>
            <Button onClick={cancelEditHandle}>Cancel</Button>
          </Space>
        ) : (
          <Space>
            <Button
              type="primary"
              disabled={editingKey !== ""}
              onClick={() => editRowHandle(record)}>
              Edit
            </Button>
            <Popconfirm
              title="Sure to Delete?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => deleteRowHandle(record.key)}>
              <Button type="danger" ghost disabled={editingKey !== ""}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const handleAdd = () => {
    const newData = {
      key: newKey,
      name: "",
      age: "",
      address: "",
    };
    setData((prev) => [...prev, newData]);
    setNewKey(newKey + 1);
    editRowHandle(newData);
  };
  return (
    <Card
      style={{
        borderRadius: 10,
        boxShadow: "0px 0px 10px rgb(56,84,152,0.1)",
      }}>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            position: ["none", "none"],
            pageSize: 100,
          }}
          footer={() => (
            <Button
              onClick={handleAdd}
              type="primary"
              ghost
              disabled={editingKey !== ""}>
              Add
            </Button>
          )}
        />
      </Form>
    </Card>
  );
};

export default UserTable;
