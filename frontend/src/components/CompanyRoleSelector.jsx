import React from "react";

const CompanyRoleSelector = ({
  company,
  role,
  placementType,
  onCompanyChange,
  onRoleChange,
  onPlacementTypeChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Company Selector */}
      <div>
        <label className="block text-sm font-medium text-white mb-1">Company *</label>
        <select
          value={company}
          onChange={(e) => onCompanyChange(e.target.value)}
          className="w-full bg-gray-700 text-white rounded-lg p-3"
          required
        >
          <option value="">Select Company</option>
          <option value="Accenture">Accenture</option>
          <option value="TCS">TCS</option>
          <option value="Infosys">Infosys</option>
          <option value="Wipro">Wipro</option>
          <option value="Cognizant">Cognizant</option>
        </select>
      </div>

      {/* Role Selector */}
      <div>
        <label className="block text-sm font-medium text-white mb-1">Role *</label>
        <select
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          className="w-full bg-gray-700 text-white rounded-lg p-3"
          required
        >
          <option value="">Select Role</option>
          <option value="Software Engineer">Software Engineer</option>
          <option value="Data Analyst">Data Analyst</option>
          <option value="System Engineer">System Engineer</option>
          <option value="Full Stack Developer">Full Stack Developer</option>
          <option value="QA Engineer">QA Engineer</option>
        </select>
      </div>

      {/* Placement Type Selector */}
      <div>
        <label className="block text-sm font-medium text-white mb-1">Placement Type *</label>
        <select
          value={placementType}
          onChange={(e) => onPlacementTypeChange(e.target.value)}
          className="w-full bg-gray-700 text-white rounded-lg p-3"
          required
        >
          <option value="">Select Placement Type</option>
          <option value="On-Campus">On-Campus</option>
          <option value="Off-Campus">Off-Campus</option>
          <option value="Referral">Referral</option>
          <option value="Internship to Full-Time">Internship to Full-Time</option>
        </select>
      </div>
    </div>
  );
};

export default CompanyRoleSelector;
