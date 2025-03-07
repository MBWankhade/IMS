import React, { useState } from 'react';
import { companies } from '../utils/utils';


const roles = [
  "Software Engineer",
  "Product Manager",
  "Data Scientist",
  "DevOps Engineer",
  "UI/UX Designer",
  "Business Analyst",
  "Marketing Manager",
  "Sales Executive",
  "HR Manager",
  "Finance Analyst"
];

const placementTypes = [
  "Placement",
  "Internship",
  "Placement And Internship",
  "Internship + Performance based PPO",
  "Industrial Training",
  "Apprenticeship"
];

const CompanyRoleSelector = ({ onCompanyChange, onRoleChange, onPlacementTypeChange }) => {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [placementType, setPlacementType] = useState('');
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const filteredCompanies = companies.filter(c => c.toLowerCase().includes(company.toLowerCase()));
  const filteredRoles = roles.filter(r => r.toLowerCase().includes(role.toLowerCase()));

  return (
    <div className="flex space-x-4">
      {/* Company Selector */}
      <div className="flex-1">
        <label htmlFor="company" className="block text-sm font-medium text-gray-700">
          Company <small style={{ color: 'red' }}>*</small>
        </label>
        <div className="relative mt-1">
          <input
            id="company"
            type="text"
            value={company}
            onChange={(e) => {
              setCompany(e.target.value);
              onCompanyChange(e.target.value); // Notify parent component
              setShowCompanyDropdown(true);
            }}
            onFocus={() => setShowCompanyDropdown(true)}
            onBlur={() => setTimeout(() => setShowCompanyDropdown(false), 200)}
            placeholder="Select or type a company"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required 
            autocomplete="off" 
          />
          {showCompanyDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredCompanies.map((comp, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setCompany(comp);
                    onCompanyChange(comp); // Notify parent component
                    setShowCompanyDropdown(false);
                  }}
                >
                  {comp}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Role Selector */}
      <div className="flex-1">
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Role <small style={{ color: 'red' }}>*</small>
        </label>
        <div className="relative mt-1">
          <input
            id="role"
            type="text"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              onRoleChange(e.target.value); // Notify parent component
              setShowRoleDropdown(true);
            }}
            onFocus={() => setShowRoleDropdown(true)}
            onBlur={() => setTimeout(() => setShowRoleDropdown(false), 200)}
            placeholder="Select or type a role"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
            autocomplete="off" 
          />
          {showRoleDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredRoles.map((rl, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setRole(rl);
                    onRoleChange(rl); // Notify parent component
                    setShowRoleDropdown(false);
                  }}
                >
                  {rl}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Placement Type Dropdown */}
      <div className="flex-1">
        <label htmlFor="placementType" className="block text-sm font-medium text-gray-700">
          Placement Type <small style={{ color: 'red' }}>*</small>
        </label>
        <div className="relative mt-1">
          <select
            id="placementType"
            value={placementType}
            onChange={(e) => {
              setPlacementType(e.target.value);
              onPlacementTypeChange(e.target.value); // Notify parent component
            }}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="" disabled>Select Placement Type</option>
            {placementTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CompanyRoleSelector;