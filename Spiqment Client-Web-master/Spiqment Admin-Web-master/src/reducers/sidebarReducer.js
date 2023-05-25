/* eslint-disable prettier/prettier */
export const sidebarReducer = (state = { sidebarShow: true, unfoldable: false }, action) => {
  switch (action.type) {
    case 'SHOW_SIDEBAR_TRUE':
      return {
        ...state,
        sidebarShow: true,
      }
    case 'SHOW_SIDEBAR_FALSE':
      return {
        ...state,
        sidebarShow: false,
      }
    case 'UNFOLDABLE_TRUE':
      return {
        ...state,
        unfoldable: true,
      }
    case 'UNFOLDABLE_FALSE':
      return {
        ...state,
        unfoldable: false,
      }
    default:
      return state
  }
}
