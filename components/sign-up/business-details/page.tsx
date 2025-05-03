'use client';

import React, { useState } from 'react';
import { IoBusinessOutline } from "react-icons/io5";
import { LuMapPin } from "react-icons/lu";
import { FaTreeCity } from "react-icons/fa6";
import { TbBuildingEstate } from "react-icons/tb";
import { BsPinMapFill } from "react-icons/bs";
import ImageUploader from '@/components/image-upload/page';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

interface Props {
  formData: any;
  onChange: (field: string, value: string) => void;
}

const BusinessDetails: React.FC<Props> = ({ formData, onChange }) => {
  const [country, setCountry] = useState<string>(formData.business_country || '');
  const [region, setRegion] = useState<string>(formData.business_state || '');

  const handleCountryChange = (val: string) => {
    setCountry(val);
    setRegion('');
    onChange('business_country', val);
  };

  const handleRegionChange = (val: string) => {
    setRegion(val);
    onChange('business_state', val);
  };


  const handleImageUpload = (name: string, base64String: string) => {
    onChange(name, base64String);
  };


  return (
    <div className="space-y-6">

      <div className="w-full flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 p-2">
        <IoBusinessOutline className="text-lg text-gray-500" />
        <input
          type="text"
          name="business_name"
          value={formData.business_name}
          onChange={(e) => onChange('business_name', e.target.value)}
          placeholder="Enter your business name"
          className="flex-1 outline-none bg-transparent placeholder:text-sm"
        />
      </div>

      <div className="w-full flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 p-2">
        <TbBuildingEstate className="text-lg text-gray-500" />
        <input
          type="text"
          name="business_address"
          value={formData.business_address}
          onChange={(e) => onChange('business_address', e.target.value)}
          placeholder="Enter your business address"
          className="flex-1 outline-none bg-transparent placeholder:text-sm"
        />
      </div>

      <div className="w-full flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 p-2">
        <span className="text-lg text-gray-500">
          <BsPinMapFill />
        </span>
        <CountryDropdown
          value={country}
          onChange={handleCountryChange}
          className="flex-1 outline-none bg-transparent text-sm"
          defaultOptionLabel="Select a country"
          style={{ appearance: 'none' }}  // Removes the default dropdown icon
        />
      </div>



      <div className="w-full flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 p-2">
      <span className="text-lg text-gray-500">
        <BsPinMapFill />
      </span>
        <RegionDropdown
          country={country}
          value={region}
          onChange={handleRegionChange}
          className="flex-1 outline-none bg-transparent text-sm"
          defaultOptionLabel="Select a state"
          style={{ appearance: 'none' }} 
        />
      </div>

 
      <div className="w-full flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 p-2">
        <FaTreeCity className="text-lg text-gray-500" />
        <input
          type="text"
          name="business_city"
          value={formData.business_city}
          onChange={(e) => onChange('business_city', e.target.value)}
          placeholder="Enter your city"
          className="flex-1 outline-none bg-transparent placeholder:text-sm"
        />
      </div>
   
      <div className="mb-3">
        <ImageUploader
          id="user_img"
          name="user_img"
          text="Upload User Image"
          onChange={handleImageUpload}
        />
      </div>
    </div>
  );
};

export default BusinessDetails;
