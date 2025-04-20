import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import PageWrapper from "../components/PageWrapper";
import "../Profile.css";

const Profile = () => {
  const { store, dispatch } = useGlobalReducer();
  const [loading, setLoading] = useState(true);
  const [localUser, setLocalUser] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    console.log("🐛 JWT Token being sent to /api/profile:", token);

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (!data?.profile?.id) throw new Error("Invalid profile data");
        dispatch({ type: "LOGIN_SUCCESS", payload: data.profile });
        setLocalUser(data.profile);
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ Fetch error:", err);
        localStorage.removeItem("access_token");
        setLoading(false);
      });
  }, []);

  const initials = (localUser?.first_name?.[0] || "") + (localUser?.last_name?.[0] || "");
  const bgColor = stringToColor(localUser?.username || "U");

  function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return "#" + "00000".substring(0, 6 - c.length) + c;
  }



  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePic(reader.result); // still for local preview
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            ...localUser,
            profile_picture: reader.result, // 🔥 update global state immediately
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };


  const handleEditProfile = async (e) => {
    e.preventDefault();
    const form = e.target;
    const token = localStorage.getItem("access_token");

    const updatedData = {
      first_name: form.first_name.value,
      last_name: form.last_name.value,
      email: form.email.value,
      // username: localUser.username,
      username: form.username.value,
      is_active: true,
      profile_picture: profilePic || localUser.profile_picture
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

      if (!res.ok) throw new Error("Update failed");

      const updatedUser = await res.json();
      setLocalUser(updatedUser);
      dispatch({ type: "LOGIN_SUCCESS", payload: updatedUser });
      setEditModalOpen(false);
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const form = e.target;
    const token = localStorage.getItem("access_token");

    const body = {
      current_password: form.current_password.value,
      new_password: form.new_password.value
    };

    if (form.new_password.value !== form.confirm_password.value) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error("Change password failed");

      setChangeModalOpen(false);
      form.reset();
      alert("Password changed successfully.");
    } catch (err) {
      alert("Failed to change password.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account?")) return;
    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${localUser.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete account");

      dispatch({ type: "LOGOUT" });
      localStorage.removeItem("access_token");
      window.location.href = "/";
    } catch (err) {
      alert("Could not delete account.");
    }
  };

  if (loading) return <p className="text-center py-5">Loading...</p>;
  if (!localUser) return <p className="text-center py-5">You must be logged in.</p>;

  return (
    <PageWrapper>
      <section className="py-5 bg-light">
        <div className="container text-center">

          <div className="position-relative d-inline-block mb-3">
            <div
              className="rounded-circle shadow d-flex align-items-center justify-content-center"
              style={{
                width: "120px",
                height: "120px",
                backgroundColor: bgColor,
                fontSize: "36px",
                color: "white",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div className="position-relative w-100 h-100">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : localUser?.profile_picture ? (
                  <img
                    src={localUser.profile_picture}
                    alt="Profile"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="d-flex justify-content-center align-items-center w-100 h-100"
                    style={{ backgroundColor: bgColor, color: "white", fontSize: "2rem" }}
                  >
                    {initials}
                  </div>
                )}

                <label
                  htmlFor="profilePicUpload"
                  className="position-absolute bottom-0 end-0 text-dark"
                  style={{
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <span className="fa-stack" style={{ fontSize: "0.8rem" }}>
                    <i className="fas fa-circle fa-stack-2x text-white"></i>
                    <i className="fas fa-camera fa-stack-1x text-dark"></i>
                    <i
                      className="fas fa-plus fa-stack-1x text-danger"
                      style={{ fontSize: "0.5rem", top: "0", right: "0" }}
                    ></i>
                  </span>
                </label>

                <input
                  id="profilePicUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  style={{ display: "none" }}
                />
              </div>

            </div>
          </div>

          <h2 className="fw-bold mt-3">{localUser.first_name} {localUser.last_name}</h2>
          <p className="text-muted">@{localUser.username}</p>


          <div className="mb-4">
            <button className="btn btn-dark mx-2" onClick={() => setEditModalOpen(true)}>Edit Profile</button>
            <button className="btn btn-outline-secondary" onClick={() => setChangeModalOpen(true)}>Change Password</button>
          </div>
        </div>

        <div className={`modal fade ${editModalOpen ? "show d-block" : ""}`} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleEditProfile}>
                <div className="modal-header">
                  <h5>Edit Profile</h5>
                  <button type="button" className="btn-close" onClick={() => setEditModalOpen(false)} />
                </div>
                <div className="modal-body">
                  <input name="first_name" className="form-control mb-2" placeholder="First Name" defaultValue={localUser.first_name} />
                  <input name="last_name" className="form-control mb-2" placeholder="Last Name" defaultValue={localUser.last_name} />
                  <input name="email" type="email" className="form-control mb-2" placeholder="Email" defaultValue={localUser.email} />

                  <input name="username" className="form-control mb-2" placeholder="Username" defaultValue={localUser.username} />


                </div>
                <div className="modal-footer d-flex justify-content-between">
                  <button type="button" className="btn btn-danger" onClick={handleDeleteAccount}>Delete Account</button>
                  <div>
                    <button className="btn btn-dark" type="submit">Save</button>
                    <button className="btn btn-secondary ms-2" onClick={() => setEditModalOpen(false)}>Cancel</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className={`modal fade ${changeModalOpen ? "show d-block" : ""}`} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleChangePassword}>
                <div className="modal-header">
                  <h5>Change Password</h5>
                  <button type="button" className="btn-close" onClick={() => setChangeModalOpen(false)} />
                </div>
                <div className="modal-body">
                  <input name="current_password" type="password" className="form-control mb-2" placeholder="Current Password" required />
                  <input name="new_password" type="password" className="form-control mb-2" placeholder="New Password" required />
                  <input name="confirm_password" type="password" className="form-control mb-2" placeholder="Confirm New Password" required />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-dark" type="submit">Save</button>
                  <button className="btn btn-secondary" onClick={() => setChangeModalOpen(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Profile;
