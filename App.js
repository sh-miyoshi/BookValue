import React, { Component } from 'react'
import { AppContainer } from './src/main'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './src/reducer'

const store = createStore(rootReducer)

export default function App() {
  return (
    <Provider store={store}>
      <AppContainer
        ref={nav => {
          this.navigator = nav;
        }}
      />
    </Provider>
  )
}