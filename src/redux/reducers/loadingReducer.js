export const loadingReducer = (
  prevState = {
    isLoading: false,
  },
  action
) => {
  switch (action.type) {
    case 'CHANGE_LOADING':
      let newState = { ...prevState };
      newState.isLoading = action.payload;
      return newState;
    case 'LOADED':
      return false;
    default:
      return prevState;
  }
};
