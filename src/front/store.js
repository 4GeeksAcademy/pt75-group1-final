const savedUser = JSON.parse(localStorage.getItem("user"));

export const initialStore = () => {
  return {
    message: null,
    user: savedUser || null,
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
      }
    ]
  };
};

export default function storeReducer(store, action = {}) {
  switch(action.type) {
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };

    case 'add_task':
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map((todo) => 
          todo.id === id ? { ...todo, background: color } : todo
        )
      };

    case 'LOGIN_SUCCESS':
      return {
        ...store,
        user: action.payload
      };

    case 'LOGOUT':
      return {
        ...store,
        user: null
      };

    default:
      throw new Error('Unknown action.');
  }
}
