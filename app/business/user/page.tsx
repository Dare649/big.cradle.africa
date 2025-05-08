'use client';

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Table from "@/components/table/page";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { IoAdd } from "react-icons/io5";
import Modal from "@/components/modal/page";
import CreateUsers from "@/components/create-users/page";
import { startLoading, stopLoading } from "@/redux/slice/loadingSlice";
import { getBusinessUsers, deleteUser, getUser } from "@/redux/slice/users/users";
import { getSignedInUser } from "@/redux/slice/auth/auth";


const Users = () => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const router = useRouter(); // Initialize the router
  const dispatch = useDispatch<AppDispatch>();
  const businessUsers = useSelector((state: RootState) =>
    Array.isArray(state.user?.businessUsers) ? state.user.businessUsers : []);
  console.log(businessUsers)
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
  
  // Fetch user on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(startLoading());
  
        // Only fetch if user exists and has an _id
        if (user?._id) {
          await dispatch(getBusinessUsers(user._id)).unwrap();
        } else {
          // Try to fetch signed-in user first
          const signedInUser = await dispatch(getSignedInUser()).unwrap();
  
          if (signedInUser?._id) {
            await dispatch(getBusinessUsers(signedInUser._id)).unwrap();
          }
        }
  
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch user");
      } finally {
        dispatch(stopLoading());
      }
    };
  
    if (!businessUsers.length) {
      fetchData();
    }
  }, [dispatch, user?._id]);
  
  


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
                  await dispatch(getBusinessUsers(userId)).unwrap();
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
        // {
        //   label: "View",
        //   className: "text-primary-1 cursor-pointer",
        //   onClick: (row: any) => {
        //     router.push(`/analytics-types/${row.id}`);
        //   },
        // },
        {
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
      [businessUsers]
    );

  // Function to toggle the modal
  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  
  
  const columns = useMemo(() => {
    return [
      
      {
        key: "user_img",
        label: "Image",
        render: (row: any) => (
          <span className="text-primary-1 w-16 h-16 rounded-full block overflow-hidden">
            <img
              src={row.user_img}
              alt={`${row.first_name} ${row.last_name}`}
              className="w-full h-full object-cover"
            />
          </span>
        ),
      },
      {
        key: "createdAt",
        label: "Created Date",
        render: (row: any) => (
          <span className="text-primary-1">{formatDateTime(row.createdAt)}</span>
        ),
      },
      {
        key: "first_name",
        label: "First Name",
        render: (row: any) => (
          <span className="text-primary-1">{row.first_name}</span>
        ),
      },
      {
        key: "last_name",
        label: "Last Name",
        render: (row: any) => (
          <span className="text-primary-1">{row.last_name}</span>
        ),
      },
      {
        key: "email",
        label: "Email",
        render: (row: any) => (
          <span className="text-primary-1">{row.email}</span>
        ),
      },
      {
        key: "department",
        label: "Department",
        render: (row: any) => (
          <span className="text-primary-1">{row.department}</span>
        ),
      },
    ];
  }, [businessUsers]);
  
  

  // Format user data for the table
  const formatteduser = useMemo(
    () =>
      businessUsers.map((item) => ({
        ...item,
        id: item._id, // Ensure each row has a unique `id`
      })),
    [businessUsers]
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
      {open && (
        <Modal visible={open} onClose={handleOpen}>
          <CreateUsers handleClose={handleOpen} userData={selectedRow}/>
        </Modal>
      )}
    </section>
  );
};

export default Users;
