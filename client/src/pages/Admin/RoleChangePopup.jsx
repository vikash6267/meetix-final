import React, { useState } from "react";
import axios from "axios";

const RoleChangePopup = ({ selectedUser, setSelectedUser }) => {
  const [newRole, setNewRole] = useState(selectedUser?.isAdmin === "true" ? "admin" : "user");
  const [showModal, setShowModal] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpenModal = (e) => {
    setNewRole(e.target.value);
    setShowModal(true);
  };

  const handleSendOTP = async () => {
    setLoading(true);
    try {
      const res = await axios.post("https://meetix.mahitechnocrafts.in/api/v1/user/request-role-change-otp", {
        email: adminEmail,
        userId: selectedUser._id,
        role: newRole,
      });
      if (res.data.message) {
        setOtpSent(true);
        alert("OTP sent to your email.");
      }
    } catch (err) {
      console.error(err.response.data.message);
      alert(err.response.data.message || "Failed to send OTP");
    }
    setLoading(false);
  };

  const handleVerifyAndChange = async () => {
    setLoading(true);
    try {
      const res = await axios.post("https://meetix.mahitechnocrafts.in/api/v1/user/verify-role-change-otp", {
        email: adminEmail,
        otp,
        userId: selectedUser._id,
        role: newRole,
      });
      if (res.data.message) {
        alert("Role updated successfully!");
        setSelectedUser((prev) => ({
          ...prev,
          isAdmin: newRole === "admin" ? "true" : "false",
        }));
        setShowModal(false);
        setOtp("");
        setAdminEmail("");
        setOtpSent(false);
      }
    } catch (err) {
      console.error(err);
      alert("OTP verification failed");
    }
    setLoading(false);
  };

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Change Role</label>
      <select
        className="border border-gray-300 rounded px-3 py-2 text-sm"
        value={newRole}
        onChange={handleOpenModal}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md animate-fade-in">
            <h2 className="text-lg font-semibold mb-4">Confirm Role Change</h2>

            <p className="text-sm mb-2">
              You are changing the role to <strong>{newRole.toUpperCase()}</strong>
            </p>

            <label className="block text-sm font-medium text-gray-700 mt-2">Admin Email</label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded mt-1 text-sm"
              placeholder="Enter admin email"
            />

            {otpSent && (
              <>
                <label className="block text-sm font-medium text-gray-700 mt-3">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border px-3 py-2 rounded mt-1 text-sm"
                  placeholder="Enter 6-digit OTP"
                />
              </>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded text-sm"
                onClick={() => {
                  setShowModal(false);
                  setOtpSent(false);
                  setAdminEmail("");
                  setOtp("");
                }}
              >
                Cancel
              </button>

              {!otpSent ? (
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
                  onClick={handleSendOTP}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              ) : (
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded text-sm"
                  onClick={handleVerifyAndChange}
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify & Change"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleChangePopup;
