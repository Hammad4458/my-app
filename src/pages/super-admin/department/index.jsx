import React, { useState, useEffect } from 'react';
import {Button} from "antd";
import 'antd/dist/reset.css'; // For Ant Design v5
import './department.css'; 
import { api } from '../../../common/axios-interceptor';

export const Departments = () => {
  const [departments, setDepartment] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        console.log("Ready to fetch");
        const response = await api.get("/department"); 
        if (!response) {
          throw new Error('Failed to fetch organizations');
        }
        console.log(response.data);
        setDepartment(response.data); 
      } catch (error) {
        setError(error.message); 
      } finally {
        setLoading(false); 
      }
    };

    fetchOrganizations();
  }, []); 

  if (loading) {
    return <div className="loading">Loading...</div>;
  }



  return (
    <div className="organizations-page">
      {/* Create Organization Button */}
      <div className="create-org-button-container">
        <Button type='Primary' className="create-org-button">Create Department</Button>
      </div>

      {/* Table for Organizations */}
      <table className="organizations-table">
        <thead>
          <tr>
            <th>Department</th>
            <th>Organization</th>
            <th>SuperAdmin</th>
            <th>Users</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dep) => (
            <tr key={dep.id}>
              <td>{dep.name}</td>
              <td>
                {dep.organizations.length > 0
                  ? dep.organizations.map((org)=>org.name).join(', ') // Display departments as comma-separated list
                  : 'No departments assigned'}
              </td>
              <td>
              {dep.superAdmin.name}
              </td>
              <td>
                {dep.users.length > 0
                  ? dep.users.join(', ') // Display users as comma-separated list
                  : 'No users assigned'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="create-user-button-container">
        <Button type='Primary' className="create-user-button">Create User</Button>
      </div>
    </div>
  );
};