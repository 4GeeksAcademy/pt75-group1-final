// import React from "react";
// import { Modal, Button, Form } from "react-bootstrap";
// import useGlobalReducer from "../../hooks/useGlobalReducer";


// const LoginModal = ({ show, handleClose, switchToSignup }) => {
// const { dispatch } = useGlobalReducer();

// const handleSubmit = (e) => {
//     e.preventDefault();
//     dispatch({ type: "LOGIN", payload: { name: "Noah" } }); // Fake login
//     handleClose(); // Close the modal
//   };
  
//   return (
//     <Modal show={show} onHide={handleClose} centered>
//       <Modal.Body>
//         {/* Header */}
//         <div className="text-center mb-5 pt-3">
//           <h2 className="fw-bold">Welcome Back</h2>
//           <p className="text-muted mb-0">
//             Log in to continue discovering and saving your favorite restaurants.
//           </p>
//         </div>

//         {/* Form */}
//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-3">
//             <Form.Control
//               type="text"
//               placeholder="Username or Email"
//               required
//               className="py-3 rounded-0"
//             />
//           </Form.Group>

//           <Form.Group className="mb-4">
//             <Form.Control
//               type="password"
//               placeholder="Password"
//               required
//               className="py-3 rounded-0"
//             />
//           </Form.Group>

//           <Button variant="dark" type="submit" className="w-100 py-3 rounded-0 fw-bold">
//             Log In
//           </Button>

//           <div className="text-center mt-3">
//             <span className="small">
//               New to BiteFinder?{" "}
//               <span
//                 role="button"
//                 className="text-primary text-decoration-underline"
//                 onClick={switchToSignup}
//               >
//                 Sign Up
//               </span>
//             </span>
//           </div>
//         </Form>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default LoginModal;
