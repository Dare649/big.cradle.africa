'use client';

import React, { useEffect, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '@/redux/slice/loadingSlice';
import { RootState } from '@/redux/store';
import Select from 'react-select';
import { createRequestAnalytics, getAllRequestAnalytics, updateRequestAnalytics } from '@/redux/slice/request-analytics/requestAnalytics';
import FileUploader from '../file-upload/page';
import { getSignedInUser } from "@/redux/slice/auth/auth";
import { getAllRequestTypes } from '@/redux/slice/request-type/requestType';
import { getAllCategory } from '@/redux/slice/category/category';

interface CreateRequestAnalyticsProps {
    handleClose: () => void;
    requestData?: FormState | null;
}

interface FormState {
    _id?: string;
    user_id: string;
    business_user_id: string;
    data_title: string;
    data_description: string;
    data_file: string;
    request_type_id: string;
    category_id: string;
    data_consent: number;
}

const CreateRequestAnalytics = ({ handleClose, requestData }: CreateRequestAnalyticsProps) => {
    const dispatch = useDispatch<any>();
    const allCategory = useSelector((state: RootState) => state.category.allCategory);
    const allRequestType = useSelector((state: RootState) => state.request.allRequestType);
    const isLoading = useSelector((state: RootState) => state.loading.isLoading);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const user = useSelector((state: RootState) => state.auth.user);
    const [formData, setFormData] = useState<FormState>({
        user_id: user?._id || '',
        business_user_id:
        user?.role === 'user'
          ? user?.business_user_id || ''
          : user?._id || '',
        data_title: '',
        data_description: '',
        data_file: '',
        request_type_id: '',
        category_id: '',
        data_consent: 0,
    });
    

    // Update user_id and business_user_id when user loads
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        user_id: user._id || '',
        business_user_id:
          user.role === 'user'
            ? user.business_user_id || ''
            : user._id || '',
      }));
    }
  }, [user]);

    useEffect(() => {
        if (requestData) {
            setFormData({
                user_id: requestData.user_id || "",
                business_user_id: requestData.business_user_id || "",
                data_title: requestData.data_title || "",
                data_description: requestData.data_description || "",
                data_file: requestData.data_file || "",
                request_type_id: requestData.request_type_id || "",
                category_id: requestData.category_id || "",
                data_consent: requestData.data_consent || 0,
            });
        }
    }, [requestData]);

     useEffect(() => {
        const fetchData = async () => {
          try {
            dispatch(startLoading());
            await dispatch(getAllRequestAnalytics()).unwrap();
            await dispatch(getSignedInUser()).unwrap();
            await dispatch(getAllCategory()).unwrap();
            await dispatch(getAllRequestTypes()).unwrap();
          } catch (error: any) {
            toast.error(error.message || "Failed to fetch data");
          } finally {
            dispatch(stopLoading());
          }
        };
    
        fetchData();
      }, [dispatch]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: ["category_qty", "category_price"].includes(name) ? (value === "" ? "" : Number(value)) : value,
        }));
    };

    const handleCategoryChange = (selectedOption: any) => {
        setFormData((prevData) => ({
            ...prevData,
            category_id: selectedOption?.value || "",
        }));
    };


    const handleRequestTypeChange = (selectedOption: any) => {
        setFormData((prevData) => ({
            ...prevData,
            request_type_id: selectedOption?.value || "",
        }));
    };



    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.data_title) newErrors.data_title = "Request Analytics title is required.";
        if (!formData.data_description) newErrors.data_description = "Request Analytics description is required.";
        if (!formData.data_file) newErrors.data_file = "Request Analytics file is required.";
        if (!formData.category_id) newErrors.category_id = "Request Analytics category is required.";
        if (!formData.request_type_id) newErrors.request_type_id = "Request Analytics request type is required.";
        if (!formData.user_id) newErrors.user_id = "Request Analytics business id is required.";
        if (!formData.business_user_id) newErrors.business_user_id = "Request Analytics business id is required.";
        if (!formData.data_consent) newErrors.data_consent = "Request Analytics data consent is required.";
 
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    
    const convertImageToBase64 = async (url: string) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result);
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!validateForm()) return;
    
        dispatch(startLoading());
    
        try {
            const formattedData = {
                ...formData,
                user_id: formData.user_id,
                business_user_id: formData.business_user_id,
            };


            // If the data file is a URL, convert it to Base64
            if (formattedData.data_file) {
                const base64Image = await convertImageToBase64(formattedData.data_file);
                formattedData.data_file = base64Image as string;
            }
    
    
            let result;
            if (requestData?._id) {
               
                result = await dispatch(updateRequestAnalytics({
                    id: requestData._id,
                    data: formattedData,
                }) as any).unwrap();
                dispatch(getAllRequestAnalytics());
            } else {
                
                result = await dispatch(createRequestAnalytics(formattedData) as any).unwrap();
            }
    
            if (result?.success) {
                toast.success(requestData?._id ? "request analytics updated successfully!" : "request analytics created successfully!");
                handleClose();
            } else {
                throw new Error(result?.message || "Failed to submit form");
            }
        } catch (error: any) {
            console.error('Error during request analytics submission:', error);
            toast.error(error.message || "Failed to create request analytics, try again!");
            handleClose();
        } finally {
            dispatch(stopLoading());
        }
    };
    
    

    const categoryOptions = allCategory.map((item) => ({
        value: item._id,
        label: item.category_name,
    }));

    const requestTypeOptions = allRequestType.map((item) => ({
        value: item._id,
        label: item.request_name,
    }));

    return (
        <div className="w-full h-[80vh] flex flex-col">
            <div className="flex items-center justify-between">
                <h2 className="font-bold lg:text-xl sm:text-lg capitalize">{requestData?._id ? "Update request" : "Create request"}</h2>
                <div onClick={handleClose}>
                    <IoMdClose size={30} className="text-red-500 cursor-pointer" />
                </div>
            </div>

            <div className="pt-3 pb-2">
                <hr className="w-full border-none h-0.5 bg-gray-300" />
            </div>

            <div className="w-full lg:p-3 sm:p-2 flex-1 overflow-y-auto custom-scroll">
                <form className="w-full" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="data_title" className="text-sm font-bold uppercase text-primary-1 mb-2 block">request title</label>
                        <input 
                            type="text" 
                            id="data_title"
                            name="data_title"
                            value={formData.data_title}
                            onChange={handleChange}
                            placeholder="Enter category name"
                            className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
                        />
                        {errors.data_title && <p className="text-red-500 text-sm">{errors.data_title}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="text-sm font-bold uppercase text-primary-1 mb-2 block">data category</label>
                        <Select
                            name="category_id"
                            value={requestTypeOptions.find(option => option.value === formData.category_id)}
                            onChange={handleCategoryChange}
                            options={requestTypeOptions}
                            placeholder="Select a request category"
                            classNamePrefix="react-select"
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    borderColor: errors.category_id ? "red" : "rgba(209, 213, 219, 1)", // Gray-300
                                    borderWidth: "2px",
                                    borderRadius: "0.5rem",
                                }),
                            }}
                        />
                        {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="text-sm font-bold uppercase text-primary-1 mb-2 block">analytics type</label>
                        <Select
                            name="request_type_id"
                            value={categoryOptions.find(option => option.value === formData.request_type_id)}
                            onChange={handleRequestTypeChange}
                            options={categoryOptions}
                            placeholder="Select a request category"
                            classNamePrefix="react-select"
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    borderColor: errors.request_type_id ? "red" : "rgba(209, 213, 219, 1)", // Gray-300
                                    borderWidth: "2px",
                                    borderRadius: "0.5rem",
                                }),
                            }}
                        />
                        {errors.request_type_id && <p className="text-red-500 text-sm">{errors.request_type_id}</p>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="data_description" className="text-sm font-bold uppercase text-primary-1 mb-2 block">analytics Description</label>
                        <textarea
                            id="data_description"
                            name="data_description"
                            value={formData.data_description}
                            onChange={handleChange}
                            placeholder="Write analytics description"
                            rows={3}
                            className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
                        />
                        {errors.data_description && <p className="text-red-500 text-sm">{errors.data_description}</p>}
                    </div>

                    <div className="mb-3">
                        <FileUploader
                            onChange={(name, value) => setFormData({ ...formData, [name]: value })}
                            text="Upload file"
                            id="doc-upload"
                            name="data_file"
                        />

                        {errors.data_file && <p className="text-red-500 text-sm">{errors.data_file}</p>}
                    </div>

                    <div className="w-full mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Do you consent to share this data?</label>
                    <div className="flex gap-6">
                        <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="data_consent"
                            value="1"
                            checked={formData.data_consent === 1}
                            onChange={() => setFormData({ ...formData, data_consent: 1 })}
                            className="form-radio text-blue-600"
                        />
                        <span className="ml-2">Yes</span>
                        </label>

                        <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="data_consent"
                            value="0"
                            checked={formData.data_consent === 0}
                            onChange={() => setFormData({ ...formData, data_consent: 0 })}
                            className="form-radio text-blue-600"
                        />
                        <span className="ml-2">No</span>
                        </label>
                    </div>
                    {errors.data_consent && <p className="text-red-500 text-sm mt-1">{errors.data_consent}</p>}
                    </div>

                    <button
                        type="submit"
                        className="rounded-lg bg-primary-1 w-full text-white hover:text-primary-1 hover:bg-transparent hover:border-2 hover:border-primary-1 outline-none py-3 cursor-pointer capitalize"
                    >
                        {isLoading ? "Processing..." : requestData?._id ? "Update category" : "Create category"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateRequestAnalytics;
