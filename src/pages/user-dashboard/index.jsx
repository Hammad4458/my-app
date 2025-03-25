import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../components/context/index";
import { api } from "../../common/axios-interceptor/index";
import { LogoutButton } from "../../components/logout";
import { Form, Button, Tabs, Table, Space, message, Select } from "antd";
import { EditUserModal } from "../../components/modals/edit-user-modal/index";
import { TaskModal } from "../../components/modals/task-modal/index";
import "./dashboard.css";
import { render } from "@testing-library/react";

export const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [managersList, setManagersList] = useState([]);
  const [managerUsers, setManagersUsers] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const navigate = useNavigate();
  const { user } = useUser();
  const { Option } = Select;

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
        response = await api.get(`/users/${depId}`);
        setUsers(response.data);
        console.log(response.data,"datatatat");
        response = await api.get(`/users/managers/${depId}`);
        setManagersList(response.data);
      } else if (role === "MANAGER") {
        setUsers(user.subordinates);
      } else {
        navigate(`/dashboard/users/${user.id}/tasks`, {
          state: { department: depName },
        });
      }
    } catch (error) {
      message.error("Failed to fetch users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchTasks = async () => {
    setLoadingTasks(true);
    try {
      const response = await api.get(`/tasks/department/${depId}`);
      setTasks(response.data);
    } catch (error) {
      message.error("Failed to fetch tasks");
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleManagerUsers = async (managerId) => {
    if (!managerId) {
      setManagersUsers([]);
    } else {
      try {
        const response = await api.get(
          `/users/assignedUsers/managerId/${managerId}`
        );
        setManagersUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleViewTasks = (userId) => {
    navigate(`/dashboard/users/${userId}/tasks`);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user
      )
    );
  };

  const handleTaskCreated = () => {
    fetchTasks(); // Refresh the task list after task creation
  };

  const userColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (department) => department?.name, 
    },
    {
      title: "Organization",
      dataIndex: "organization",
      key: "organization",
      render:(organization)=>organization?.name,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleViewTasks(record.id)}>
            View Tasks
          </Button>
          {role !== "USER" && (
            <Button type="default" onClick={() => handleEditUser(record)}>
              Edit
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const taskColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleViewTasks(record.id)}>
            View
          </Button>
          {role !== "USER" && (
            <Button type="default" onClick={() => handleEditTask(record)}>
              Edit
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <LogoutButton />
      <div className="info">
        <h3>
          {user.name} - {user.role}
        </h3>
      </div>

      {role === "ADMIN" ? (
        <div className="centered-tabs">
          <Tabs
            defaultActiveKey="1"
            onChange={(key) => {
              if (key === "2") {
                fetchTasks();
              }
            }}
          >
            <Tabs.TabPane tab="Users" key="1">
              <Table
                className="table"
                columns={userColumns}
                dataSource={users}
                rowKey="id"
                loading={loadingUsers}
                pagination={{ pageSize: 5, position: ["bottomCenter"] }}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Tasks" key="2">
              <div className="create-task-container">
                <Button
                  type="primary"
                  onClick={() => {
                    console.log("Create Task button clicked");
                    setSelectedTask(null);
                    setIsTaskModalOpen(true);
                  }}
                >
                  Create Task
                </Button>
              </div>
              <Table
                className="table"
                columns={taskColumns}
                dataSource={tasks}
                rowKey="id"
                loading={loadingTasks}
                pagination={{ pageSize: 5, position: ["bottomCenter"] }}
              />
            </Tabs.TabPane>

            <Tabs.TabPane tab="Managers" key="3">
              <div className="manager-form">
                <Select
                  placeholder="Select Manager"
                  allowClear
                  onChange={handleManagerUsers}
                  className="manager-select"
                >
                  {managersList.map((manager) => (
                    <Option key={manager.id} value={manager.id}>
                      {manager.name}
                    </Option>
                  ))}
                </Select>
              </div>

              <Table
                className="table"
                columns={userColumns}
                dataSource={managerUsers}
                rowKey="id"
                pagination={{ pageSize: 5, position: ["bottomCenter"] }}
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
      ) : (
        <Table
          className="table"
          columns={userColumns}
          dataSource={users}
          rowKey="id"
          loading={loadingUsers}
          pagination={{ pageSize: 5, position: ["bottomCenter"] }}
        />
      )}

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={selectedUser}
        onUserUpdated={handleUserUpdated}
      />

      <TaskModal
        open={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={selectedTask}
        onUserUpdated={handleUserUpdated}
        onTaskCreated={handleTaskCreated}
      />
    </>
  );
};
