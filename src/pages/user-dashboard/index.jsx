import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../components/context/index";
import { api } from "../../common/axios-interceptor/index";
import { LogoutButton } from "../../components/logout";
import { Button, Tabs } from "antd";
import { EditUserModal } from "../../components/modals/edit-user-modal/index";
import { TaskModal } from "../../components/modals/task-modal/index"; // Import Task Modal
import "./dashboard.css";

export const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]); // State for tasks
  const [loading, setLoading] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useUser();

  const depId = user?.department?.id;
  const depName = user?.department?.name;
  const role = user?.role;

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      let response;
      if (role === "ADMIN") {
        response = await api.get(`/department/${depId}/users`);
        setUsers(response.data);
      } else if (role === "MANAGER") {
        setUsers(user.subordinates);
      } else {
        navigate(`/dashboard/users/${user.id}/tasks`, {
          state: { department: depName },
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    setLoadingTasks(true);
    try {
      const response = await api.get(`/tasks/department/${depId}`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleViewTask = (taskId) => {
    navigate(`/dashboard/users/${taskId}/tasks`);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const userList = (
    <div className="dashboard-container">
      <div className="header">
        <h2>User List</h2>
      </div>

      <table className="task-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Department</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users?.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{depName}</td>
                <td>
                  <Button onClick={() => handleViewTask(user.id, depName)}>
                    View Tasks
                  </Button>
                  {role !== "USER" && (
                    <Button onClick={() => handleEditTask(user)}>Edit</Button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-data">
                No users available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const taskList = (
    <div className="dashboard-container">
      <div className="header">
        <h2>Task List</h2>
      </div>

      {loadingTasks ? (
        <div>Loading Tasks...</div>
      ) : (
        <table className="task-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks?.length > 0 ? (
              tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.priority}</td>
                  <td>{task.status}</td>
                  <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                  <td>
                    <Button onClick={() => handleViewTask(task.id)}>
                      View Task
                    </Button>
                    {role !== "USER" && (
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
      )}
    </div>
  );

  return (
    <>
      <LogoutButton />
      <div className="info">
        <h3>
          {user.name} - {user.role}
        </h3>
      </div>

      {role === "ADMIN" ? (
        <Tabs
          defaultActiveKey="1"
          onChange={(key) => {
            if (key === "2") {
              fetchTasks();
            }
          }}
        >
          <Tabs.TabPane tab="Users" key="1">
            {userList}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Tasks" key="2">
            {taskList}
          </Tabs.TabPane>
        </Tabs>
      ) : (
        userList
      )}

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={selectedUser}
      />

      <TaskModal
        open={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={selectedTask}
        onTaskUpdated={handleTaskUpdated}
      />
    </>
  );
};
