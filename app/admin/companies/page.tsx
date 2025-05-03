'use client';

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Table from "@/components/table/page";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { IoAdd } from "react-icons/io5";
import { startLoading, stopLoading } from "@/redux/slice/loadingSlice";
import { getAllUser, deleteUser, getUser } from "@/redux/slice/users/users";
import { getSignedInUser } from "@/redux/slice/auth/auth";


const Users = () => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const router = useRouter(); // Initialize the router
  const dispatch = useDispatch<AppDispatch>();
  const allUsers = useSelector((state: RootState) =>
    Array.isArray(state.user?.allUsers) ? state.user.allUsers : []);



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
  
  // Fetch user on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(startLoading());
        await dispatch(getAllUser()).unwrap();
        await dispatch(getSignedInUser()).unwrap();
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch user");
      } finally {
        dispatch(stopLoading());
      }
    };

    fetchData();
  }, [dispatch]);


  const handleUpdate = async (row: any) => {
    if (!row || !row?.id) {
      toast.error("Invalid user ID");
      return;
    }

    try {
      dispatch(startLoading());
      const response = await dispatch(getUser(row?.id)).unwrap();

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



  const handleDelete = async (userId: string) => {
      // Show confirmation toast
      toast.info(
        <div className="flex flex-col items-center text-center">
          <p className="mb-4">Are you sure you want to delete this user?</p>
          <div className="flex items-center gap-3">
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={async () => {
                toast.dismiss(`delete-${userId}`); // Dismiss the confirmation toast
                dispatch(startLoading());
                try {
                  await dispatch(deleteUser(userId)).unwrap(); // Delete user by userId
                  toast.success("user deleted successfully");
    
                  // Refetch all user after deletion
                  await dispatch(getAllUser()).unwrap();
                } catch (error: any) {
                  toast.error(error.message || "Failed to delete user");
                } finally {
                  dispatch(stopLoading());
                }
              }}
            >
              Yes
            </button>
            <button
              className="bg-gray-300 px-3 py-1 rounded"
              onClick={() => toast.dismiss(`delete-${userId}`)} // Dismiss the confirmation toast
            >
              No
            </button>
          </div>
        </div>,
        { toastId: `delete-${userId}` } // Unique toastId for each confirmation
      );
    };
    
  
    const actions = useMemo(
      () => [
        {
          label: "View",
          className: "text-primary-1 cursor-pointer",
          onClick: (row: any) => {
            router.push(`/analytics-types/${row.id}`);
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
      [allUsers]
    );

  // Function to toggle the modal
  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  
  
  const columns = useMemo(() => {
    return [
      {
        key: "createdAt",
        label: "Request Date",
        render: (row: any) => (
          <span className="text-primary-1">{formatDateTime(row.createdAt)}</span>
        ),
      },
      {
        key: "business_name",
        label: "Business Name",
        render: (row: any) => (
          <span className="text-primary-1">{row.business_name}</span>
        ),
      },
      {
        key: "sector",
        label: "Sector",
        render: (row: any) => (
          <span className="text-primary-1">{row.sector}</span>
        ),
      },
      {
        key: "business_country",
        label: "Country",
        render: (row: any) => (
          <span className="text-primary-1">{row.business_country}</span>
        ),
      },
      {
        key: "business_state",
        label: "State",
        render: (row: any) => (
          <span className="text-primary-1">{row.business_state}</span>
        ),
      },
      
    ];
  }, [allUsers]);
  
  

  // Format user data for the table
  const formatteduser = useMemo(
    () =>
      allUsers.map((item) => ({
        ...item,
        id: item._id, // Ensure each row has a unique `id`
      })),
    [allUsers]
  );

  return (
    <section className="w-full">
      <div className="flex justify-end">
        <button
          className="flex items-center gap-x-1 outline-none bg-primary-1 text-white capitalize hover:border-2 hover:border-primary-1 hover:text-primary-1 hover:bg-transparent rounded-lg py-3 px-5 cursor-pointer"
          onClick={handleOpen}
        >
          <IoAdd size={25} />
          <span>Add user</span>
        </button>
      </div>
      <div className="w-full lg:p-5 sm:p-2">
        <Table data={formatteduser} columns={columns} actions={actions} />
      </div>
      
    </section>
  );
};

export default Users;
