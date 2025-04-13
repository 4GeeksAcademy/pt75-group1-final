// import React from "react";
// import { Modal, Button, Form, Row, Col } from "react-bootstrap";
// import useGlobalReducer from "../../hooks/useGlobalReducer";


// const SignUpModal = ({ show, handleClose, switchToLogin }) => {
//     const { dispatch } = useGlobalReducer();

//     const handleSubmit = (e) => {
//         e.preventDefault(); 
//         dispatch({ type: "LOGIN", payload: { name: "Noah" } }); 
//         handleClose(); 
//     };

//     return (
//         <Modal show={show} onHide={handleClose} centered className="signup-modal">
//             <Modal.Body className="p-4">
//                 <div className="modal-content-wrapper">

//                     {/* Header section */}
//                     <div className="text-center mb-5 pt-3">
//                         <h2 className="fw-bold">Join BiteFinder</h2>
//                         <p className="text-muted mb-2">
//                             Create an account to discover great food, leave reviews, and save your favorite spots.
//                         </p>
//                     </div>

//                     {/* Form */}
//                     <Form onSubmit={handleSubmit}>
//                         <Row className="mb-3">
//                             <Col>
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="First Name"
//                                     required
//                                     className="py-3 rounded-0"
//                                 />
//                             </Col>
//                             <Col>
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Last Name"
//                                     required
//                                     className="py-3 rounded-0"
//                                 />
//                             </Col>
//                         </Row>

//                         <Form.Group className="mb-3">
//                             <Form.Control
//                                 type="email"
//                                 placeholder="Email Address"
//                                 required
//                                 className="py-3 rounded-0"
//                             />
//                         </Form.Group>

//                         <Form.Group className="mb-3">
//                             <Form.Control
//                                 type="password"
//                                 placeholder="Password"
//                                 required
//                                 className="py-3 rounded-0"
//                             />
//                         </Form.Group>

//                         <Form.Group className="mb-3">
//                             <Form.Control
//                                 type="text"
//                                 placeholder="Zipcode"
//                                 required
//                                 className="py-3 rounded-0"
//                             />
//                         </Form.Group>

//                         {/* Terms & Conditions */}
//                         <Form.Group className="mb-4">
//                             <Form.Check
//                                 required
//                                 type="checkbox"
//                                 label={
//                                     <span>
//                                         I agree to the{" "}
//                                         <a href="/terms" className="text-decoration-underline text-primary">
//                                             Terms and Conditions
//                                         </a>
//                                     </span>
//                                 }
//                             />
//                         </Form.Group>

//                         <Button variant="dark" type="submit" className="w-100 py-3 rounded-0 fw-bold">
//                             Sign Up
//                         </Button>

//                         <div className="text-center mt-3">
//                             <span className="small">
//                                 Already have an account?{" "}
//                                 <span
//                                     role="button"
//                                     className="text-primary text-decoration-underline"
//                                     onClick={switchToLogin}
//                                 >
//                                     Log In
//                                 </span>
//                             </span>
//                         </div>
//                     </Form>
//                 </div>
//             </Modal.Body>
//         </Modal>
//     );
// };

// export default SignUpModal;