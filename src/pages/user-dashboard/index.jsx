import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../components/context/index";
import { api } from "../../common/axios-interceptor/index";
import { LogoutButton } from "../../components/logout";
import { Button } from "antd";
import "./dashboard.css";

export const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useUser();
  
  const depId=user?.department?.id;
  const depName=user?.department?.name;

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  console.log("DepId::",depId,"user Role :",user.role)

  const fetchUsers = async () => {
    try {
      let response;
      if (user?.role === "ADMIN") {
        response = await api.get(`/department/${depId}/users`);
        setUsers(response.data);
      } else if (user?.role === "MANAGER") {
        setUsers(user.subordinates);
        console.log(users)
      } else {
        response = { data: [user] }; 
        setUsers(response.data);
      }

      
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id) => {
    navigate(`./users/${id}/tasks`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <LogoutButton />
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
            users?.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{depName}</td>
                <td>
                  <Button onClick={() => handleView(user.id)}>View</Button>
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
    </>
  );
};
