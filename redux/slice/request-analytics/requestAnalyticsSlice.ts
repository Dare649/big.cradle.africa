import { createSlice } from "@reduxjs/toolkit";
import {
    createRequestAnalytics,
    deleteRequestAnalytics,
    getAllRequestAnalytics,
    getRequestAnalytics,
    updateRequestAnalytics,
    getRequestAnalyticsByBusiness,
    getRequestAnalyticsCount,
    getRequestAnalyticsCountByBusiness,
    updateRequestAnalyticsStatus,
    getRequestAnalyticsByBusinessUser
} from "./requestAnalytics";


  
interface RequestAnalyticsData {
    createdAt?: string;
    _id?: string;
    id: string;
    user_id: string;
    business_user_id: string;
    data_title: string;
    data_description: string;
    data_file: string;
    request_type_id: string;
    category_id: string;
    data_consent: number;
}


interface RequestAnalyticsState {
    createRequestAnalyticsStatus:  "idle" | "isLoading" | "succeeded" | "failed";
    updateRequestAnalyticsStatus:  "idle" | "isLoading" | "succeeded" | "failed";
    updateRequestAnalyticsStatusStatus:  "idle" | "isLoading" | "succeeded" | "failed";
    getAllRequestAnalyticsStatus:  "idle" | "isLoading" | "succeeded" | "failed";
    deleteRequestAnalyticsStatus:  "idle" | "isLoading" | "succeeded" | "failed";
    getRequestAnalyticsStatus:  "idle" | "isLoading" | "succeeded" | "failed";
    getRequestAnalyticsByBusinessStatus:  "idle" | "isLoading" | "succeeded" | "failed";
    getRequestAnalyticsByBusinessUserStatus:  "idle" | "isLoading" | "succeeded" | "failed";
    getRequestAnalyticsCountStatus:  "idle" | "isLoading" | "succeeded" | "failed";
    getRequestAnalyticsCountByBusinessStatus:  "idle" | "isLoading" | "succeeded" | "failed";
    Status:  "idle" | "isLoading" | "succeeded" | "failed";
    request: RequestAnalyticsData | null;
    allRequestAnalytics: RequestAnalyticsData[];
    businessUserAnalytics: RequestAnalyticsData[];
    error: string | null;
}


const initialState: RequestAnalyticsState = {
    createRequestAnalyticsStatus: "idle",
    updateRequestAnalyticsStatus: "idle",
    updateRequestAnalyticsStatusStatus: "idle",
    getRequestAnalyticsStatus: "idle",
    getRequestAnalyticsByBusinessStatus: "idle",
    getRequestAnalyticsByBusinessUserStatus: "idle",
    Status: "idle",
    getAllRequestAnalyticsStatus: "idle",
    deleteRequestAnalyticsStatus: "idle",
    getRequestAnalyticsCountStatus: "idle",
    getRequestAnalyticsCountByBusinessStatus: "idle",
    request: null,
    allRequestAnalytics: [],
    businessUserAnalytics: [],
    error: null,
};


