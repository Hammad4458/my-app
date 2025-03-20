import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../components/context/index";
import { LogoutButton } from "../../components/logout/index";
import { api } from "../../common/axios-interceptor/index";
import { Button } from "antd";
import "./tasks.css";

export const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const userId = useParams();

  console.log(userId);

  const {user} = useUser();
 const role=user.role; 
  useEffect(() => {
    fetchUsers();
  }, [tasks]);

  const fetchUsers = async () => {
    try {
      const response = await api.get(`/tasks/assigned/${userId}`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleEdit = (id) => {
    console.log("Task Opened");
  };

  const handleView = (id) => {
    console.log("Task Opened");
  };

  return (
    <>
      <LogoutButton />

      <div className="dashboard-container">
        <div className="header">
          <h2>Task Manager</h2>
        </div>
        {role==="ADMIN" && ( <div className="create-task-container">
          <Button className="create-task-button">Create Tasks</Button>
        </div>)}

        <table className="task-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Department</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.priority}</td>
                  <td>{task.status}</td>
                  <td>{task.department}</td>
                  <td>
                    <Button
                      onClick={() => {
                        handleView(task.id);
                      }}
                    >
                      View
                    </Button>
                    <Button
                      onClick={() => {
                        handleEdit(task.id);
                      }}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No tasks available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
