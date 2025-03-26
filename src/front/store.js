export const initialStore = () => {
  return {
    message: null,
    reviews: [], // ✅ added to store
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "ADD_REVIEW":
      return {
        ...store,
        reviews: [...store.reviews, action.payload],
      };

    default:
      throw Error("Unknown action.");
  }
}
