import React, { useState, useEffect } from 'react';
import './organization.css'; 
import { api } from '../../../common/axios-interceptor';
import axios from 'axios';

export const Organizations = () => {
  const [organizations, setOrganizations] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        console.log("Ready to fetch");
        const response = await api.get("/organization"); 
        if (!response) {
          throw new Error('Failed to fetch organizations');
        }
        console.log(response.data);
        setOrganizations(response.data); 
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
        <button className="create-org-button">Create Organization</button>
      </div>

      {/* Table for Organizations */}
      <table className="organizations-table">
        <thead>
          <tr>
            <th>Organization Name</th>
            <th>Department</th>
            <th>SuperAdmin</th>
            <th>Users</th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((org) => (
            <tr key={org.id}>
              <td>{org.name}</td>
              <td>
                {org.departments.length > 0
                  ? org.departments.map((dep)=>dep.name).join(', ') // Display departments as comma-separated list
                  : 'No departments assigned'}
              </td>
              <td>
              {org.superAdmins.length > 0
                  ? org.superAdmins.map((admin) => admin.name).join(', ') 
                  : 'No superAdmins assigned'}
              </td>
              <td>
                {org.users.length > 0
                  ? org.users.join(', ') // Display users as comma-separated list
                  : 'No users assigned'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};