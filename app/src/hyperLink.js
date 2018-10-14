import React, { Component } from 'react';
import { Text, Linking } from 'react-native';

export class HyperLink extends Component {
  constructor(props) {
    super(props);
    this._goToURL = this._goToURL.bind(this);
  }

  render() {
    return (
      <Text style={styles.linkStyle} onPress={this._goToURL}>
        {this.props.title}
      </Text>
    );
  }

  _goToURL() {
    Linking.canOpenURL(this.props.url).then(supported => {
      if (supported) {
        Linking.openURL(this.props.url);
      } else {
        console.log('Don\'t know how to open URI: ' + this.props.url);
      }
    });
  }
}

// CSS
const styles = {
  linkStyle: {
    marginTop: 30,
    fontSize: 10,
    textDecorationLine: 'underline'
  },
}