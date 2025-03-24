import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useUser } from "../../components/context/index";
import { LogoutButton } from "../../components/logout/index";
import { api } from "../../common/axios-interceptor/index";
import { Button, Table } from "antd";
import { TaskModal } from "../../components/modals/task-modal/index";
import "./tasks.css";

export const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null); // Store task for view/edit

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const role = user.role;
  const { userId } = useParams();
  const depName = user.department.name;

  console.log("Got Tasks", userId, depName, role);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/tasks/assigned/${userId}`);
      console.log("Particular Tasks:", response.data);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
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
              View
            </Button>
          )}
          {(role === "ADMIN" || role === "MANAGER") && (
            <Button type="link" onClick={() => handleEditTask(task)}>
              Edit
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <LogoutButton />

      <div className="dashboard-container">
        
        <div className="header">
          <h2>Task Manager</h2>
        </div>
        <h3>{depName}</h3>

        {role === "ADMIN" && (
          <div className="create-task-container">
            <Button
              type="primary"
              onClick={() => {
                setSelectedTask(null);
                setModalVisible(true);
              }}
            >
              Create Task
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
          task={selectedTask} // Pass task to modal for viewing/editing
        />
      )}
    </>
  );
};
