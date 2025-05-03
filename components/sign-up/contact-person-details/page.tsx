'use client';

import React, { useEffect, useState } from 'react';
import { LuUser } from "react-icons/lu";
import { MdOutlineSettingsPhone } from "react-icons/md";


interface Props {
  formData: any;
  onChange: (field: string, value: string) => void;
}

const ContactDetails: React.FC<Props> = ({ formData, onChange }) => {
  
  return (
    <div>
      {/* Business Name */}
      <div className="w-full flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 lg:p-2 sm:p-1 mb-5">
        <LuUser size={25} className="text-gray-400 font-bold" />
        <input
          type="text"
          name="contact_name"
          value={formData.contact_name}
          onChange={(e) => onChange('contact_name', e.target.value)}
          placeholder="Enter contact person name"
          className="w-full outline-none border-none bg-transparent"
        />
      </div>

      <div className="w-full flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 lg:p-2 sm:p-1 mb-5">
        <MdOutlineSettingsPhone size={25} className="text-gray-400 font-bold" />
        <input
          type="text"
          name="contact_number"
          value={formData.contact_number}
          onChange={(e) => onChange('contact_number', e.target.value)}
          placeholder="Enter contact person phone number"
          className="w-full outline-none border-none bg-transparent"
        />
      </div>
    </div>
  );
};

export default ContactDetails;
