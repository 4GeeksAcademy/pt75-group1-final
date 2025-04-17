// Get saved user and favorites from localStorage
const savedUser = JSON.parse(localStorage.getItem("user"));
const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
const savedReviews = JSON.parse(localStorage.getItem("reviews")) || [];

export const initialStore = () => {
  return {
    message: null,
    user: savedUser || null,
    favorites: savedFavorites,
    reviews: savedReviews,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      },
    ],
  };
};
export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };
    case "add_task":
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        ),
      };
    case "LOGIN_SUCCESS":
      return {
        ...store,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...store,
        user: null,
      };
    case "SET_FAVORITES":
      // Save favorites to localStorage for persistence
      localStorage.setItem("favorites", JSON.stringify(action.payload));
      return {
        ...store,
        favorites: action.payload,
      };
    case "ADD_REVIEW":
      // Add new review to the reviews array
      const updatedReviews = [...(store.reviews || []), action.payload];
      // Save reviews to localStorage for persistence
      localStorage.setItem("reviews", JSON.stringify(updatedReviews));
      return {
        ...store,
        reviews: updatedReviews,
      };
    default:
      throw new Error("Unknown action.");
  }
}
