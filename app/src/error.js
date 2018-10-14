import React, { Component } from 'react';
import { Text } from 'react-native';

export class Error extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Text style={[styles.textStyle, styles.errorTextStyle]}>
        エラー発生！{"\n"}
        {this.props.message}
      </Text>
    )
  }
}

const styles = {
  textStyle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    marginHorizontal: 15
  },
  errorTextStyle: {
    color: "rgba(255,0,0,1)",
  },
}