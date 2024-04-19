// components/SessionExpiredModal.tsx

import { useRouter } from "next/navigation";
import React from "react";

type SessionExpiredModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SessionExpiredModal = () => {
  const router = useRouter();

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg w-full max-w-md p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Session Expired</h2>
            <p className="text-base mt-2">
              Your session has expired. Please sign in again to continue.
            </p>
          </div>
          <div className="flex justify-end">
            {/* <button
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded mr-2"
              onClick={onClose}
            >
              Close
            </button> */}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => {
                router.push("/auth/login");
                // Navigate to sign-in page or open sign-in modal
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 bg-black opacity-50"></div>
    </div>
  );
};

export default SessionExpiredModal;
