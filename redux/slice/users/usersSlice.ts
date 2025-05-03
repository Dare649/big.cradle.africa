import { createSlice } from "@reduxjs/toolkit";
import {
    createUser,
    deleteUser,
    getAllUser,
    getUser,
    updateUser,
    getBusinessCount,
    getBusinessUsers
} from "./users";


  
interface UsersData {
    createdAt?: string;
    _id?: string;
    id?: string;
    first_name?: string;
    last_name?: string;
    department?: string;
    email?: string;
    business_user_id?: string;
    password?: string;
    user_img?: string;
    business_name?: string;
    contact_name?: string;
    contact_number?: string;
    business_address?: string;
    business_city?: string;
    business_state?: string;
    sector?: string;
    organization_size?: string;
    business_country?: string;
}


interface UsersState {
    createUserStatus:  "idle" | "isLoading" | "succeeded" | "failed";
    updateUserStatus:  "idle" | "isLoading" | "succeeded" | "failed";
    getAllUserStatus:  "idle" | "isLoading" | "succeeded" | "failed";
    getBusinessCountStatus:  "idle" | "isLoading" | "succeeded" | "failed";
    deleteUserStatus:  "idle" | "isLoading" | "succeeded" | "failed";
    getUserStatus:  "idle" | "isLoading" | "succeeded" | "failed";
    getBusinessUsersStatus:  "idle" | "isLoading" | "succeeded" | "failed";
    Status:  "idle" | "isLoading" | "succeeded" | "failed";
    user: UsersData | null;
    allUsers: UsersData[];
    error: string | null;
}


const initialState: UsersState = {
    createUserStatus: "idle",
    updateUserStatus: "idle",
    getUserStatus: "idle",
    getBusinessUsersStatus: "idle",
    Status: "idle",
    getAllUserStatus: "idle",
    getBusinessCountStatus: "idle",
    deleteUserStatus: "idle",
    user: null,
    allUsers: [],
    error: null,
};


const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            // create user
            .addCase(createUser.pending, (state) => {
                state.createUserStatus = "isLoading";
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.createUserStatus = "succeeded";
            
                // Extract the user data from the response
                const newuser = action.payload.data;
            
                // Check if the user data is valid before updating the state
                if (newuser && newuser._id) {
                    state.allUsers = Array.isArray(state.allUsers)
                        ? [...state.allUsers, newuser]
                        : [newuser];
                } else {
                    console.error("Invalid user data received:", action.payload);
                }
            })
            
            
            .addCase(createUser.rejected, (state, action) => {
                state.createUserStatus = "failed";
                state.error = action.error.message ?? "Failed to create user"
            })


            .addCase(updateUser.fulfilled, (state, action) => {
                state.updateUserStatus = "succeeded";
                state.allUsers = state.allUsers.map((user) =>
                    user._id === action.payload._id ? action.payload : user
                );
                // Dispatch getAllUser to refresh the user list
                state.allUsers = state.allUsers.map((user) =>
                    user._id === action.payload._id ? action.payload : user
                );

                // Optionally, update the currently selected user if necessary
                if (state.user?._id === action.payload._id) {
                    state.user = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.updateUserStatus = "failed";
                state.error = action.error.message ?? "Failed to update user";
            })


            // get user by id
            .addCase(getUser.pending, (state) => {
                state.getUserStatus = "isLoading";
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.getUserStatus = "succeeded";
                state.user = action.payload;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.getUserStatus = "failed";
                state.error = action.error.message ?? "Failed to get user";
            })



            // get users 
            .addCase(getAllUser.pending, (state) => {
                state.getAllUserStatus = "isLoading";
            })
            .addCase(getAllUser.fulfilled, (state, action) => {
                state.getAllUserStatus = "succeeded";
                state.allUsers = Array.isArray(action.payload) ? action.payload : [];
            })            
            .addCase(getAllUser.rejected, (state, action) => {
                state.getAllUserStatus = "failed";
                state.error = action.error.message ?? "Failed to get all users by user";
            })

            .addCase(getBusinessUsers.pending, (state) => {
                state.getBusinessUsersStatus = "isLoading";
            })
            .addCase(getBusinessUsers.fulfilled, (state, action) => {
                state.getBusinessUsersStatus = "succeeded";
                state.allUsers = Array.isArray(action.payload) ? action.payload : [];
            })            
            .addCase(getBusinessUsers.rejected, (state, action) => {
                state.getBusinessUsersStatus = "failed";
                state.error = action.error.message ?? "Failed to get all users by user";
            })

            // get users 
            .addCase(getBusinessCount.pending, (state) => {
                state.getBusinessCountStatus = "isLoading";
            })
            .addCase(getBusinessCount.fulfilled, (state, action) => {
                state.getBusinessCountStatus = "succeeded";
                state.allUsers = Array.isArray(action.payload) ? action.payload : [];
            })            
            .addCase(getBusinessCount.rejected, (state, action) => {
                state.getBusinessCountStatus = "failed";
                state.error = action.error.message ?? "Failed to get all users by user";
            })


            // delete user
            .addCase(deleteUser.pending, (state) => {
                state.deleteUserStatus = "isLoading";
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.deleteUserStatus = "succeeded";
                state.allUsers = Array.isArray(state.allUsers)
                    ? state.allUsers.filter((log) => log._id !== action.payload)
                    : [];
            
                if (state.user?._id === action.payload) {
                    state.user = null; 
                }
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.deleteUserStatus = "failed";
                state.error = action.error.message ?? "Failed to delete user";
            });
    },
});

export default userSlice.reducer;