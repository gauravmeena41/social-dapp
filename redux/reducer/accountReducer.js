const reducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_USER":
      return (state = action.payload);
    case "REMOVE_USER":
      return (state = null);
    default:
      return state;
  }
};

export default reducer;
