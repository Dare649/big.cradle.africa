'use client';


import React, { useState} from 'react';
import { MdOutlineEmail } from "react-icons/md";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";


interface Props {
  formData: any;
  onChange: (field: string, value: string) => void;
}

const CredentialDetails: React.FC<Props> = ({ formData, onChange }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);


    // Function to toggle password visibility
  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);
  
  return (
    <div>
      {/* Business Name */}
      <div className="w-full flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 lg:p-2 sm:p-1 mb-5">
        <MdOutlineEmail size={25} className="text-gray-400 font-bold" />
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="Enter business email"
          className="w-full outline-none border-none bg-transparent"
        />
      </div>

      <div className="w-full flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 lg:p-2 sm:p-1 mb-5">
        <div
            onClick={togglePasswordVisibility}
            className='cursor-pointer'
        >
            {passwordVisible ? (
                <IoEyeOutline size={25} className="text-gray-400 font-bold"/>
            ) : (
                <IoEyeOffOutline size={25} className="text-gray-400 font-bold"/>
            )}
        </div>
        <input
          type={passwordVisible ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={(e) => onChange('password', e.target.value)}
          placeholder="Enter password"
          className="w-full outline-none border-none bg-transparent"
        />
      </div>
    </div>
  );
};

export default CredentialDetails;
