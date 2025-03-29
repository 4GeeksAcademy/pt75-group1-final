export const initialStore = () => {
  return {
    message: null,
    reviews: [],
    loggedInUser: null,
    showLoginModal: false,   // ✅ NEW
    showSignUpModal: false,  // ✅ NEW
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return { ...store, message: action.payload };

    case "ADD_REVIEW":
      return { ...store, reviews: [...store.reviews, action.payload] };

    case "LOGIN":
      return { ...store, loggedInUser: action.payload };

    case "LOGOUT":
      return { ...store, loggedInUser: null };

    case "SHOW_LOGIN_MODAL":
      return { ...store, showLoginModal: true };

    case "HIDE_LOGIN_MODAL":
      return { ...store, showLoginModal: false };

    case "SHOW_SIGNUP_MODAL":
      return { ...store, showSignUpModal: true };

    case "HIDE_SIGNUP_MODAL":
      return { ...store, showSignUpModal: false };

    default:
      throw Error("Unknown action.");
  }
}
