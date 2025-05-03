'use client';

import React, { useState } from 'react';
import { IoBusinessOutline } from "react-icons/io5";
import { LuMapPin } from "react-icons/lu";
import { FaTreeCity } from "react-icons/fa6";
import { TbBuildingEstate } from "react-icons/tb";
import { BsPinMapFill } from "react-icons/bs";
import ImageUploader from '@/components/image-upload/page';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import Select from 'react-select'

interface Props {
  formData: any;
  onChange: (field: string, value: string) => void;
}

const IndstrialDetails: React.FC<Props> = ({ formData, onChange }) => {
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


  const sectors = [
    'Agriculture',
    'Automotive',
    'Construction',
    'Education',
    'Energy',
    'Finance',
    'Healthcare',
    'Hospitality',
    'IT',
    'Manufacturing',
    'Retail',
    'Telecommunications',
  ];

  const organizationSizes = [
    { label: 'Small Scale (1 - 100 employees)', value: '1-100' },
    { label: 'Medium Scale (101 - 500 employees)', value: '101-500' },
    { label: 'Large Scale (501 - 1000 employees)', value: '501-1000' },
  ];

  return (
    <div className="space-y-6 w-full">

      {/* Sector Select */}
      <div className="w-full flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 p-2">
        <IoBusinessOutline className="text-lg text-gray-500" />
        <div className="w-full">
          <Select
            options={sectors.map((sector) => ({ label: sector, value: sector }))}
            value={
              formData.sector
                ? { label: formData.sector, value: formData.sector }
                : null
            }
            onChange={(selectedOption) =>
              onChange('sector', selectedOption?.value || '')
            }
            placeholder="Select sector"
            className="w-full"
            menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
            styles={{
              menuPortal: base => ({ ...base, zIndex: 9999 }),
              menu: base => ({ ...base, zIndex: 9999 }),
              control: (base) => ({
                ...base,
                border: 'none', // Remove border
                boxShadow: 'none', // Remove box shadow
                '&:hover': {
                  border: 'none', // Remove hover border
                },
              }),
              dropdownIndicator: (base) => ({
                ...base,
                color: '#4B5563', // Customize icon color (optional)
              }),
              indicatorSeparator: (base) => ({
                ...base,
                display: 'none', // Hide separator line between indicator and dropdown
              }),
            }}
          />
        </div>
      </div>

      {/* Organization Size Select */}
      <div className="w-full flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 p-2">
        <IoBusinessOutline className="text-lg text-gray-500" />
        <div className="w-full">
          <Select
            options={organizationSizes}
            value={
              organizationSizes.find(
                (size) => size.value === formData.organization_size
              ) || null
            }
            onChange={(selectedOption) =>
              onChange('organization_size', selectedOption?.value || '')
            }
            placeholder="Select organization size"
            className="w-full"
            menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
            styles={{
              menuPortal: base => ({ ...base, zIndex: 9999 }),
              menu: base => ({ ...base, zIndex: 9999 }),
              control: (base) => ({
                ...base,
                border: 'none', // Remove border
                boxShadow: 'none', // Remove box shadow
                '&:hover': {
                  border: 'none', // Remove hover border
                },
              }),
              dropdownIndicator: (base) => ({
                ...base,
                color: '#4B5563', // Customize icon color (optional)
              }),
              indicatorSeparator: (base) => ({
                ...base,
                display: 'none', // Hide separator line between indicator and dropdown
              }),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default IndstrialDetails;
