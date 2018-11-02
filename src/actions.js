export const setImage = (image) => ({
  type: 'SET_IMAGE',
  image
})

export const setError = (errMsg) => ({
  type: 'SET_ERROR',
  errMsg
})

export const setTitles = (titles, checked) => ({
  type: 'SET_TITLES',
  titles,
  checked
})

export const setChecked = (checked) => ({
  type: 'SET_CHECKED',
  checked
})

export const setSearchTitle = (title) => ({
  type: 'SET_SEARCH_TITLE',
  title
})

export const searchStart = () => ({
  type: 'SEARCH_START'
})