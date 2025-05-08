'use client';

import React, { useEffect, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '@/redux/slice/loadingSlice';
import { RootState } from '@/redux/store';
import { createUser, getAllUser, getBusinessUsers, updateUser } from '@/redux/slice/users/users';
import ImageUploader from '../image-upload/page';
import { getSignedInUser } from "@/redux/slice/auth/auth";


interface CreateUsersProps {
    handleClose: () => void;
    userData?: FormState | null;
}

interface FormState {
    _id?: string;
    first_name: string;
    last_name: string;
    department: string;
    email: string;
    business_user_id: string;
    password: string;
    user_img: string;
}

const CreateUsers = ({ handleClose, userData }: CreateUsersProps) => {
    const dispatch = useDispatch<any>();
    const isLoading = useSelector((state: RootState) => state.loading.isLoading);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const user = useSelector((state: RootState) => state.auth.user);
    const [formData, setFormData] = useState<FormState>({
        first_name: '',
        last_name: '',
        department: '',
        email: '',
        business_user_id: user?._id || '',
        password: '',
        user_img: '',
    });

    useEffect(() => {
        if (userData) {
            setFormData({
                business_user_id: userData.business_user_id || "",
                first_name: userData.first_name || "",
                last_name: userData.last_name || "",
                email: userData.email || "",
                department: userData.department || "",
                password: userData.password || "",
                user_img: userData.user_img || "",
            });
        }
    }, [userData, user]);

     useEffect(() => {
        const fetchData = async () => {
          try {
            dispatch(startLoading());
            await dispatch(getSignedInUser()).unwrap();
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


    const handleImageUpload = (name: string, base64String: string) => {
        setFormData((prevData) => ({
            ...prevData,
            user_img: base64String,
        }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.first_name) newErrors.first_name = "First name is required.";
        if (!formData.last_name) newErrors.last_name = "Last name is required.";
        if (!formData.email) newErrors.email = "Email is required.";
        if (!formData.department) newErrors.department = "Department is required.";
        if (!formData.password) newErrors.password = "Password is required.";
        if (!formData.user_img) newErrors.user_img = "User image is required.";
        if (!formData.business_user_id) newErrors.business_user_id = "Business ID is required.";
     
 
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
            };


            // If the data file is a URL, convert it to Base64
            if (formattedData.user_img) {
                const base64Image = await convertImageToBase64(formattedData.user_img);
                formattedData.user_img = base64Image as string;
            }
    
    
            let result;
            if (userData?._id) {
               
                result = await dispatch(updateUser({
                    id: userData._id,
                    data: formattedData,
                }) as any).unwrap();
                dispatch(getAllUser());
            } else {
                
                result = await dispatch(createUser(formattedData) as any).unwrap();
                console.log(formattedData)
            }
    
            if (result?.success) {
                toast.success(userData?._id ? "user analytics updated successfully!" : "user analytics created successfully!");
                await dispatch(getAllUser());
                window.location.reload();
                handleClose();
            } else {
                throw new Error(result?.message || "Failed to submit form");
            }
        } catch (error: any) {
            console.error('Error during user analytics submission:', error);
            toast.error(error.message || "Failed to create user analytics, try again!");
            handleClose();
        } finally {
            dispatch(stopLoading());
        }
    };
    
    
    return (
        <div className="w-full h-[80vh] flex flex-col">
            <div className="flex items-center justify-between">
                <h2 className="font-bold lg:text-xl sm:text-lg capitalize">{userData?._id ? "Update user" : "Create user"}</h2>
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
                        <label htmlFor="first_name" className="text-sm font-bold uppercase text-primary-1 mb-2 block">first name</label>
                        <input 
                            type="text" 
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="Enter first name"
                            className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
                        />
                        {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="last_name" className="text-sm font-bold uppercase text-primary-1 mb-2 block">last name</label>
                        <input 
                            type="text" 
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Enter last name"
                            className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
                        />
                        {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="text-sm font-bold uppercase text-primary-1 mb-2 block">email</label>
                        <input 
                            type="text" 
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="department" className="text-sm font-bold uppercase text-primary-1 mb-2 block">department</label>
                        <input 
                            type="text" 
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            placeholder="Enter department name"
                            className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
                        />
                        {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="text-sm font-bold uppercase text-primary-1 mb-2 block">password</label>
                        <input 
                            type="text" 
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                        {
                            userData?._id && (
                                <p className='text-tertiary-1 font-bold'>Note: Change user password to successfully update user.</p>
                            )
                        }
                    </div>

                    <div className="mb-3">
                        <ImageUploader
                        id="user_img"
                        name="user_img"
                        text="Upload User Image"
                        onChange={handleImageUpload}
                        />
                        {errors.user_img && <p className="text-red-500 text-sm">{errors.user_img}</p>}
                    </div>

                    <button
                        type="submit"
                        className="rounded-lg bg-primary-1 w-full text-white hover:text-primary-1 hover:bg-transparent hover:border-2 hover:border-primary-1 outline-none py-3 cursor-pointer capitalize"
                    >
                        {isLoading ? "creating..." : userData?._id ? "Update user" : "Create user"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateUsers;
