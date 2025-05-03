'use client';

import React, { useEffect, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '@/redux/slice/loadingSlice';
import { RootState } from '@/redux/store';
import { createRequestType, getAllRequestTypes, updateRequestType } from '@/redux/slice/request-type/requestType';
import { useRouter } from 'next/navigation';

interface CreateRequestTypeProps {
    handleClose: () => void;
    requestData?: FormState | null;
}

interface FormState {
    _id?: string;
    request_name: string;
    request_description: string;

}

const CreateRequestType = ({ handleClose, requestData }: CreateRequestTypeProps) => {
    const dispatch = useDispatch<any>();
    const allRequest = useSelector((state: RootState) => state.request.allRequestType);
    const isLoading = useSelector((state: RootState) => state.loading.isLoading);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<FormState>({
        request_name: "",
        request_description: "",
    });

    useEffect(() => {
        if (requestData) {
            setFormData({
                request_name: requestData.request_name || "",
                request_description: requestData.request_description || "",
            });
        }
    }, [requestData]);

     useEffect(() => {
        const fetchData = async () => {
          try {
            dispatch(startLoading());
            await dispatch(getAllRequestTypes()).unwrap();
    
          } catch (error: any) {
            toast.error(error.message || "Failed to fetch categories");
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
          [name]: ["request_qty", "request_price"].includes(name) ? (value === "" ? "" : Number(value)) : value,
        }));
    };


    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.request_name) newErrors.request_name = "request name is required.";
        if (!formData.request_description) newErrors.request_description = "request description is required.";
 
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!validateForm()) return;
    
        dispatch(startLoading());
    
        try {
            const formattedData = {
                ...formData,
            };
    
    
            let result;
            if (requestData?._id) {
                // Update the request with the correct ID in the URL
                result = await dispatch(updateRequestType({
                    id: requestData._id,
                    data: formattedData,
                }) as any).unwrap();
                dispatch(getAllRequestTypes());
            } else {
                // Create a new request
                result = await dispatch(createRequestType(formattedData) as any).unwrap();
            }
    
            if (result?.success) {
                toast.success(requestData?._id ? "request updated successfully!" : "request created successfully!");
                handleClose();
            } else {
                throw new Error(result?.message || "Failed to submit form");
            }
        } catch (error: any) {
            console.error('Error during request submission:', error);
            toast.error(error.message || "Failed to create request, try again!");
            handleClose();
        } finally {
            dispatch(stopLoading());
        }
    };
    
    


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
                        <label htmlFor="request_name" className="text-sm font-bold uppercase text-primary-1 mb-2 block">request Name</label>
                        <input 
                            type="text" 
                            id="request_name"
                            name="request_name"
                            value={formData.request_name}
                            onChange={handleChange}
                            placeholder="Enter request name"
                            className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
                        />
                        {errors.request_name && <p className="text-red-500 text-sm">{errors.request_name}</p>}
                    </div>

                    

                    <div className="mb-3">
                        <label htmlFor="request_description" className="text-sm font-bold uppercase text-primary-1 mb-2 block">request Description</label>
                        <textarea
                            id="request_description"
                            name="request_description"
                            value={formData.request_description}
                            onChange={handleChange}
                            placeholder="Write request description"
                            rows={3}
                            className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
                        />
                        {errors.request_description && <p className="text-red-500 text-sm">{errors.request_description}</p>}
                    </div>


                    <button
                        type="submit"
                        className="rounded-lg bg-primary-1 w-full text-white hover:text-primary-1 hover:bg-transparent hover:border-2 hover:border-primary-1 outline-none py-3 cursor-pointer capitalize"
                    >
                        {isLoading ? "Processing..." : requestData?._id ? "Update request" : "Create request"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateRequestType;
