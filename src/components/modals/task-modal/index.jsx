import React, { useState, useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select, Button } from "antd";
import { api } from "../../../common/axios-interceptor/index";
import { useUser } from "../../context";
import dayjs from "dayjs";

const { Option } = Select;

export const TaskModal = ({ open, onClose, onTaskCreated, task }) => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const { user } = useUser();

  const depId = user?.department?.id;
  const userId = user.id;
  const role=user.role;

  useEffect(() => {
    fetchUsers();
    if (task) {
      form.setFieldsValue({
        ...task,
        dueDate: task.dueDate ? dayjs(task.dueDate) : null, // Convert string to Date object
        assignedUsers: task.assignedUsers.map((u) => u.id),
      });
    } else {
      form.resetFields();
    }
  }, [task]);

  const fetchUsers = async () => {
    try {
      const response = await api.get(`/department/${depId}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async (values) => {
    if (!depId || !userId) {
      console.log(
        "Department ID or User ID is missing. Task creation aborted."
      );
      return;
    }

    values.department = depId;
    values.creator = userId;
    values.dueDate = values.dueDate ? values.dueDate.toISOString() : null;

    try {
      if (task) {
        // Update task
        await api.put(`/tasks/update/${task.id}`, values);
        console.log("Task updated successfully!");
      } else {
        // Create task
        await api.post("/tasks/create", values);
        console.log("Task created successfully!");
      }

      form.resetFields();
      onTaskCreated();
      onClose();
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
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input placeholder="Enter task title" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea placeholder="Enter task description" />
        </Form.Item>

        <Form.Item name="dueDate" label="Due Date">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="priority" label="Priority">
          <Select placeholder="Select priority">
            <Option value="HIGH">High</Option>
            <Option value="MEDIUM">Medium</Option>
            <Option value="LOW">Low</Option>
          </Select>
        </Form.Item>

        <Form.Item name="status" label="Status">
          <Select placeholder="Select status">
            <Option value="PENDING">Pending</Option>
            <Option value="IN_PROGRESS">In Progress</Option>
            <Option value="COMPLETED">Completed</Option>
          </Select>
        </Form.Item>

        <Form.Item name="assignedUsers" label="Assigned Users">
          <Select mode="multiple" placeholder="Select users">
            {users.map((user) => (
              <Option key={user.id} value={user.id}>
                {user.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {role != "USER" && (
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            {task ? "Update Task" : "Create Task"}
          </Button>
        )}
      </Form>
    </Modal>
  );
};
