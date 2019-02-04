import React, { Component } from 'react'
import { View, WebView, TextInput, Text } from 'react-native'
import { Button } from 'react-native-elements'
import { Util } from './util'
import { setError, setSearchTitle } from './actions'
import { connect } from 'react-redux'
import { ADMOB_ID } from './env.secret'
import { AdMobBanner } from 'expo'

class BookDetails extends Component {
  render() {
    return (
      <View style={styles.webStyle}>
        <AdMobBanner
          adUnitID={ADMOB_ID}
        />
        <View style={{ alignItems: 'center' }}>
          <View style={styles.reSearchStyle}>
            <Text style={{ textAlignVertical: 'center' }}>再検索ワード：</Text>
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
              onChangeText={(title) => this.props.setSearchTitle(title)}
              value={this.props.stores.search_title}
            />
          </View>
          <Button
            title="もう一度、画像を選択"
            onPress={this._retry}
            buttonStyle={[styles.buttonStyle, styles.retryButtonStyle]}
          />
        </View>
        <WebView
          source={{ uri: Util.getReviewPath(this.props.stores.search_title) }}
        />
      </View>
    )
  }

  _retry = () => {
    this.props.setError(null)
    this.props.navigation.navigate('SelectImage')
  }
}

const mapStateToProps = state => ({
  stores: state.stores
})

const mapDispatchToProps = {
  setError,
  setSearchTitle
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookDetails)

// CSS
const styles = {
  buttonStyle: {
    marginBottom: 5,
    backgroundColor: "rgba(92,99,216,1)",
    width: 300,
    height: 45,
    borderWidth: 0,
    borderRadius: 5
  },
  webStyle: {
    flex: 1
  },
  retryButtonStyle: {
    marginBottom: 30,
    marginTop: 30,
  },
  reSearchStyle: {
    flexDirection: 'row',
    flexWrap: 'nowrap'
  }
}