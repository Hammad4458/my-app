import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useUser } from "../../components/context/index";
import { LogoutButton } from "../../components/logout/index";
import { api } from "../../common/axios-interceptor/index";
import { Button } from "antd";
import { TaskModal } from "../../components/modals/task-modal/index";
import "./tasks.css";

export const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null); // Store task for view/edit

  const location = useLocation();
  const depName = location.state?.department || "Not Found";
  const navigate = useNavigate();
  const { user } = useUser();
  const role = user.role;
  const { userId } = useParams();

  console.log("Got Tasks", userId, depName);

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

  return (
    <>
      <LogoutButton />

      <div className="dashboard-container">
        <h3>Dep:{depName}</h3>
        <div className="header">
          <h2>Task Manager</h2>
        </div>

        {role === "ADMIN" && (
          <div className="create-task-container">
            <Button
              className="create-task-button"
              onClick={() => {
                setSelectedTask(null);
                setModalVisible(true);
              }}
            >
              Create Task
            </Button>
          </div>
        )}

        <table className="task-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Department</th>
              <th>Assigned Users</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks?.length > 0 ? (
              tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.priority}</td>
                  <td>{task.status}</td>
                  <td>{depName}</td>
                  <td>
                    {task.assignedUsers.length > 0
                      ? task.assignedUsers.map((user) => user.name).join(", ")
                      : "No Users Assigned"}
                  </td>
                  <td>
                    {role==="USER" && <Button onClick={() => handleViewTask(task)}>View</Button>}
                    {(role === "ADMIN" || role === "MANAGER") && (
                      <Button onClick={() => handleEditTask(task)}>Edit</Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No tasks available
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
