// import React, { useEffect, useState } from "react";
// import useGlobalReducer from "../hooks/useGlobalReducer";
// import PageWrapper from "../components/PageWrapper";
// import "../Profile.css";

// const Profile = () => {
//   const { store, dispatch } = useGlobalReducer();
//   const [loading, setLoading] = useState(true);
//   const [localUser, setLocalUser] = useState(null);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [changeModalOpen, setChangeModalOpen] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     // fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
//     //   method: "GET",
//     //   headers: {
//     //     "Content-Type": "application/json",
//     //     Authorization: `Bearer ${token}`
//     //   }
//     // })


//     //   .then((res) => res.json())
//     //   .then((data) => {
//     //     if (!data?.profile?.id) throw new Error("Invalid profile data");
//     //     dispatch({ type: "LOGIN_SUCCESS", payload: data.profile });
//     //     setLocalUser(data.profile);
//     //     setLoading(false);
//     //   })
//     //   .catch((err) => {
//     //     console.error("Failed to fetch profile:", err);
//     //     localStorage.removeItem("access_token");
//     //     setLoading(false);
//     //   });
//     fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         // "Content-Type": "application/json"
//       }
//     })
//       // 
//       .then(res => res.json())
//       .then(data => {
//         console.log("✅ Profile data:", data);
//         console.log("➡️ Profile API status:", res.status);
//         return res.text(); // 👈 parse as text to see the error!
//       })
//       .then((text) => {
//         console.log("📦 Raw response:", text);
//         try {
//           const data = JSON.parse(text);
//           if (!data?.profile?.id) throw new Error("Invalid profile data");
//           dispatch({ type: "LOGIN_SUCCESS", payload: data.profile });
//           setLocalUser(data.profile);
//         } catch (e) {
//           console.error("❌ JSON parse error:", e);
//         }
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("❌ Fetch error:", err);
//         localStorage.removeItem("access_token");
//         setLoading(false);
//       });
      

//   }, []);

//   const initials = (localUser?.first_name?.[0] || "") + (localUser?.last_name?.[0] || "");
//   const bgColor = stringToColor(localUser?.username || "U");

//   function stringToColor(str) {
//     let hash = 0;
//     for (let i = 0; i < str.length; i++) {
//       hash = str.charCodeAt(i) + ((hash << 5) - hash);
//     }
//     const c = (hash & 0x00ffffff).toString(16).toUpperCase();
//     return "#" + "00000".substring(0, 6 - c.length) + c;
//   }

//   const handleEditProfile = async (e) => {
//     e.preventDefault();
//     const form = e.target;
//     const token = localStorage.getItem("access_token");

//     const updatedData = {
//       first_name: form.first_name.value,
//       last_name: form.last_name.value,
//       email: form.email.value,
//       username: localUser.username,
//       is_active: true,
//     };

