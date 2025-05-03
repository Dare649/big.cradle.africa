"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getRequestType } from "@/redux/slice/request-type/requestType";
import { RootState, AppDispatch } from "@/redux/store";
import { startLoading, stopLoading } from "@/redux/slice/loadingSlice";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";


const RequestTypeDetails = () => {
  const params = useParams();
  const id = params?.id as string; // Ensure `id` is treated as a string
  const dispatch = useDispatch<AppDispatch>();

  // Get request details from the Redux store
  const requestDetails = useSelector((state: RootState) => state.request.request);

 
  useEffect(() => {
    const fetchrequest = async () => {
      if (!id) {
        toast.error("request ID is missing.");
        return;
      }

      try {
        dispatch(startLoading());
        await dispatch(getRequestType(id));
      } catch (error: any) {
        toast.error("Failed to fetch request details.");
        console.error(error);
      } finally {
        dispatch(stopLoading());
      }
    };

    fetchrequest();
  }, [id, dispatch]);


  return (
    <div className="w-full border-2 border-primary-1 rounded-xl lg:p-5 sm:p-2">
      <Link href={"/analytics-categories"} className="capitalize font-bold mb-4 text-primary-1 text-md flex items-center gap-2">
      <span><FaArrowLeftLong/></span>
      <span>back</span>
      </Link>
      {requestDetails ? (
        <div className=" lg:p-3 sm:p-1 my-3 w-full">
          {/* request Details */}
          <div className="w-full">
            <h2 className="text-tertiary-1 font-bold uppercase">request Details</h2>
            <div className="w-full grid lg:grid-cols-3 sm:grid-cols-2 gap-5 mt-8">
              <div>
                <h3 className="uppercase font-bold text-primary-1 text-xs mb-1">request Name</h3>
                <h3 className="text-tertiary-1 font-bold capitalize">{requestDetails?.request_name || "N/A"}</h3>
              </div>
              
              <div>
                <h3 className="uppercase font-bold text-primary-1 text-xs mb-1">request Description</h3>
                <h3 className="text-tertiary-1 font-bold">{requestDetails?.request_description || "N/A"}</h3>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-primary-1">Loading request details...</p>
      )}
    </div>
  );
};

export default RequestTypeDetails;
