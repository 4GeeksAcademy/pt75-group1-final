import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Contact = () => {
  return (
    <div>
      <Navbar />
      <section className="container py-5">
        <h1 className="fw-bold mb-4 text-center">Contact Us</h1>
        <div className="row">
          <div className="col-md-6">
            <h5>Get in Touch</h5>
            <p>Have questions or feedback? We'd love to hear from you!</p>
            <ul className="list-unstyled">
              <li>Email: info@bitefinder.com</li>
              <li>Phone: (123) 456-7890</li>
              <li>Address: 123 Flavor Street, Yumtown, USA</li>
            </ul>
          </div>
          <div className="col-md-6">
            <form>
              <div className="mb-3">
                <label className="form-label">Your Name</label>
                <input type="text" className="form-control" placeholder="John Doe" />
              </div>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input type="email" className="form-control" placeholder="name@example.com" />
              </div>
              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea className="form-control" rows="4" placeholder="Your message here..." />
              </div>
              <button type="submit" className="btn btn-dark">Send Message</button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
