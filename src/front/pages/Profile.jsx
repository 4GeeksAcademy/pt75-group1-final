import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import PageWrapper from "../components/PageWrapper";
import "../Profile.css";

const Profile = () => {
  const { store, dispatch } = useGlobalReducer();
  const [loading, setLoading] = useState(true);
  const [localUser, setLocalUser] = useState(store.user);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(import.meta.env.VITE_BACKEND_URL + "/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        dispatch({ type: "LOGIN_SUCCESS", payload: data.profile });
        setLocalUser(data.profile);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch user profile:", err.message);
        localStorage.removeItem("access_token");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center py-5">Loading...</p>;
  if (!localUser) return <p className="text-center py-5">You must be logged in.</p>;

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const token = localStorage.getItem("access_token");

    const updatedData = {
      first_name: form.first_name.value,
      last_name: form.last_name.value,
      phone: form.phone.value,
      address: form.address.value,
      username: localUser.username, // send required fields
      email: localUser.email,
      password: localUser.password,
      is_active: localUser.is_active,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${localUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const updatedUser = await res.json();
      setLocalUser(updatedUser);
      dispatch({ type: "LOGIN_SUCCESS", payload: updatedUser });
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Update error:", err);
      alert("Could not update profile.");
    }
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const form = e.target;
    const token = localStorage.getItem("access_token");

    const current_password = form.current_password.value;
    const new_password = form.new_password.value;
    const confirm_password = form.confirm_password.value;

    if (new_password !== confirm_password) {
      alert("New passwords do not match.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ current_password, new_password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Failed to change password");
      }

      alert("Password changed successfully.");
      form.reset(); // clear form
      document.querySelector("#changePasswordModal .btn-close").click(); // close modal
    } catch (err) {
      console.error("Change password error:", err.message);
      alert(err.message);
    }
  };


  return (
    <div>
      <PageWrapper>
        <section className="py-5 bg-light">
          <div className="container">

            <div className="profile-header text-center mb-4">
              <img
                src="/assets/img/user-placeholder.png"
                alt="User"
                className="profile-picture rounded-circle shadow"
              />
              <h1 className="fw-bold">{localUser.username}</h1>
              <p className="text-muted">{localUser.city || "Austin, Texas"}</p>
              <button className="btn btn-dark mx-2">Edit Profile</button>
              <button
                className="btn btn-outline-secondary"
                data-bs-toggle="modal"
                data-bs-target="#changePasswordModal"
              >
                Change Password
              </button>
              {/* Change Password Modal */}
              <div className="modal fade" id="changePasswordModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <form onSubmit={handleChangePassword}>
                      <div className="modal-header">
                        <h5 className="modal-title">Change Password</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div className="modal-body">
                        <div className="mb-3">
                          <label className="form-label">Current Password</label>
                          <input type="password" className="form-control" name="current_password" required />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">New Password</label>
                          <input type="password" className="form-control" name="new_password" required />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Confirm New Password</label>
                          <input type="password" className="form-control" name="confirm_password" required />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button type="submit" className="btn btn-dark">Save</button>
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card p-3 mb-3">
                  <h5 className="card-title">Edit Profile Information</h5>
                  <form onSubmit={handleProfileUpdate}>
                    <div className="mb-2">
                      <label className="form-label">First Name</label>
                      <input type="text" className="form-control" name="first_name" defaultValue={localUser.first_name} required />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Last Name</label>
                      <input type="text" className="form-control" name="last_name" defaultValue={localUser.last_name} required />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Phone</label>
                      <input type="text" className="form-control" name="phone" defaultValue={localUser.phone || ""} />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Address</label>
                      <input type="text" className="form-control" name="address" defaultValue={localUser.address || ""} />
                    </div>
                    <button type="submit" className="btn btn-dark mt-2">Save Changes</button>
                  </form>
                </div>
              </div>
            </div>



          </div>
        </section>
      </PageWrapper>
    </div>
  );
};

export default Profile;
