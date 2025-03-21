import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Select, Form, message } from "antd";
import { useUser } from "../../context/index";
import { api } from "../../../common/axios-interceptor/index";

const { Option } = Select;

export const EditUserModal = ({ isOpen, onClose, userData, onUserUpdated }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const role=user.role;

  useEffect(() => {
    if (isOpen && userData) {
      form.setFieldsValue({
        name: userData.name,
        email: userData.email,
        role: userData.role,
      });
    }
  }, [isOpen, userData]);

  const handleUpdate = async (formValues) => {
    setLoading(true);
    try {
      const payload = {
        name: formValues.name,
        email: formValues.email,
        role: formValues.role,
      };

      await api.patch(`/users/${userData.id}`, payload);
      message.success("User updated successfully!");
      onUserUpdated({ ...userData, ...payload });
      onClose();
    } catch (error) {
      message.error("Failed to update user.");
      console.error("Error updating user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Edit User" open={isOpen} onCancel={onClose} footer={null}>
      <Form form={form} layout="vertical" onFinish={handleUpdate}>
        <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter name" }]}> 
          <Input />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Enter a valid email" }]}> 
          <Input />
        </Form.Item>
        {role==="ADMIN" && 
        <Form.Item name="role" label="Role" rules={[{ required: true }]}> 
          <Select>
            <Option value="ADMIN">Admin</Option>
            <Option value="MANAGER">Manager</Option>
            <Option value="USER">User</Option>
          </Select>
        </Form.Item>
        }

        <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: "10px" }}>
          Update User
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </Form>
    </Modal>
  );
};
