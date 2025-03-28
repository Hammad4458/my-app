import React, { useState, useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select, Button } from "antd";
import { api } from "../../../common/axios-interceptor/index";
import { useUser } from "../../context";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import "./task-modal.css"

const { Option } = Select;

export const TaskModal = ({ open, onClose, onTaskCreated, task , isReadOnly }) => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const { user } = useUser();
  const {t} = useTranslation();

  const depId = user?.department?.id;
  const userId = user.id;
  const role=user.role;

  useEffect(() => {
    fetchUsers();
    if (task) {
      form.setFieldsValue({
        ...task,
        dueDate: task.dueDate ? dayjs(task.dueDate) : null,
        assignedUsers: task.assignedUsers.map((u) => u.id),
      });
    } else {
      form.resetFields();
    }
  }, [task]);

  const fetchUsers = async () => {
    try {
      const response = await api.get(`/users/${depId}`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async (values) => {
    if (!depId || !userId) {
      
      return;
    }
  
    values.department = depId;
    values.creator = userId;
    values.dueDate = values.dueDate ? values.dueDate.toISOString() : null;
  
    try {
      if (task) {
        await api.put(`/tasks/update/${task.id}`, values);
        
      } else {
        await api.post("/tasks/create", values);
        
      }
  
      form.resetFields();
      onTaskCreated();  // Refresh the tasks after creation
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };
  

  return (
    <Modal
    title={task ? "Edit Task" : "Create Task"}
    open={open}
    onCancel={onClose}
    footer={null}
    className="task-modal" // Add class here
    modalRender={(modal) => (
      <div className="task-modal-wrapper">
        {modal}
      </div>
    )}
  >
    <div className="task-modal-content">
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="task-modal-body">
          <Form.Item name="title" label={t("title")} rules={[{ required: true }]}>
            <Input placeholder="Enter task title" disabled={isReadOnly} />
          </Form.Item>
  
          <Form.Item name="description" label={t("description")}>
            <Input.TextArea placeholder="Enter task description" disabled={isReadOnly} />
          </Form.Item>
  
          <Form.Item name="dueDate" label={t("duedate")}>
            <DatePicker style={{ width: "100%" }} disabled={isReadOnly} />
          </Form.Item>
  
          <Form.Item name="priority" label={t("priority")}>
            <Select placeholder="Select priority" disabled={isReadOnly}>
              <Option value="HIGH">{t("high")}</Option>
              <Option value="MEDIUM">{t("medium")}</Option>
              <Option value="LOW">{t("low")}</Option>
            </Select>
          </Form.Item>
  
          <Form.Item name="status" label={t("status")}>
            <Select placeholder="Select status" disabled={isReadOnly}>
              <Option value="PENDING">{t("pending")}</Option>
              <Option value="IN_PROGRESS">{t("in-progress")}</Option>
              <Option value="COMPLETED">{t("completed")}</Option>
            </Select>
          </Form.Item>
  
          <Form.Item name="assignedUsers" label={t("assignedUsers")}>
            <Select mode="multiple" placeholder="Select users" disabled={isReadOnly}>
              {users.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
  
        {/* Footer remains fixed */}
        {role !== "USER" && (
          <div className="task-modal-footer">
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              {task ? "Update Task" : "Create Task"}
            </Button>
          </div>
        )}
      </Form>
    </div>
  </Modal>
  
  );
};
