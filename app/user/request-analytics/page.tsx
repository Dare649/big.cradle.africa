'use client';

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Table from "@/components/table/page";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { IoAdd } from "react-icons/io5";
import Modal from "@/components/modal/page";
import CreateRequestAnalytics from "@/components/create-request-analytics/page";
import { startLoading, stopLoading } from "@/redux/slice/loadingSlice";
import { getRequestAnalyticsByBusinessUser, deleteRequestAnalytics, getRequestAnalytics, updateRequestAnalyticsStatus } from "@/redux/slice/request-analytics/requestAnalytics";
import { getAllCategory } from "@/redux/slice/category/category";
import { getAllRequestTypes } from "@/redux/slice/request-type/requestType";
import { getSignedInUser } from "@/redux/slice/auth/auth";


const RequestAnalytics = () => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const router = useRouter(); // Initialize the router
  const dispatch = useDispatch<AppDispatch>();
  const allRequestAnalytics = useSelector((state: RootState) =>
    Array.isArray(state.requestAnalytics?.businessUserAnalytics) ? state.requestAnalytics?.businessUserAnalytics : []
  );
  const allRequestType = useSelector((state: RootState) => Array.isArray(state.request?.allRequestType) ? state.request.allRequestType : []);
  const allCategory = useSelector((state: RootState) => Array.isArray(state.category?.allCategory) ? state.category.allCategory : []);
  const user = useSelector((state: RootState) => state.auth.user);


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


  const getRequestTypeName = (requestId: string) => {
  
    const requestType = allRequestType.find((p) => p.id === requestId);
  
    if (requestType) {
      console.log('Found Request Type:', requestType);
      return requestType.request_name;
    }
    
    return "Unknown type";
  };
  
  const getRequestCategoryName = (categoryId: string) => {
    const category = allCategory.find((p) => p.id === categoryId);
    return category ? category.category_name : "Unknown category";
  };
  
  // Fetch request on component mount
  useEffect(() => {
    if (!user) return; // Prevent fetch if the user is not yet available

    const fetchData = async () => {
      try {
        dispatch(startLoading());

        await dispatch(getRequestAnalyticsByBusinessUser(String(user?._id))).unwrap();
        await dispatch(getAllCategory()).unwrap();
        await dispatch(getAllRequestTypes()).unwrap();
        await dispatch(getSignedInUser()).unwrap();

      } catch (error: any) {
        toast.error(error.message || "Failed to fetch request");
      } finally {
        dispatch(stopLoading());
      }
    };

    fetchData();
  }, [dispatch, user?.role, user?._id]); // Only trigger when `user` or `user._id` or `user.role` changes


  

  const handleUpdate = async (row: any) => {
    if (!row || !row?.id) {
      toast.error("Invalid request ID");
      return;
    }

    try {
      dispatch(startLoading());
      const response = await dispatch(getRequestAnalytics(row?.id)).unwrap();

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



  const handleDelete = async (requestId: string) => {
      // Show confirmation toast
      toast.info(
        <div className="flex flex-col items-center text-center">
          <p className="mb-4">Are you sure you want to delete this request?</p>
          <div className="flex items-center gap-3">
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={async () => {
                toast.dismiss(`delete-${requestId}`); // Dismiss the confirmation toast
                dispatch(startLoading());
                try {
                  await dispatch(deleteRequestAnalytics(requestId)).unwrap(); // Delete request by requestId
                  toast.success("request deleted successfully");
    
                  // Refetch all request after deletion
                  await dispatch(getRequestAnalyticsByBusinessUser(String(user?._id))).unwrap();
                } catch (error: any) {
                  toast.error(error.message || "Failed to delete request");
                } finally {
                  dispatch(stopLoading());
                }
              }}
            >
              Yes
            </button>
            <button
              className="bg-gray-300 px-3 py-1 rounded"
              onClick={() => toast.dismiss(`delete-${requestId}`)} // Dismiss the confirmation toast
            >
              No
            </button>
          </div>
        </div>,
        { toastId: `delete-${requestId}` } // Unique toastId for each confirmation
      );
  };

    const actions = useMemo(
      () => [
        {
          label: "View",
          className: "text-primary-1 cursor-pointer",
          onClick: (row: any) => {
            router.push(`/user/request-analytics/${row.id}`);
          },
        },
        {
          label: "Update",
          onClick: (row: any) => handleUpdate(row),
          className: "text-gray-500 cursor-pointer",
        },
        
        {
          label: "Delete",
          className: "text-red-500 cursor-pointer",
          onClick: (row: any) => handleDelete(row.id),
        },
      ],
      [allRequestAnalytics]
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
        key: "data_title",
        label: "Request Title",
        render: (row: any) => (
          <span className="text-primary-1">{row.data_title}</span> // Change text color to blue
        ),
      },
      {
        key: "request_type_id",
        label: "Analytics Type",
        render: (row: any) => (
          <span className="text-primary-1">{getRequestTypeName(row.request?.[0]?.request_type_id)}</span> 
        ),
      },
      {
        key: "category_id",
        label: "Data Category",
        render: (row: any) => (
          <span className="text-primary-1">{getRequestCategoryName(row.category?.[0]?.category_id)}</span> 
        ),
      },
      {
        key: "status",
        label: "Status",
        render: (row) => {
          
          return (
            <span
                className={`font-bold ${
                    row.status === "completed"
                    ? "text-green-500"
                    : row.status === "in progress"
                    ? "text-orange-500"
                    : "text-gray-500"
                }`}
                >
                {row.status}
            </span>
          );
        },    
      },
      
    ],
    [allRequestAnalytics] 
  );
  

  // Format request data for the table
  const formattedrequest = useMemo(
    () =>
      allRequestAnalytics.map((item) => ({
        ...item,
        id: item._id, // Ensure each row has a unique `id`
      })),
    [allRequestAnalytics]
  );

  return (
    <section className="w-full">
      <div className="flex justify-end">
        <button
          className="flex items-center gap-x-1 outline-none bg-primary-1 text-white capitalize hover:border-2 hover:border-primary-1 hover:text-primary-1 hover:bg-transparent rounded-lg py-3 px-5 cursor-pointer"
          onClick={handleOpen}
        >
          <IoAdd size={25} />
          <span>create request</span>
        </button>
      </div>
      <div className="w-full mt-10 lg:p-5 sm:p-2">
        <Table data={formattedrequest} columns={columns} actions={actions} />
      </div>
      {open && (
        <Modal visible={open} onClose={handleOpen}>
          <CreateRequestAnalytics handleClose={handleOpen} requestData={selectedRow}/>
        </Modal>
      )}
    </section>
  );
};

export default RequestAnalytics;
