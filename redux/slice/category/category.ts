import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

  
interface Category {
    category_name: string;
    category_description: string;
}

export const createCategory = createAsyncThunk(
    "category/createCategory",
    async (data: Category, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/api/v1/category/create_category", data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to create category, try again"
            });
        }
    }
);


// update category
export const updateCategory = createAsyncThunk(
    "category/updateCategory",
    async ({ id, data}: { id: string; data: Category}, { rejectWithValue}) => {
        try {
            const response = await axiosInstance.put(`/api/v1/category/update_category/${id}`, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to update category, try again"
            });   
        }
    }
);


export const getCategory = createAsyncThunk(
    "category/getCategory",
    async (categoryId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/category/get_category/${categoryId}`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


export const deleteCategory = createAsyncThunk<string, string, { rejectValue: {message: string}}>(
    "category/deleteCategory",
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/api/v1/category/delete_category/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to delete category, try again"
            });
        }
    }
);


export const getAllCategory = createAsyncThunk(
    "category/getAllCategory",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/category/get_categoryies`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to get categorys, try again"
            });
        }
    }
)

