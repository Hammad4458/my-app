import React, { useState } from "react";
import { Modal, Select, Button, message } from "antd";
import { api } from "../../../common/axios-interceptor";

export const UpdateStatusModal = ({ open, onClose, taskId, currentStatus, onStatusUpdated }) => {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!taskId) {
      message.error("Task ID is missing!");
      return;
    }

    setLoading(true);
    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
      message.success("Task status updated successfully!");
      onStatusUpdated(); // Refresh tasks in parent
      onClose();
    } catch (error) {
      console.error("Error updating task status:", error);
      message.error("Failed to update task status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Update Task Status"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={loading}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSave} loading={loading}>
          Save
        </Button>
      ]}
    >
      <Select
        value={status}
        onChange={(value) => setStatus(value)}
        style={{ width: "100%" }}
      >
        <Select.Option value="PENDING">Pending</Select.Option>
        <Select.Option value="IN_PROGRESS">In-Progress</Select.Option>
        <Select.Option value="COMPLETED">Completed</Select.Option>
      </Select>
    </Modal>
  );
};
