import { combineReducers } from 'redux'

const initState = {
  titles: null,
  search_title: "",
  error: null,
}

export const stores = (state = initState, action) => {
  switch (action.type) {
    case 'SET_ERROR':
      return Object.assign({}, state, {
        error: action.errMsg,
      })
    case 'SET_TITLES':
      return Object.assign({}, state, {
        titles: action.titles.slice(),
      })
    case 'SET_SEARCH_TITLE':
      return Object.assign({}, state, {
        search_title: action.title,
      })
    default:
      return state
  }
}

export default combineReducers({
  stores
})