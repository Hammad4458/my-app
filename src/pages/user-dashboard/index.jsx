import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../components/context/index";
import { api } from "../../common/axios-interceptor/index";
import { LogoutButton } from "../../components/logout";
import { Button } from "antd";
import { EditUserModal } from "../../components/modals/edit-user-modal/index";
import "./dashboard.css";

export const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  
  const depId = user?.department?.id;
  const depName = user?.department?.name;
  const role = user.role;

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      let response;
      if (user?.role === "ADMIN") {
        response = await api.get(`/department/${depId}/users`);
        setUsers(response.data);
      } else if (user?.role === "MANAGER") {
        setUsers(user.subordinates);
      } else {
        navigate(`/dashboard/users/${user.id}/tasks`, { state: { department: depName } })
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id, depName) => {
    navigate(`./users/${id}/tasks`, { state: { department: depName } });
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <LogoutButton />
      <div className="info">
        <h3>{user.name} - {user.role}</h3>
      </div>
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
                    <Button onClick={() => handleView(user.id, depName)}>View Tasks</Button>
                   {role!="USER" && <Button onClick={() => handleEdit(user)}>Edit</Button>} 
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

      <EditUserModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        userData={selectedUser} 
        onUserUpdated={handleUserUpdated} 
      />
    </>
  );
};
