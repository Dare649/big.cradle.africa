import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

  
interface RequestType {
    request_name: string;
    request_description: string;
}

export const createRequestType = createAsyncThunk(
    "requestType/createRequestType",
    async (data: RequestType, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/api/v1/request_type/create_request_type", data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to create request type, try again"
            });
        }
    }
);


// update requestType
export const updateRequestType = createAsyncThunk(
    "requestType/updateRequestType",
    async ({ id, data}: { id: string; data: RequestType}, { rejectWithValue}) => {
        try {
            const response = await axiosInstance.put(`/api/v1/request_type/update_request_type/${id}`, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to update request type, try again"
            });   
        }
    }
);


export const getRequestType = createAsyncThunk(
    "requestType/getRequestType",
    async (requestTypeId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/request_type/get_request_type/${requestTypeId}`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


export const deleteRequestType = createAsyncThunk<string, string, { rejectValue: {message: string}}>(
    "requestType/deleteRequestType",
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/api/v1/request_type/delete_request_type/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to delete request type, try again"
            });
        }
    }
);


export const getAllRequestTypes = createAsyncThunk(
    "requestType/getAllRequestTypes",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/request_type/get_all_request_type`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to get request types, try again"
            });
        }
    }
)

