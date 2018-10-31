import React, { Component } from 'react'
import AppMain from './src/main'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './src/reducer'

const store = createStore(rootReducer)

export default class Main extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppMain />
      </Provider>
    );
  }
}