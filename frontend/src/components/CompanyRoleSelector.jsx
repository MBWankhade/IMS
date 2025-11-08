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
        <div>
          <input
            type="text"
            value={company}
            onChange={(e) => onCompanyChange(e.target.value)}
            className="w-full bg-gray-700 text-white rounded-lg p-3"
            placeholder="Enter Company Name"
            required
          />
        </div>
      </div>

      {/* Role Selector */}
      <div>
        <label className="block text-sm font-medium text-white mb-1">Role *</label>
        <input
          list="role-options"
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          className="w-full bg-gray-700 text-white rounded-lg p-3"
          placeholder="Select or type Role"
          required
        />
        <datalist id="role-options">
          <option value="Software Engineer" />
          <option value="Data Analyst" />
          <option value="System Engineer" />
          <option value="Full Stack Developer" />
          <option value="QA Engineer" />
        </datalist>
      </div>

      {/* Placement Type Selector */}

      <div>
        <label className="block text-sm font-medium text-white mb-1">Placement Type *</label>
        <input
          list="placement-type-options"
          value={placementType}
          onChange={(e) => onPlacementTypeChange(e.target.value)}
          className="w-full bg-gray-700 text-white rounded-lg p-3"
          placeholder="Select or type Placement Type"
          required
        />
        <datalist id="placement-type-options">
          <option value="On-Campus" />
          <option value="Off-Campus" />
          <option value="Referral" />
          <option value="Internship to Full-Time" />
        </datalist>
      </div>

    </div>
  );
};

export default CompanyRoleSelector;
