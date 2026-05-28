import React from 'react';

export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Tính toán sliding window (tối đa hiển thị 5 trang)
  const MAX_PAGES = 5;
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + MAX_PAGES - 1);

  if (endPage - startPage + 1 < MAX_PAGES) {
    startPage = Math.max(1, endPage - MAX_PAGES + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-4 py-1.5 border cursor-pointer border-gray-200 rounded-md bg-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 text-sm font-medium transition-colors duration-200"
      >
        Trước
      </button>
      
      <div className="flex gap-1">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-md border text-sm font-medium transition-colors duration-200 cursor-pointer ${
              currentPage === p
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-4 py-1.5 border cursor-pointer border-gray-200 rounded-md bg-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 text-sm font-medium transition-colors duration-200"
      >
        Sau
      </button>
    </div>
  );
}
