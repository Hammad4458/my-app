import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../components/context";
import "./tasks.css";
import { api } from "../../common/axios-interceptor/index";
import { Button } from "antd";

export const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const userId=useParams()
  
  console.log(userId);

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

  const handleEdit=(id)=>{
console.log("Task Opened");
  }

  const handleView=(id)=>{
    console.log("Task Opened");
  }


  return (
    <div className="dashboard-container">
      <div className="header">
        <h2>Task Manager</h2>
        <button
          className="create-task-button">
          Create Tasks
        </button>
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
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.priority}</td>
                <td>{task.status}</td>
                <td>{task.department}</td>
                <td>
                  <Button onClick={(()=>{handleView(task.id)})}>View</Button>
                  <Button onClick={(()=>{handleEdit(task.id)})}>Edit</Button>
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
  );
};
