"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getRequestAnalytics } from "@/redux/slice/request-analytics/requestAnalytics";
import { RootState, AppDispatch } from "@/redux/store";
import { startLoading, stopLoading } from "@/redux/slice/loadingSlice";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";
import { getAllCategory } from "@/redux/slice/category/category";
import { getAllRequestTypes } from "@/redux/slice/request-type/requestType";
import Image from "next/image";


const RequestDetails = () => {
  const params = useParams();
  const id = params?.id as string; // Ensure `id` is treated as a string
  const dispatch = useDispatch<AppDispatch>();

  // Get request details from the Redux store
  // const requestDetails = useSelector((state: RootState) => state.requestAnalytics.request);
  // Proper typing to account for null value
  const requestDetails = useSelector(
    (state: RootState) => state.requestAnalytics.request
  );
  const allRequestType = useSelector((state: RootState) => Array.isArray(state.request?.allRequestType) ? state.request.allRequestType : []);
  const allCategory = useSelector((state: RootState) => Array.isArray(state.category?.allCategory) ? state.category.allCategory : []);
  

 
  useEffect(() => {
    const fetchRequest = async () => {
      if (!id) {
        toast.error("request ID is missing.");
        return;
      }

      try {
        dispatch(startLoading());
        await dispatch(getRequestAnalytics(id));
        await dispatch(getAllRequestTypes());
        await dispatch(getAllCategory());
      } catch (error: any) {
        toast.error("Failed to fetch request details.");
        console.error(error);
      } finally {
        dispatch(stopLoading());
      }
    };

    fetchRequest();
  }, [id, dispatch]);


  const categoryName = allCategory.find(
    (cat) => cat._id && cat._id.toString() === requestDetails?.category_id?.toString()
  )?.category_name || "Unknown";
  
  const requestTypeName = allRequestType.find(
    (reqType) => reqType._id && reqType._id.toString() === requestDetails?.request_type_id?.toString()
  )?.request_name || "Unknown";
  

  


  return (
    <div className="w-full border-2 border-primary-1 rounded-xl lg:p-5 sm:p-2">
      <Link href={"/user/request-analytics"} className="capitalize font-bold mb-4 text-primary-1 text-md flex items-center gap-2">
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
                <h3 className="text-tertiary-1 font-bold capitalize">{requestDetails?.data_title || "N/A"}</h3>
              </div>
              
              <div>
                <h3 className="uppercase font-bold text-primary-1 text-xs mb-1">request type</h3>
                <h3 className="text-tertiary-1 font-bold capitalize">{requestTypeName}</h3>
              </div>

              <div>
                <h3 className="uppercase font-bold text-primary-1 text-xs mb-1">data category</h3>
                <h3 className="text-tertiary-1 font-bold capitalize">{categoryName}</h3>
              </div>

              <div>
                <h3 className="uppercase font-bold text-primary-1 text-xs mb-1">data consent</h3>
                <h3 className="text-tertiary-1 font-bold capitalize">{requestDetails?.data_consent === 0 ? 'no': 'yes'}</h3>
              </div>

              <div>
                <h3 className="uppercase font-bold text-primary-1 text-xs mb-1">request description</h3>
                <h3 className="text-tertiary-1 font-bold capitalize">{requestDetails?.data_description}</h3>
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

export default RequestDetails;
