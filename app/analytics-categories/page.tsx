'use client';

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Table from "@/components/table/page";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { IoAdd } from "react-icons/io5";
import Modal from "@/components/modal/page";
import CreateCategory from "@/components/create-category/page";
import { startLoading, stopLoading } from "@/redux/slice/loadingSlice";
import { getAllCategory, deleteCategory, getCategory } from "@/redux/slice/category/category";


const Category = () => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const router = useRouter(); // Initialize the router
  const dispatch = useDispatch<AppDispatch>();
  const allCategory = useSelector((state: RootState) =>
    Array.isArray(state.category?.allCategory) ? state.category.allCategory : []
  );


  const formatDateTime = (isoString: string | null | undefined): string => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(date);
  };
  
  // Fetch Category on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(startLoading());
        await dispatch(getAllCategory()).unwrap();

      } catch (error: any) {
        toast.error(error.message || "Failed to fetch Category");
      } finally {
        dispatch(stopLoading());
      }
    };

    fetchData();
  }, [dispatch]);


  const handleUpdate = async (row: any) => {
    if (!row || !row?.id) {
      toast.error("Invalid vehicle record ID");
      return;
    }

    try {
      dispatch(startLoading());
      const response = await dispatch(getCategory(row?.id)).unwrap();

      if (response) {
        setSelectedRow(response);
        setOpen(true);
      } else {
        toast.error("No data found for the selected record.");
      }
    } catch (error: any) {
      console.error("API Call Error:", error);
      toast.error(error.message || "Failed to fetch record");
    } finally {
      dispatch(stopLoading());
    }
  };

  const formatNumber = (num: number) => {
    return Number(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };


  

  const handleClose = async () => {
    setOpen(false);
    setSelectedRow(null);

    // ✅ Ensure table reloads after updating
    dispatch(getAllCategory());
  };

  const handleDelete = async (categoryId: string) => {
      // Show confirmation toast
      toast.info(
        <div className="flex flex-col items-center text-center">
          <p className="mb-4">Are you sure you want to delete this category?</p>
          <div className="flex items-center gap-3">
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={async () => {
                toast.dismiss(`delete-${categoryId}`); // Dismiss the confirmation toast
                dispatch(startLoading());
                try {
                  await dispatch(deleteCategory(categoryId)).unwrap(); // Delete category by categoryId
                  toast.success("category deleted successfully");
    
                  // Refetch all Category after deletion
                  await dispatch(getAllCategory()).unwrap();
                } catch (error: any) {
                  toast.error(error.message || "Failed to delete category");
                } finally {
                  dispatch(stopLoading());
                }
              }}
            >
              Yes
            </button>
            <button
              className="bg-gray-300 px-3 py-1 rounded"
              onClick={() => toast.dismiss(`delete-${categoryId}`)} // Dismiss the confirmation toast
            >
              No
            </button>
          </div>
        </div>,
        { toastId: `delete-${categoryId}` } // Unique toastId for each confirmation
      );
    };
    
  
    const actions = useMemo(
      () => [
        {
          label: "View",
          className: "text-primary-1 cursor-pointer",
          onClick: (row: any) => {
            router.push(`/analytics-categories/${row.id}`);
          },
        },{
          label: "Update",
          onClick: (row: any) => handleUpdate(row),
          className: "text-green-500 cursor-pointer",
        },
        {
          label: "Delete",
          className: "text-red-500 cursor-pointer",
          onClick: (row: any) => handleDelete(row.id),
        },
      ],
      [allCategory]
    );

  // Function to toggle the modal
  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  
  
  const columns = useMemo(
    () => [
      {
        key: "createdAt",
        label: "Created Date",
        render: (row: any) => (
          <span className="text-primary-1">{formatDateTime(row.createdAt)}</span> // Change text color to blue
        ),
      },
      {
        key: "category_name",
        label: "Category Name",
        render: (row: any) => (
          <span className="text-primary-1">{row.category_name}</span> // Change text color to blue
        ),
      },
      {
        key: "category_description",
        label: "Category Description",
        render: (row: any) => (
          <span className="text-primary-1">{row.category_description}</span> // Change text color to blue
        ),
      },
      
      
    ],
    [allCategory] // Ensure columns re-render when 'allCategory' changes
  );
  

  // Format category data for the table
  const formattedCategory = useMemo(
    () =>
      allCategory.map((item) => ({
        ...item,
        id: item._id, // Ensure each row has a unique `id`
      })),
    [allCategory]
  );

  return (
    <section className="w-full">
      <div className="flex justify-end">
        <button
          className="flex items-center gap-x-1 outline-none bg-primary-1 text-white capitalize hover:border-2 hover:border-primary-1 hover:text-primary-1 hover:bg-transparent rounded-lg py-3 px-5 cursor-pointer"
          onClick={handleOpen}
        >
          <IoAdd size={25} />
          <span>Add category</span>
        </button>
      </div>
      <div className="w-full mt-10 lg:p-5 sm:p-2">
        <Table data={formattedCategory} columns={columns} actions={actions} />
      </div>
      {open && (
        <Modal visible={open} onClose={handleOpen}>
          <CreateCategory handleClose={handleOpen} categoryData={selectedRow}/>
        </Modal>
      )}
    </section>
  );
};

export default Category;
