"use client";

import { X } from "lucide-react";

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận",         
  mainMessage,                
  subMessage,                 
  confirmLabel = "Confirm",   
  cancelLabel = "Cancel",     
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      
      <div className="bg-white p-8 max-w-[600px] w-full mx-4 relative shadow-2xl rasa-font">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors cursor-pointer"
        >
          <X className="w-7 h-7" strokeWidth={1.5} />
        </button>

        <h2 className="text-[40px] rasa-font text-center font-bold mb-5 text-black">
          {title}
        </h2>

        {mainMessage && (
          <p className="text-[24px] text-center font-bold text-black leading-snug mb-2">
            {mainMessage}
          </p>
        )}

        {subMessage && (
          <p className="text-[20px] text-center text-black leading-snug mb-8">
            {subMessage}
          </p>
        )}

        <div className="flex justify-center items-center gap-20">
          <button
            onClick={onConfirm}
            className="bg-[#64C9FF] rasa-font text-white text-[16px] font-medium py-2 px-18 rounded-full transition-colors shadow-sm cursor-pointer"
          >
            {confirmLabel}
          </button>
          
          <button
            onClick={onClose}
            className="bg-[#C0C0C0] rasa-font text-white text-[16px] font-medium py-2 px-18 rounded-full transition-colors shadow-sm cursor-pointer"
          >
            {cancelLabel}
          </button>
        </div>

      </div>
    </div>
  );
}