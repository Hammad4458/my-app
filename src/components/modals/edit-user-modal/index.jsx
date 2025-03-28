import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Select, Form, message } from "antd";
import { useUser } from "../../context/index";
import { api } from "../../../common/axios-interceptor/index";
import { useTranslation } from "react-i18next";

const { Option } = Select;

export const EditUserModal = ({ isOpen, onClose, userData, onUserUpdated }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const {t} = useTranslation();

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
      form.resetFields(); 
      onClose();
    } catch (error) {
      message.error("Failed to update user.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Modal title="Edit User" open={isOpen} onCancel={onClose} footer={null}>
      <Form form={form} layout="vertical" onFinish={handleUpdate}>
        <Form.Item name="name" label={t("name")} rules={[{ required: true, message: "Please enter name" }]}> 
          <Input />
        </Form.Item>

        <Form.Item name="email" label={t("email")} rules={[{ required: true, type: "email", message: "Enter a valid email" }]}> 
          <Input />
        </Form.Item>
        {role==="ADMIN" && 
        <Form.Item name="role" label={t("role")} rules={[{ required: true }]}> 
          <Select>
            <Option value="ADMIN">{t("admin")}</Option>
            <Option value="MANAGER">{t("manager")}</Option>
            <Option value="USER">{t("user")}</Option>
          </Select>
        </Form.Item>
        }

        <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: "10px" }}>
        {t("update-user")}
        </Button>
        <Button onClick={onClose}>{t("cancel")}</Button>
      </Form>
    </Modal>
  );
};
