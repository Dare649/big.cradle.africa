"use client";

import React, { useState, useRef } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Type definitions for the table
interface Column<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface Action<T> {
  label: string;
  onClick: (item: T) => void;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[]; // Optional action menu
  itemsPerPageOptions?: number[]; // Options for items per page
  pagination?: boolean; // New optional prop to control pagination visibility
}

const Table = <T extends { _id: string | number }>({
  data,
  columns,
  actions = [],
  itemsPerPageOptions = [5, 10, 20],
  pagination = true, // Default is true (pagination enabled)
}: TableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
  const [selectedItemId, setSelectedItemId] = useState<number | string | null>(null);
  const [view, setView] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentItems = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleActionClick = (id: string | number) => {
    setSelectedItemId(id);
    setView((prev) => !prev);
  };

  return (
    <div className="w-full h-full mt-5">
      <table className="w-full h-full border-2 border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100 border-b-2 border-gray-200">
          <tr className="text-gray-700 border-x-0 capitalize text-md">
            {columns.map((col) => (
              <th key={col.key.toString()} className="lg:py-3 lg:px-6 sm:px-2 sm:py-3 text-left align-middle">
                {col.label}
              </th>
            ))}
            {actions.length > 0 && <th className="lg:py-3 lg:px-6 sm:px-2 sm:py-3 text-left align-middle">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item._id} className="border-b-2 border-gray-200 hover:bg-gray-50">
              {columns.map((col) => (
                <td
                  key={`${item._id}-${String(col.key)}`} // Ensure a unique key for each cell
                  className="lg:py-3 lg:px-6 sm:px-2 sm:py-3 text-left align-middle capitalize"
                >
                  {col.render ? col.render(item) : (item[col.key] as React.ReactNode)}
                </td>
              ))}
              {actions.length > 0 && (
                <td className="relative px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="relative inline-block text-left">
                    <button
                      onClick={() => handleActionClick(item._id)}
                      aria-label="Open actions menu"
                      className="cursor-pointer"
                    >
                      <BsThreeDots className="text-lg" />
                    </button>
                    {selectedItemId === item._id && view && (
                      <div
                        ref={popupRef}
                        className="absolute z-10 w-40 bg-white border rounded shadow-md right-0"
                      >
                        {actions.map((action, index) => (
                          <div
                            key={`${action.label}-${item._id}-${index}`} // Ensure a unique key for each action
                            onClick={() => {
                              action.onClick(item);
                              setView(false);
                            }}
                            className={`cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 ${
                              action.className || ""
                            }`}
                          >
                            {action.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>

      </table>

      {/* Pagination (only rendered if pagination is true) */}
      {pagination && (
        <div className="overflow-x-auto w-full min-w-max mt-2 text-sm">
          <div className="w-full min-w-max bg-white opacity-50 rounded-lg flex justify-between items-center p-3">
            <div className="text-secondary-1">
              {currentPage} - {itemsPerPage} of {data.length}
            </div>
            <div className="flex items-center gap-x-2 text-secondary-1">
              <div className="flex items-center">
                <p className="capitalize mr-2">Rows per page</p>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="cursor-pointer outline-none"
                >
                  {itemsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="hover:bg-primary-1 bg-transparent hover:text-white border-2 border-secondary-1 rounded-lg p-1"
                disabled={currentPage === 1}
              >
                <FaChevronLeft size={15} />
              </button>
              <span>
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="hover:bg-primary-1 bg-transparent hover:text-white border-2 border-secondary-1 rounded-lg p-1"
                disabled={currentPage === totalPages}
              >
                <FaChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