//     try {
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${localUser.id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(updatedData),
//       });

//       if (!res.ok) throw new Error("Update failed");

//       const updatedUser = await res.json();
//       setLocalUser(updatedUser);
//       dispatch({ type: "LOGIN_SUCCESS", payload: updatedUser });
//       setEditModalOpen(false);
//     } catch (err) {
//       alert("Update failed");
//     }
//   };

//   const handleChangePassword = async (e) => {
//     e.preventDefault();
//     const form = e.target;
//     const token = localStorage.getItem("access_token");

//     const body = {
//       current_password: form.current_password.value,
//       new_password: form.new_password.value,
//     };

//     if (form.new_password.value !== form.confirm_password.value) {
//       alert("Passwords do not match.");
//       return;
//     }

//     try {
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/change-password`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(body),
//       });

//       if (!res.ok) throw new Error("Change password failed");

//       setChangeModalOpen(false);
//       form.reset();
//       alert("Password changed successfully.");
//     } catch (err) {
//       alert("Failed to change password.");
//     }
//   };

//   const handleDeleteAccount = async () => {
//     if (!confirm("Are you sure you want to delete your account?")) return;
//     const token = localStorage.getItem("access_token");

//     try {
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${localUser.id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) throw new Error("Failed to delete account");

//       dispatch({ type: "LOGOUT" });
//       localStorage.removeItem("access_token");
//       window.location.href = "/";
//     } catch (err) {
//       alert("Could not delete account.");
//     }
//   };

//   if (loading) return <p className="text-center py-5">Loading...</p>;
//   if (!localUser) return <p className="text-center py-5">You must be logged in.</p>;

//   return (
//     <PageWrapper>
//       <section className="py-5 bg-light">
//         <div className="container text-center">
//           {/* Avatar */}
//           <div className="position-relative d-inline-block mb-3">
//             <div
//               className="rounded-circle shadow d-flex align-items-center justify-content-center"
//               style={{
//                 width: "120px",
//                 height: "120px",
//                 backgroundColor: bgColor,
//                 fontSize: "36px",
//                 color: "white",
//                 position: "relative",
//                 cursor: "pointer",
//               }}
//             >
//               {initials}
//               <div
//                 className="position-absolute bottom-0 end-0 bg-white text-dark border rounded-circle p-1"
//                 style={{
//                   fontSize: "14px",
//                   width: "28px",
//                   height: "28px",
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//               >
//                 <i className="fa fa-camera me-1" />
//                 <span style={{ fontSize: "0.7rem", marginTop: "2px" }}>+</span>
//               </div>
//             </div>
//           </div>

//           {localUser && (
//             <h2 className="fw-bold mt-3">{localUser.first_name} {localUser.last_name}</h2>
//           )}



//           <div className="mb-4">
//             <button className="btn btn-dark mx-2" onClick={() => setEditModalOpen(true)}>Edit Profile</button>
//             <button className="btn btn-outline-secondary" onClick={() => setChangeModalOpen(true)}>Change Password</button>
//           </div>
//         </div>

//         <div className={`modal fade ${editModalOpen ? "show d-block" : ""}`} tabIndex="-1">
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <form onSubmit={handleEditProfile}>
//                 <div className="modal-header">
//                   <h5>Edit Profile</h5>
//                   <button type="button" className="btn-close" onClick={() => setEditModalOpen(false)} />
//                 </div>
//                 <div className="modal-body">
//                   <input name="first_name" className="form-control mb-2" placeholder="First Name" defaultValue={localUser.first_name} />
//                   <input name="last_name" className="form-control mb-2" placeholder="Last Name" defaultValue={localUser.last_name} />
//                   <input name="email" type="email" className="form-control mb-2" placeholder="Email" defaultValue={localUser.email} />
//                 </div>
//                 <div className="modal-footer d-flex justify-content-between">
//                   <button type="button" className="btn btn-danger" onClick={handleDeleteAccount}>Delete Account</button>
//                   <div>
//                     <button className="btn btn-dark" type="submit">Save</button>
//                     <button className="btn btn-secondary ms-2" onClick={() => setEditModalOpen(false)}>Cancel</button>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>

//         <div className={`modal fade ${changeModalOpen ? "show d-block" : ""}`} tabIndex="-1">
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <form onSubmit={handleChangePassword}>
//                 <div className="modal-header">
//                   <h5>Change Password</h5>
//                   <button type="button" className="btn-close" onClick={() => setChangeModalOpen(false)} />
//                 </div>
//                 <div className="modal-body">
//                   <input name="current_password" type="password" className="form-control mb-2" placeholder="Current Password" required />
//                   <input name="new_password" type="password" className="form-control mb-2" placeholder="New Password" required />
//                   <input name="confirm_password" type="password" className="form-control mb-2" placeholder="Confirm New Password" required />
//                 </div>
//                 <div className="modal-footer">
//                   <button className="btn btn-dark" type="submit">Save</button>
//                   <button className="btn btn-secondary" onClick={() => setChangeModalOpen(false)}>Cancel</button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </section>
//     </PageWrapper>
//   );
// };

// export default Profile;
// import React, { useEffect, useState } from "react";
// import useGlobalReducer from "../hooks/useGlobalReducer";
// import PageWrapper from "../components/PageWrapper";
// import "../Profile.css";

// const Profile = () => {
//   const { store, dispatch } = useGlobalReducer();
//   const [loading, setLoading] = useState(true);
//   const [localUser, setLocalUser] = useState(null);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [changeModalOpen, setChangeModalOpen] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`
//       }
//     })
//       .then(res => res.json())
//       .then(data => {
//         console.log("✅ Profile data:", data);
//         if (!data?.profile?.id) throw new Error("Invalid profile data");
//         dispatch({ type: "LOGIN_SUCCESS", payload: data.profile });
//         setLocalUser(data.profile);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error("❌ Fetch error:", err);
//         localStorage.removeItem("access_token");
//         setLoading(false);
//       });
//   }, []);

//   const initials = (localUser?.first_name?.[0] || "") + (localUser?.last_name?.[0] || "");
//   const bgColor = stringToColor(localUser?.username || "U");

//   function stringToColor(str) {
//     let hash = 0;
//     for (let i = 0; i < str.length; i++) {
//       hash = str.charCodeAt(i) + ((hash << 5) - hash);
//     }
//     const c = (hash & 0x00ffffff).toString(16).toUpperCase();
//     return "#" + "00000".substring(0, 6 - c.length) + c;
//   }

//   const handleEditProfile = async (e) => {
//     e.preventDefault();
//     const form = e.target;
//     const token = localStorage.getItem("access_token");

//     const updatedData = {
//       first_name: form.first_name.value,
//       last_name: form.last_name.value,
//       email: form.email.value,
//       username: localUser.username,
//       is_active: true
//     };

//     try {
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${localUser.id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(updatedData)
//       });

//       if (!res.ok) throw new Error("Update failed");

//       const updatedUser = await res.json();
//       setLocalUser(updatedUser);
//       dispatch({ type: "LOGIN_SUCCESS", payload: updatedUser });
//       setEditModalOpen(false);
//     } catch (err) {
//       alert("Update failed");
//     }
//   };

//   const handleChangePassword = async (e) => {
//     e.preventDefault();
//     const form = e.target;
//     const token = localStorage.getItem("access_token");

//     const body = {
//       current_password: form.current_password.value,
//       new_password: form.new_password.value
//     };

//     if (form.new_password.value !== form.confirm_password.value) {
//       alert("Passwords do not match.");
//       return;
//     }

//     try {
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/change-password`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(body)
//       });

//       if (!res.ok) throw new Error("Change password failed");

//       setChangeModalOpen(false);
//       form.reset();
//       alert("Password changed successfully.");
//     } catch (err) {
//       alert("Failed to change password.");
//     }
//   };

//   const handleDeleteAccount = async () => {
//     if (!confirm("Are you sure you want to delete your account?")) return;
//     const token = localStorage.getItem("access_token");

//     try {
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${localUser.id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       if (!res.ok) throw new Error("Failed to delete account");

//       dispatch({ type: "LOGOUT" });
//       localStorage.removeItem("access_token");
//       window.location.href = "/";
//     } catch (err) {
//       alert("Could not delete account.");
//     }
//   };

//   if (loading) return <p className="text-center py-5">Loading...</p>;
//   if (!localUser) return <p className="text-center py-5">You must be logged in.</p>;

//   return (
//     <PageWrapper>
//       <section className="py-5 bg-light">
//         <div className="container text-center">
//           <div className="position-relative d-inline-block mb-3">
//             <div
//               className="rounded-circle shadow d-flex align-items-center justify-content-center"
//               style={{
//                 width: "120px",
//                 height: "120px",
//                 backgroundColor: bgColor,
//                 fontSize: "36px",
//                 color: "white",
//                 position: "relative",
//                 cursor: "pointer"
//               }}
//             >
//               {initials}
//               <div
//                 className="position-absolute bottom-0 end-0 bg-white text-dark border rounded-circle p-1"
//                 style={{
//                   fontSize: "14px",
//                   width: "28px",
//                   height: "28px",
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center"
//                 }}
//               >
//                 <i className="fa fa-camera me-1" />
//                 <span style={{ fontSize: "0.7rem", marginTop: "2px" }}>+</span>
//               </div>
//             </div>
//           </div>

//           <h2 className="fw-bold mt-3">{localUser.first_name} {localUser.last_name}</h2>

//           <div className="mb-4">
//             <button className="btn btn-dark mx-2" onClick={() => setEditModalOpen(true)}>Edit Profile</button>
//             <button className="btn btn-outline-secondary" onClick={() => setChangeModalOpen(true)}>Change Password</button>
//           </div>
//         </div>

//         {/* Edit Profile Modal */}
//         <div className={`modal fade ${editModalOpen ? "show d-block" : ""}`} tabIndex="-1">
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <form onSubmit={handleEditProfile}>
//                 <div className="modal-header">
//                   <h5>Edit Profile</h5>
//                   <button type="button" className="btn-close" onClick={() => setEditModalOpen(false)} />
//                 </div>
//                 <div className="modal-body">
//                   <input name="first_name" className="form-control mb-2" placeholder="First Name" defaultValue={localUser.first_name} />
//                   <input name="last_name" className="form-control mb-2" placeholder="Last Name" defaultValue={localUser.last_name} />
//                   <input name="email" type="email" className="form-control mb-2" placeholder="Email" defaultValue={localUser.email} />
//                 </div>
//                 <div className="modal-footer d-flex justify-content-between">
//                   <button type="button" className="btn btn-danger" onClick={handleDeleteAccount}>Delete Account</button>
//                   <div>
//                     <button className="btn btn-dark" type="submit">Save</button>
//                     <button className="btn btn-secondary ms-2" onClick={() => setEditModalOpen(false)}>Cancel</button>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>

//         {/* Change Password Modal */}
//         <div className={`modal fade ${changeModalOpen ? "show d-block" : ""}`} tabIndex="-1">
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <form onSubmit={handleChangePassword}>
//                 <div className="modal-header">
//                   <h5>Change Password</h5>
//                   <button type="button" className="btn-close" onClick={() => setChangeModalOpen(false)} />
//                 </div>
//                 <div className="modal-body">
//                   <input name="current_password" type="password" className="form-control mb-2" placeholder="Current Password" required />
//                   <input name="new_password" type="password" className="form-control mb-2" placeholder="New Password" required />
//                   <input name="confirm_password" type="password" className="form-control mb-2" placeholder="Confirm New Password" required />
//                 </div>
//                 <div className="modal-footer">
//                   <button className="btn btn-dark" type="submit">Save</button>
//                   <button className="btn btn-secondary" onClick={() => setChangeModalOpen(false)}>Cancel</button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </section>
//     </PageWrapper>
//   );
// };

// export default Profile;


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

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("✅ Profile data:", data);
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

  const handleEditProfile = async (e) => {
    e.preventDefault();
    const form = e.target;
    const token = localStorage.getItem("access_token");

    const updatedData = {
      first_name: form.first_name.value,
      last_name: form.last_name.value,
      email: form.email.value,
      username: localUser.username,
      is_active: true
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${localUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
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
          Authorization: `Bearer ${token}`
        }
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
                cursor: "pointer"
              }}
            >
              {initials}
              <div
                className="position-absolute bottom-0 end-0 bg-white text-dark border rounded-circle p-1"
                style={{
                  fontSize: "14px",
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <i className="fa fa-camera me-1" />
                <span style={{ fontSize: "0.7rem", marginTop: "2px" }}>+</span>
              </div>
            </div>
          </div>

          <h2 className="fw-bold mt-3">{localUser.first_name} {localUser.last_name}</h2>

          <div className="mb-4">
            <button className="btn btn-dark mx-2" onClick={() => setEditModalOpen(true)}>Edit Profile</button>
            <button className="btn btn-outline-secondary" onClick={() => setChangeModalOpen(true)}>Change Password</button>
          </div>
        </div>

        {/* Edit Profile Modal */}
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

        {/* Change Password Modal */}
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
