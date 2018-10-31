import { combineReducers } from 'redux'

const initState = {
  image: null,
  titles: null,
  checked: new Array(),
  search_title: "",
  error: null,
  waiting_search: false,
}

export const stores = (state = initState, action) => {
  switch (action.type) {
    case 'SET_IMAGE':
      return Object.assign({}, state, {
        error: null,
        image: action.image
      })
    case 'SET_ERROR':
      return Object.assign({}, state, {
        error: action.errMsg,
        waiting_search: false
      })
    case 'SET_TITLES':
      return Object.assign({}, state, {
        titles: action.titles.slice(),
        checked: action.checked.slice(),
      })
    case 'SET_CHECKED':
      return Object.assign({}, state, {
        checked: action.checked.slice(),
      })
    case 'SET_SEARCH_TITLE':
      return Object.assign({}, state, {
        search_title: action.title,
      })
    case 'SEARCH_START':
      return Object.assign({}, state, {
        waiting_search: action.true,
      })
    default:
      return state
  }
}

export default combineReducers({
  stores
})