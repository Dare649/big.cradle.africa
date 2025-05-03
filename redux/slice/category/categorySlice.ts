import { createSlice } from "@reduxjs/toolkit";
import {
    createCategory,
    deleteCategory,
    getAllCategory,
    getCategory,
    updateCategory,
    
} from "./category";


  
interface CategoryData {
    createdAt?: string;
    _id?: string;
    id: string;
    category_name: string;
    category_description: number;
}


interface CategoryState {
    createCategoryStatus:  "idle" | "isLoading" | "succeeded" | "failed";
    updateCategoryStatus:  "idle" | "isLoading" | "succeeded" | "failed";
    getAllCategoryStatus:  "idle" | "isLoading" | "succeeded" | "failed";
    deleteCategoryStatus:  "idle" | "isLoading" | "succeeded" | "failed";
    getCategoryStatus:  "idle" | "isLoading" | "succeeded" | "failed";
    Status:  "idle" | "isLoading" | "succeeded" | "failed";
    category: CategoryData | null;
    allCategory: CategoryData[];
    error: string | null;
}


const initialState: CategoryState = {
    createCategoryStatus: "idle",
    updateCategoryStatus: "idle",
    getCategoryStatus: "idle",
    Status: "idle",
    getAllCategoryStatus: "idle",
    deleteCategoryStatus: "idle",
    category: null,
    allCategory: [],
    error: null,
};


const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            // create category
            .addCase(createCategory.pending, (state) => {
                state.createCategoryStatus = "isLoading";
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.createCategoryStatus = "succeeded";
            
                // Extract the category data from the response
                const newcategory = action.payload.data;
            
                // Check if the category data is valid before updating the state
                if (newcategory && newcategory._id) {
                    state.allCategory = Array.isArray(state.allCategory)
                        ? [...state.allCategory, newcategory]
                        : [newcategory];
                } else {
                    console.error("Invalid category data received:", action.payload);
                }
            })
            
            
            .addCase(createCategory.rejected, (state, action) => {
                state.createCategoryStatus = "failed";
                state.error = action.error.message ?? "Failed to create category"
            })


            .addCase(updateCategory.fulfilled, (state, action) => {
                state.updateCategoryStatus = "succeeded";
                state.allCategory = state.allCategory.map((category) =>
                    category._id === action.payload._id ? action.payload : category
                );
                // Dispatch getAllCategory to refresh the category list
                state.allCategory = state.allCategory.map((category) =>
                    category._id === action.payload._id ? action.payload : category
                );

                // Optionally, update the currently selected category if necessary
                if (state.category?._id === action.payload._id) {
                    state.category = action.payload;
                }

                // Refresh the category list by dispatching the `getAllCategory` action
                // You might want to dispatch this action in the component where the update happens
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.updateCategoryStatus = "failed";
                state.error = action.error.message ?? "Failed to update category";
            })


            // get category by id
            .addCase(getCategory.pending, (state) => {
                state.getCategoryStatus = "isLoading";
            })
            .addCase(getCategory.fulfilled, (state, action) => {
                state.getCategoryStatus = "succeeded";
                state.category = action.payload;
            })
            .addCase(getCategory.rejected, (state, action) => {
                state.getCategoryStatus = "failed";
                state.error = action.error.message ?? "Failed to get category";
            })

            // get categorys 
            .addCase(getAllCategory.pending, (state) => {
                state.getAllCategoryStatus = "isLoading";
            })
            .addCase(getAllCategory.fulfilled, (state, action) => {
                state.getAllCategoryStatus = "succeeded";
                state.allCategory = Array.isArray(action.payload) ? action.payload : [];
            })            
            .addCase(getAllCategory.rejected, (state, action) => {
                state.getAllCategoryStatus = "failed";
                state.error = action.error.message ?? "Failed to get all categorys by category";
            })


            // delete category
            .addCase(deleteCategory.pending, (state) => {
                state.deleteCategoryStatus = "isLoading";
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.deleteCategoryStatus = "succeeded";
                state.allCategory = Array.isArray(state.allCategory)
                    ? state.allCategory.filter((log) => log._id !== action.payload)
                    : [];
            
                if (state.category?._id === action.payload) {
                    state.category = null; 
                }
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.deleteCategoryStatus = "failed";
                state.error = action.error.message ?? "Failed to delete category";
            });
    },
});

export default categorySlice.reducer;