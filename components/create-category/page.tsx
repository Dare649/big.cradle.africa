'use client';

import React, { useEffect, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '@/redux/slice/loadingSlice';
import { RootState } from '@/redux/store';
import Select from 'react-select';
import { createCategory, getAllCategory, updateCategory } from '@/redux/slice/category/category';
import { useRouter } from 'next/navigation';

interface CreateCategoryProps {
    handleClose: () => void;
    categoryData?: FormState | null;
}

interface FormState {
    _id?: string;
    category_name: string;
    category_description: string;

}

const CreateCategory = ({ handleClose, categoryData }: CreateCategoryProps) => {
    const dispatch = useDispatch<any>();
    const allCategory = useSelector((state: RootState) => state.category.allCategory);
    const isLoading = useSelector((state: RootState) => state.loading.isLoading);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<FormState>({
        category_name: "",
        category_description: "",
    });

    useEffect(() => {
        if (categoryData) {
            setFormData({
                category_name: categoryData.category_name || "",
                category_description: categoryData.category_description || "",
            });
        }
    }, [categoryData]);

     useEffect(() => {
        const fetchData = async () => {
          try {
            dispatch(startLoading());
            await dispatch(getAllCategory()).unwrap();
    
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
          [name]: ["category_qty", "category_price"].includes(name) ? (value === "" ? "" : Number(value)) : value,
        }));
    };

    const handleCategoryChange = (selectedOption: any) => {
        setFormData((prevData) => ({
            ...prevData,
            category_category_id: selectedOption?.value || "",
        }));
    };


    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.category_name) newErrors.category_name = "Category name is required.";
        if (!formData.category_description) newErrors.category_description = "Category description is required.";
 
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
            if (categoryData?._id) {
                // Update the category with the correct ID in the URL
                result = await dispatch(updateCategory({
                    id: categoryData._id,
                    data: formattedData,
                }) as any).unwrap();
                dispatch(getAllCategory());
            } else {
                // Create a new category
                result = await dispatch(createCategory(formattedData) as any).unwrap();
            }
    
            if (result?.success) {
                toast.success(categoryData?._id ? "category updated successfully!" : "category created successfully!");
                handleClose();
            } else {
                throw new Error(result?.message || "Failed to submit form");
            }
        } catch (error: any) {
            console.error('Error during category submission:', error);
            toast.error(error.message || "Failed to create category, try again!");
            handleClose();
        } finally {
            dispatch(stopLoading());
        }
    };
    
    


    return (
        <div className="w-full h-[80vh] flex flex-col">
            <div className="flex items-center justify-between">
                <h2 className="font-bold lg:text-xl sm:text-lg capitalize">{categoryData?._id ? "Update category" : "Create category"}</h2>
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
                        <label htmlFor="category_name" className="text-sm font-bold uppercase text-primary-1 mb-2 block">category Name</label>
                        <input 
                            type="text" 
                            id="category_name"
                            name="category_name"
                            value={formData.category_name}
                            onChange={handleChange}
                            placeholder="Enter category name"
                            className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
                        />
                        {errors.category_name && <p className="text-red-500 text-sm">{errors.category_name}</p>}
                    </div>

                    

                    <div className="mb-3">
                        <label htmlFor="category_description" className="text-sm font-bold uppercase text-primary-1 mb-2 block">category Description</label>
                        <textarea
                            id="category_description"
                            name="category_description"
                            value={formData.category_description}
                            onChange={handleChange}
                            placeholder="Write category description"
                            rows={3}
                            className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
                        />
                        {errors.category_description && <p className="text-red-500 text-sm">{errors.category_description}</p>}
                    </div>


                    <button
                        type="submit"
                        className="rounded-lg bg-primary-1 w-full text-white hover:text-primary-1 hover:bg-transparent hover:border-2 hover:border-primary-1 outline-none py-3 cursor-pointer capitalize"
                    >
                        {isLoading ? "Processing..." : categoryData?._id ? "Update category" : "Create category"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateCategory;
