import React from 'react';

interface ModalPopupProps {
  title: string;
  message: string;
  onClose: (value: boolean) => void;
}

const ModalPopup: React.FC<ModalPopupProps> = ({ title, message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-[90%] max-w-md text-center">
        <h2 className="text-xl font-semibold text-blue-600 mb-2">{title}</h2>
        <p className="text-gray-700 text-lg">{message}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => onClose(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ModalPopup;
