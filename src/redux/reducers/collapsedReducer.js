export const collapsedReducer = (
  prevState = { isCollapsed: false },
  action
) => {
  // console.log(action);
  switch (action.type) {
    case 'CHANGE_COLLAPSED':
      let newState = { ...prevState };
      newState.isCollapsed = action.payload;
      return newState;
    default:
      return prevState;
  }
}; 
