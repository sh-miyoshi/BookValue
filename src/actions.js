export const setError = (errMsg) => ({
  type: 'SET_ERROR',
  errMsg
})

export const setTitles = (titles, checked) => ({
  type: 'SET_TITLES',
  titles,
})

export const setSearchTitle = (title) => ({
  type: 'SET_SEARCH_TITLE',
  title
})
