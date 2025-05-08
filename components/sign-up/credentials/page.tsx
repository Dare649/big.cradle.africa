'use client';

import React, { useState } from 'react';
import { MdOutlineEmail } from 'react-icons/md';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';

interface Props {
  formData: {
    email: string;
    password: string;
  };
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
      label: 'A maximum of 15 characters',
      isValid: password.length > 0 && password.length <= 15,
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
      <div className="flex items-center gap-2 border-b-2 border-gray-300 focus-within:border-primary-1 p-2">
        <MdOutlineEmail size={20} className="text-gray-400" />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="Email"
          className="w-full outline-none bg-transparent"
        />
      </div>

      {/* Password Field */}
      <div className="flex items-center gap-2 border-b-2 border-gray-300 focus-within:border-primary-1 p-2">
        <button type="button" onClick={togglePasswordVisibility}>
          {passwordVisible ? (
            <IoEyeOutline size={20} className="text-gray-400" />
          ) : (
            <IoEyeOffOutline size={20} className="text-gray-400" />
          )}
        </button>
        <input
          type={passwordVisible ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={(e) => onChange('password', e.target.value)}
          placeholder="Password"
          className="w-full outline-none bg-transparent"
        />
      </div>

      {/* Password Rules */}
      <div className="space-y-1">
        {passwordRules.map((rule, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
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
