import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

  
interface RequestAnalytics {
    user_id: string;
    business_user_id: string;
    data_title: string;
    data_description: string;
    data_file: string;
    request_type_id: string;
    category_id: string;
    data_consent: number;
}

export const createRequestAnalytics = createAsyncThunk(
    "requestAnalytics/createRequestAnalytics",
    async (data: RequestAnalytics, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/api/v1/request_analytics/create_request_analytics", data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to create request type, try again"
            });
        }
    }
);


export const updateRequestAnalytics = createAsyncThunk(
    "requestAnalytics/updateRequestAnalytics",
    async ({ id, data}: { id: string; data: RequestAnalytics}, { rejectWithValue}) => {
        try {
            const response = await axiosInstance.put(`/api/v1/request_analytics/update_request_analytics/${id}`, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to update request type, try again"
            });   
        }
    }
);


// export const updateRequestAnalyticsStatus = createAsyncThunk(
//     "requestAnalytics/updateRequestAnalyticsStatus",
//     async ({ id}: { id: string}, { rejectWithValue}) => {
//         try {
//             const response = await axiosInstance.put(`/api/v1/request_analytics/update_request_analytics_status/${id}`);
//             return response.data;
//         } catch (error: any) {
//             return rejectWithValue({
//                 message: error.response?.data?.message || error.message || "Failed to update request type, try again"
//             });   
//         }
//     }
// );


export const getRequestAnalytics = createAsyncThunk(
    "requestAnalytics/getRequestAnalytics",
    async (requestId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/request_analytics/get_request_analytics/${requestId}`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


export const getRequestAnalyticsByBusiness = createAsyncThunk(
    "requestAnalytics/getRequestAnalyticsByBusiness",
    async (businessId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/request_analytics/get_request_analytics/by_business/${businessId}`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getRequestAnalyticsByBusinessUser = createAsyncThunk(
    "requestAnalytics/getRequestAnalyticsByBusinessUser",
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/request_analytics/get_request_analytics/by_bussiness_user/${userId}`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


export const getRequestAnalyticsCountByBusiness = createAsyncThunk(
    "requestAnalytics/getRequestAnalyticsCountByBusiness",
    async (businessId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/request_analytics/get_total_request_analytics_count_by_user_id/${businessId}`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


export const deleteRequestAnalytics = createAsyncThunk<string, string, { rejectValue: {message: string}}>(
    "requestAnalytics/deleteRequestAnalytics",
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/api/v1/request_analytics/delete_request_analytics/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to delete request type, try again"
            });
        }
    }
);

export const updateRequestAnalyticsStatus = createAsyncThunk<string, string, { rejectValue: {message: string}}>(
   "requestAnalytics/updateRequestAnalyticsStatus",
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.put(`/api/v1/request_analytics/update_request_analytics_status/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to delete request type, try again"
            });
        }
    }
);


export const getAllRequestAnalytics = createAsyncThunk(
    "requestAnalytics/getAllRequestAnalytics",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/request_analytics/get_request_analytics`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to get request types, try again"
            });
        }
    }
)


export const getRequestAnalyticsCount = createAsyncThunk(
    "requestAnalytics/getRequestAnalyticsCount",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/request_analytics/get_total_request_analytics_count`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to get request types, try again"
            });
        }
    }
)

