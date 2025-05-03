'use client';

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Table from "@/components/table/page";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { IoAdd } from "react-icons/io5";
import Modal from "@/components/modal/page";
import CreateRequestType from "@/components/create-request-type/page";
import { startLoading, stopLoading } from "@/redux/slice/loadingSlice";
import { getAllRequestTypes, deleteRequestType, getRequestType } from "@/redux/slice/request-type/requestType";


const RequestType = () => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const router = useRouter(); // Initialize the router
  const dispatch = useDispatch<AppDispatch>();
  const allRequestType = useSelector((state: RootState) =>
    Array.isArray(state.request?.allRequestType) ? state.request.allRequestType : []
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
  
  // Fetch request on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(startLoading());
        await dispatch(getAllRequestTypes()).unwrap();

      } catch (error: any) {
        toast.error(error.message || "Failed to fetch request");
      } finally {
        dispatch(stopLoading());
      }
    };

    fetchData();
  }, [dispatch]);


  const handleUpdate = async (row: any) => {
    if (!row || !row?.id) {
      toast.error("Invalid request ID");
      return;
    }

    try {
      dispatch(startLoading());
      const response = await dispatch(getRequestType(row?.id)).unwrap();

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



  const handleClose = async () => {
    setOpen(false);
    setSelectedRow(null);

    // ✅ Ensure table reloads after updating
    dispatch(getAllRequestTypes());
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
                  await dispatch(deleteRequestType(requestId)).unwrap(); // Delete request by requestId
                  toast.success("request deleted successfully");
    
                  // Refetch all request after deletion
                  await dispatch(getAllRequestTypes()).unwrap();
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
      [allRequestType]
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
        key: "request_name",
        label: "Request Name",
        render: (row: any) => (
          <span className="text-primary-1">{row.request_name}</span> // Change text color to blue
        ),
      },
      {
        key: "request_description",
        label: "Request Description",
        render: (row: any) => (
          <span className="text-primary-1">{row.request_description}</span> // Change text color to blue
        ),
      },
      
      
    ],
    [allRequestType] // Ensure columns re-render when 'allRequestType' changes
  );
  

  // Format request data for the table
  const formattedrequest = useMemo(
    () =>
      allRequestType.map((item) => ({
        ...item,
        id: item._id, // Ensure each row has a unique `id`
      })),
    [allRequestType]
  );

  return (
    <section className="w-full">
      <div className="flex justify-end">
        <button
          className="flex items-center gap-x-1 outline-none bg-primary-1 text-white capitalize hover:border-2 hover:border-primary-1 hover:text-primary-1 hover:bg-transparent rounded-lg py-3 px-5 cursor-pointer"
          onClick={handleOpen}
        >
          <IoAdd size={25} />
          <span>Add request</span>
        </button>
      </div>
      <div className="w-full mt-10 lg:p-5 sm:p-2">
        <Table data={formattedrequest} columns={columns} actions={actions} />
      </div>
      {open && (
        <Modal visible={open} onClose={handleOpen}>
          <CreateRequestType handleClose={handleOpen} requestData={selectedRow}/>
        </Modal>
      )}
    </section>
  );
};

export default RequestType;
