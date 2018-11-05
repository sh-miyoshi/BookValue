import React, { Component } from 'react'
import { RootStack } from './src/main'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './src/reducer'

const store = createStore(rootReducer)

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <RootStack />
      </Provider>
    );
  }
}