import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

  
interface UserDetails {
    first_name: string;
    last_name: string;
    department: string;
    email: string;
    business_user_id: string;
    password: string;
    user_img: string;
}

export const createUser = createAsyncThunk(
    "users/createUser",
    async (data: UserDetails, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/api/v1/users/create_user", data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to create request type, try again"
            });
        }
    }
);


// update users
export const updateUser = createAsyncThunk(
    "users/updateUser",
    async ({ id, data}: { id: string; data: UserDetails}, { rejectWithValue}) => {
        try {
            const response = await axiosInstance.put(`/api/v1/users/update_user/${id}`, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to update request type, try again"
            });   
        }
    }
);


export const getUser = createAsyncThunk(
    "users/getUser",
    async (usersId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/users/get_user/${usersId}`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getBusinessUsers = createAsyncThunk(
    "users/getBusinessUsers",
    async (businessId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/users/get_user_by_business/${businessId}`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


export const deleteUser = createAsyncThunk<string, string, { rejectValue: {message: string}}>(
    "users/deleteUser",
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/api/v1/users/delete_user/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message 
            });
        }
    }
);


export const getAllUser = createAsyncThunk(
    "users/getAllUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/users/get_users`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message 
            });
        }
    }
)

export const getBusinessCount = createAsyncThunk(
    "users/getBusinessCount",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/users/total_count`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message 
            });
        }
    }
)

