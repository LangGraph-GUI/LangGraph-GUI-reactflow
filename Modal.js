// Modal.js

import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ title, children, onClose, onConfirm, inputValue, setInputValue }) => {
    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative bg-white rounded-lg shadow-lg max-w-md p-6">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                </div>
                <div className="mb-4">{children}</div>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;