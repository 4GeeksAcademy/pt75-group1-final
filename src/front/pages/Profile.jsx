import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import PageWrapper from "../components/PageWrapper";
import "../Profile.css";

const Profile = () => {
  const { store } = useGlobalReducer();
  const user = store.user;

  if (!user) return <p className="text-center py-5">Loading...</p>;

  return (
    <div>
      <PageWrapper>
        <section className="py-5 bg-light">
          <div className="container">

            {/* Profile Header */}
            <div className="profile-header text-center mb-4">
            <img
              src="https://picsum.photos/150"
              alt="User"
              className="profile-picture rounded-circle shadow"
            />
              <h1 className="fw-bold">{user.username}</h1>
              <p className="text-muted">{user.city || "Austin, Texas"}</p>
              <button className="btn btn-dark mx-2">Edit Profile</button>
              <button className="btn btn-outline-secondary">Change Password</button>
            </div>

            {/* Profile Information */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card p-3 mb-3">
                  <h5 className="card-title">Profile Information</h5>
                  <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phone || "Not provided"}</p>
                  <p><strong>Address:</strong> {user.address || "Not provided"}</p>
                </div>
              </div>
            </div>

            {/* Favorite Restaurants */}
            <h2 className="section-title text-center">Favorite Restaurants</h2>
            <div className="row g-4 mb-4">
              {[1, 2, 3].map((id) => (
                <div key={id} className="col-md-4">
                  <div className="card h-100 shadow-sm">
                    <img
                      src={`https://picsum.photos/300?random=${id}`}
                      className="card-img-top"
                      alt="Favorite Restaurant"
                    />
                    <div className="card-body text-center">
                      <h5 className="card-title">Favorite Restaurant #{id}</h5>
                      <button className="btn btn-sm btn-dark mx-1">View</button>
                      <button className="btn btn-sm btn-outline-dark mx-1">Reserve</button>
                      <button className="btn btn-sm btn-outline-danger mx-1">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reservations Section */}
            <h2 className="section-title text-center">Manage Reservations</h2>
            <div className="list-group mb-4">
              {[1, 2].map((id) => (
                <div key={id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>Reservation #{id} - Restaurant Name</span>
                  <div>
                    <button className="btn btn-sm btn-outline-dark mx-1">View</button>
                    <button className="btn btn-sm btn-outline-danger mx-1">Cancel</button>
                  </div>
                </div>
              ))}
            </div>

            {/* User Reviews */}
            <h2 className="section-title text-center">Your Reviews</h2>
            <div className="list-group">
              {[1, 2, 3].map((id) => (
                <div key={id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>Review #{id} - Restaurant Name</span>
                  <div>
                    <button className="btn btn-sm btn-outline-dark mx-1">Edit</button>
                    <button className="btn btn-sm btn-outline-danger mx-1">Delete</button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      </PageWrapper>
    </div>
  );
};

export default Profile;
