'use client';

import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import FileUploader from "../file-upload/page";
import { updateRequestAnalyticsStatus, getAllRequestAnalytics } from "@/redux/slice/request-analytics/requestAnalytics";
import { toast } from "react-toastify";
import { startLoading, stopLoading } from "@/redux/slice/loadingSlice";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "in progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

interface StatusOption {
  value: string;
  label: string;
}

interface FormState {
  status: StatusOption | null;
  completed_data_file: string;
}

const UpdateStatus = ({ data, onClose }: { data: any; onClose: () => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<FormState>({
    status: null,
    completed_data_file: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (data?.status) {
      const current = statusOptions.find(opt => opt.value === data.status);
      setFormData(prev => ({ ...prev, status: current || null }));
    }
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(startLoading());
        await dispatch(getAllRequestAnalytics()).unwrap();
        
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch request");
      } finally {
        dispatch(stopLoading());
      }
    };

    fetchData();
  }, [dispatch]);

  const handleStatusChange = (selected: StatusOption | null) => {
    setFormData(prev => ({ ...prev, status: selected }));
  };


  const convertImageToBase64 = async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
    });
};

  const handleSubmit = async () => {
    const { status, completed_data_file } = formData;
  
    if (!status) {
      setError("Please select a status");
      return;
    }
  
    if (status.value === "completed" && !completed_data_file) {
      setError("File upload is required for 'Completed' status");
      return;
    }

     dispatch(startLoading());
  
    try {
      const formDataToSend: any = {
        status: status.value,
      };
  
      if (status.value === "completed" && completed_data_file) {
        const base64File = await convertImageToBase64(completed_data_file);
        formDataToSend.base64_file = base64File as string;
      }
  
      await dispatch(updateRequestAnalyticsStatus({ id: data?.id, data: formDataToSend }));
      toast.success("Analytics status updated successfully");
      await dispatch(getAllRequestAnalytics()).unwrap();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Something went wrong, please try again.");
    } finally {
        dispatch(stopLoading());
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50">
        <div className="p-4 bg-white rounded-2xl lg:w-[50%] sm:w-full shadow-2xl">
            <h2 className="my-5 capitalize text-xl font-bold text-primary-1">update analytics status</h2>
            <div className="mb-4">
                <label className="block mb-1 text-sm font-medium">Status</label>
                <Select
                options={statusOptions}
                value={formData.status}
                onChange={handleStatusChange}
                />
            </div>

            {/* Show file upload only if status is 'completed' */}
            {formData.status?.value === "completed" && (
                <div className="mb-4">
                <FileUploader
                    onChange={(name, value) => setFormData({ ...formData, [name]: value })}
                    text="Upload completed analytics"
                    id="doc-upload"
                    name="completed_data_file"
                />
                </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
                onClick={handleSubmit}
                className="w-full mt-4 px-4 py-2 bg-primary-1 text-white rounded hover:bg-primary-1"
            >
                Submit
            </button>
        </div>
    </div>
    
  );
};

export default UpdateStatus;
