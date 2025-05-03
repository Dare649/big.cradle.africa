import { createSlice } from "@reduxjs/toolkit";
import {
    createRequestType,
    deleteRequestType,
    getAllRequestTypes,
    getRequestType,
    updateRequestType,
    
} from "./requestType";


  
interface RequestTypeData {
    createdAt?: string;
    _id?: string;
    id: string;
    request_name: string;
    request_description: number;
}


interface RequestTypeState {
    createRequestTypeStatus:  "idle" | "isLoading" | "succeeded" | "failed";
    updateRequestTypeStatus:  "idle" | "isLoading" | "succeeded" | "failed";
    getAllRequestTypesStatus:  "idle" | "isLoading" | "succeeded" | "failed";
    deleteRequestTypeStatus:  "idle" | "isLoading" | "succeeded" | "failed";
    getRequestTypeStatus:  "idle" | "isLoading" | "succeeded" | "failed";
    Status:  "idle" | "isLoading" | "succeeded" | "failed";
    request: RequestTypeData | null;
    allRequestType: RequestTypeData[];
    error: string | null;
}


const initialState: RequestTypeState = {
    createRequestTypeStatus: "idle",
    updateRequestTypeStatus: "idle",
    getRequestTypeStatus: "idle",
    Status: "idle",
    getAllRequestTypesStatus: "idle",
    deleteRequestTypeStatus: "idle",
    request: null,
    allRequestType: [],
    error: null,
};


const requestSlice = createSlice({
    name: "request",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            // create request
            .addCase(createRequestType.pending, (state) => {
                state.createRequestTypeStatus = "isLoading";
            })
            .addCase(createRequestType.fulfilled, (state, action) => {
                state.createRequestTypeStatus = "succeeded";
            
                // Extract the request data from the response
                const newrequest = action.payload.data;
            
                // Check if the request data is valid before updating the state
                if (newrequest && newrequest._id) {
                    state.allRequestType = Array.isArray(state.allRequestType)
                        ? [...state.allRequestType, newrequest]
                        : [newrequest];
                } else {
                    console.error("Invalid request data received:", action.payload);
                }
            })
            
            
            .addCase(createRequestType.rejected, (state, action) => {
                state.createRequestTypeStatus = "failed";
                state.error = action.error.message ?? "Failed to create request"
            })


            .addCase(updateRequestType.fulfilled, (state, action) => {
                state.updateRequestTypeStatus = "succeeded";
                state.allRequestType = state.allRequestType.map((request) =>
                    request._id === action.payload._id ? action.payload : request
                );
                // Dispatch getAllRequestTypes to refresh the request list
                state.allRequestType = state.allRequestType.map((request) =>
                    request._id === action.payload._id ? action.payload : request
                );

                // Optionally, update the currently selected request if necessary
                if (state.request?._id === action.payload._id) {
                    state.request = action.payload;
                }
            })
            .addCase(updateRequestType.rejected, (state, action) => {
                state.updateRequestTypeStatus = "failed";
                state.error = action.error.message ?? "Failed to update request";
            })


            // get request by id
            .addCase(getRequestType.pending, (state) => {
                state.getRequestTypeStatus = "isLoading";
            })
            .addCase(getRequestType.fulfilled, (state, action) => {
                state.getRequestTypeStatus = "succeeded";
                state.request = action.payload;
            })
            .addCase(getRequestType.rejected, (state, action) => {
                state.getRequestTypeStatus = "failed";
                state.error = action.error.message ?? "Failed to get request";
            })

            // get requests 
            .addCase(getAllRequestTypes.pending, (state) => {
                state.getAllRequestTypesStatus = "isLoading";
            })
            .addCase(getAllRequestTypes.fulfilled, (state, action) => {
                state.getAllRequestTypesStatus = "succeeded";
                state.allRequestType = Array.isArray(action.payload) ? action.payload : [];
            })            
            .addCase(getAllRequestTypes.rejected, (state, action) => {
                state.getAllRequestTypesStatus = "failed";
                state.error = action.error.message ?? "Failed to get all requests by request";
            })


            // delete request
            .addCase(deleteRequestType.pending, (state) => {
                state.deleteRequestTypeStatus = "isLoading";
            })
            .addCase(deleteRequestType.fulfilled, (state, action) => {
                state.deleteRequestTypeStatus = "succeeded";
                state.allRequestType = Array.isArray(state.allRequestType)
                    ? state.allRequestType.filter((log) => log._id !== action.payload)
                    : [];
            
                if (state.request?._id === action.payload) {
                    state.request = null; 
                }
            })
            .addCase(deleteRequestType.rejected, (state, action) => {
                state.deleteRequestTypeStatus = "failed";
                state.error = action.error.message ?? "Failed to delete request";
            });
    },
});

export default requestSlice.reducer;