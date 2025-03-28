import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useUser } from "../../components/context/index";
import { Header } from "../../components/header/index";
import { api } from "../../common/axios-interceptor/index";
import { Button, Table } from "antd";
import { TaskModal } from "../../components/modals/task-modal/index";
import { UpdateStatusModal } from "../../components/modals/update-status-modal";
import { useTranslation } from "react-i18next";
import "./tasks.css";

export const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);
  const {t} = useTranslation();


  const location = useLocation();
  const { user } = useUser();
  const role = user.role;
  const { userId } = useParams();
  const depName = user.department.name;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/tasks/assigned/${userId}`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
    setIsReadOnly(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const handleStatus = (taskId,status) => {
    setStatusModal(true);
    setSelectedTaskId(taskId)
    setCurrentStatus(status)
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
    },
    {
      title: "Department",
      key: "department",
      render: () => depName, // Static value
    },
    {
      title: "Assigned Users",
      key: "assignedUsers",
      render: (task) =>
        task.assignedUsers.length > 0
          ? task.assignedUsers.map((user) => user.name).join(", ")
          : "No Users Assigned",
    },
    {
      title: "Actions",
      key: "actions",
      render: (task) => (
        <>
          {role === "USER" && (
            <Button type="link" onClick={() => handleViewTask(task)}>
              {t("view")}
            </Button>
          )}
          {(role === "ADMIN" || role === "MANAGER") && (
            <Button type="link" onClick={() => handleEditTask(task)}>
              {t("edit")}
            </Button>
          )}
          
          {role === "USER" && (
            <Button type="link" onClick={() => handleStatus(task.id,task.status)}>
              {t("update")}
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <Header />

      <div className="dashboard-container">
        <div className="header">
          <h2>{t("task-mngr")}</h2>
        </div>
        <h3>{depName}</h3>

        {(role === "ADMIN" || role === "MANAGER") && (
          <div className="create-task-container">
            <Button
              type="primary"
              onClick={() => {
                setSelectedTask(null);
                setModalVisible(true);
              }}
            >
              {t("create-task")}
            </Button>
          </div>
        )}

        <Table
          className="task-table"
          columns={columns}
          dataSource={tasks}
          rowKey="id"
          pagination={{ pageSize: 5, position: ["bottomCenter"] }}
        />
      </div>

      {modalVisible && (
        <TaskModal
          open={modalVisible}
          onClose={() => setModalVisible(false)}
          onTaskCreated={fetchTasks}
          task={selectedTask}
          isReadOnly={isReadOnly}
        />
      )}

      {statusModal && selectedTask && (
        <UpdateStatusModal
          open={statusModal}
          onClose={() => setStatusModal(false)}
          taskId={selectedTaskId}
          currentStatus={currentStatus}
          onStatusUpdated={fetchTasks}
        />
      )}
    </>
  );
};
