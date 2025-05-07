'use client';

import React, { useState } from 'react';
import { MdOutlineEmail } from "react-icons/md";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";

interface Props {
  formData: any;
  onChange: (field: string, value: string) => void;
}

const CredentialDetails: React.FC<Props> = ({ formData, onChange }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible(prev => !prev);

  const password = formData.password || '';

  const passwordRules = [
    {
      label: 'At least 8 characters',
      isValid: password.length >= 8,
    },
    {
      label: 'At least one uppercase letter',
      isValid: /[A-Z]/.test(password),
    },
    {
      label: 'At least one number',
      isValid: /\d/.test(password),
    },
    {
      label: 'At least one special character',
      isValid: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Email Field */}
      <div className="w-full flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 p-2">
        <MdOutlineEmail size={25} className="text-gray-400" />
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="Enter business email"
          className="w-full outline-none bg-transparent"
        />
      </div>

      {/* Password Field */}
      <div className="w-full flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 p-2 relative">
        <input
          type={passwordVisible ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={(e) => onChange('password', e.target.value)}
          placeholder="Enter password"
          className="w-full outline-none bg-transparent"
        />
        <div onClick={togglePasswordVisibility} className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2">
          {passwordVisible ? (
            <IoEyeOutline size={24} className="text-gray-400" />
          ) : (
            <IoEyeOffOutline size={24} className="text-gray-400" />
          )}
        </div>
      </div>

      {/* Password Requirements */}
      <div className="text-sm space-y-1">
        <p className="font-medium text-gray-600">Password must contain:</p>
        {passwordRules.map((rule, index) => (
          <div key={index} className="flex items-center gap-x-2 text-gray-500">
            {rule.isValid ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaRegCircle className="text-gray-400" />
            )}
            <span>{rule.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CredentialDetails;