const requestAnalyticsSlice = createSlice({
    name: "request",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            // create request
.addCase(createRequestAnalytics.pending, (state) => {
    state.createRequestAnalyticsStatus = "isLoading";
})
.addCase(createRequestAnalytics.fulfilled, (state, action) => {
    state.createRequestAnalyticsStatus = "succeeded";

    // Extract the request data from the response
    const newrequest = action.payload.data;

    // Check if the request data is valid before updating the state
    if (newrequest && newrequest._id) {
        state.allRequestAnalytics = Array.isArray(state.allRequestAnalytics)
            ? [...state.allRequestAnalytics, newrequest]
            : [newrequest];
    } else {
        console.error("Invalid request data received:", action.payload);
    }
})
.addCase(createRequestAnalytics.rejected, (state, action) => {
    state.createRequestAnalyticsStatus = "failed";
    state.error = action.error.message ?? "Failed to create request"
})


.addCase(updateRequestAnalytics.fulfilled, (state, action) => {
    state.updateRequestAnalyticsStatus = "succeeded";
    state.allRequestAnalytics = state.allRequestAnalytics.map((request) =>
        request._id === action.payload._id ? action.payload : request
    );
    // Dispatch getAllRequestAnalytics to refresh the request list
    state.allRequestAnalytics = state.allRequestAnalytics.map((request) =>
        request._id === action.payload._id ? action.payload : request
    );

    // Optionally, update the currently selected request if necessary
    if (state.request?._id === action.payload._id) {
        state.request = action.payload;
    }

})
.addCase(updateRequestAnalytics.rejected, (state, action) => {
    state.updateRequestAnalyticsStatus = "failed";
    state.error = action.error.message ?? "Failed to update request";
})

.addCase(updateRequestAnalyticsStatus.fulfilled, (state, action) => {
    state.updateRequestAnalyticsStatusStatus = "succeeded";
  })

.addCase(updateRequestAnalyticsStatus.rejected, (state, action) => {
    state.updateRequestAnalyticsStatusStatus = "failed";
    state.error = action.error.message ?? "Failed to update request";
})


// get request by id
.addCase(getRequestAnalytics.pending, (state) => {
    state.getRequestAnalyticsStatus = "isLoading";
})
.addCase(getRequestAnalytics.fulfilled, (state, action) => {
    state.getRequestAnalyticsStatus = "succeeded";
    state.request = action.payload;
})
.addCase(getRequestAnalytics.rejected, (state, action) => {
    state.getRequestAnalyticsStatus = "failed";
    state.error = action.error.message ?? "Failed to get request";
})


// get request by business
.addCase(getRequestAnalyticsByBusiness.pending, (state) => {
    state.getRequestAnalyticsByBusinessStatus = "isLoading";
})
.addCase(getRequestAnalyticsByBusiness.fulfilled, (state, action) => {
    state.allRequestAnalytics = action.payload;
    state.getRequestAnalyticsByBusinessStatus = "succeeded";
  })
.addCase(getRequestAnalyticsByBusiness.rejected, (state, action) => {
    state.getRequestAnalyticsByBusinessStatus = "failed";
    state.error = action.error.message ?? "Failed to get request";
})



// get request by users of a business
.addCase(getRequestAnalyticsByBusinessUser.pending, (state) => {
    state.getRequestAnalyticsByBusinessUserStatus = "isLoading";
})
.addCase(getRequestAnalyticsByBusinessUser.fulfilled, (state, action) => {
    state.getRequestAnalyticsByBusinessUserStatus = "succeeded";
    state.request = action.payload;
})
.addCase(getRequestAnalyticsByBusinessUser.rejected, (state, action) => {
    state.getRequestAnalyticsByBusinessStatus = "failed";
    state.error = action.error.message ?? "Failed to get request";
})


.addCase(getRequestAnalyticsCount.pending, (state) => {
    state.getRequestAnalyticsCountStatus = "isLoading";
})
.addCase(getRequestAnalyticsCount.fulfilled, (state, action) => {
    state.getRequestAnalyticsCountStatus = "succeeded";
    state.request = action.payload;
})
.addCase(getRequestAnalyticsCount.rejected, (state, action) => {
    state.getRequestAnalyticsCountStatus = "failed";
    state.error = action.error.message ?? "Failed to get request";
})


.addCase(getRequestAnalyticsCountByBusiness.pending, (state) => {
    state.getRequestAnalyticsCountByBusinessStatus = "isLoading";
})
.addCase(getRequestAnalyticsCountByBusiness.fulfilled, (state, action) => {
    state.getRequestAnalyticsCountByBusinessStatus = "succeeded";
    state.request = action.payload;
})
.addCase(getRequestAnalyticsCountByBusiness.rejected, (state, action) => {
    state.getRequestAnalyticsCountByBusinessStatus = "failed";
    state.error = action.error.message ?? "Failed to get request";
})


// get requests 
.addCase(getAllRequestAnalytics.pending, (state) => {
    state.getAllRequestAnalyticsStatus = "isLoading";
})
.addCase(getAllRequestAnalytics.fulfilled, (state, action) => {
    state.getAllRequestAnalyticsStatus = "succeeded";
    state.allRequestAnalytics = Array.isArray(action.payload) ? action.payload : [];
})            
.addCase(getAllRequestAnalytics.rejected, (state, action) => {
    state.getAllRequestAnalyticsStatus = "failed";
    state.error = action.error.message ?? "Failed to get all requests by request";
})


// delete request
.addCase(deleteRequestAnalytics.pending, (state) => {
    state.deleteRequestAnalyticsStatus = "isLoading";
})
.addCase(deleteRequestAnalytics.fulfilled, (state, action) => {
    state.deleteRequestAnalyticsStatus = "succeeded";
    state.allRequestAnalytics = Array.isArray(state.allRequestAnalytics)
        ? state.allRequestAnalytics.filter((log) => log._id !== action.payload)
        : [];

    if (state.request?._id === action.payload) {
        state.request = null; 
    }
})
.addCase(deleteRequestAnalytics.rejected, (state, action) => {
    state.deleteRequestAnalyticsStatus = "failed";
    state.error = action.error.message ?? "Failed to delete request";
});
    },
});

export default requestAnalyticsSlice.reducer;