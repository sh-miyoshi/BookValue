import React, { Component } from 'react'
import { View, WebView, TextInput, Text, Clipboard } from 'react-native'
import { Tooltip } from 'react-native-elements'
import { Util } from './util'
import { setSearchTitle } from './actions'
import { connect } from 'react-redux'
import { ADMOB_ID } from './env.secret'
import { AdMobBanner } from 'expo'

class BookDetails extends Component {
  state = {
    contentURL: '',
  };

  constructor(props) {
    super(props)

    this.state.contentURL = Util.getReviewPath(this.props.stores.search_title)
  }

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
              style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
              onChangeText={(title) => { this.props.setSearchTitle(title) }}
              value={this.props.stores.search_title}
            />
          </View>
          <Tooltip
            popover={<Text>Copied!</Text>}
            onOpen={this._copy}
          >
            <Text style={styles.copyButtonStyle}>コンテンツURLをコピー</Text>
          </Tooltip>
        </View>
        <WebView
          source={{ uri: Util.getReviewPath(this.props.stores.search_title) }}
          onNavigationStateChange={this._onNavigationStateChange.bind(this)}
        />
      </View>
    )
  }

  _onNavigationStateChange = (webViewState) => {
    this.setState({
      contentURL: webViewState.url
    })
  }

  _copy = () => {
    console.log('uri: ' + this.state.contentURL)
    Clipboard.setString(this.state.contentURL)
  }
}

const mapStateToProps = state => ({
  stores: state.stores
})

const mapDispatchToProps = {
  setSearchTitle
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookDetails)

// CSS
const styles = {
  copyButtonStyle: {
    backgroundColor: "rgba(92,99,216,1)",
    width: 200,
    height: 40,
    borderWidth: 0,
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 5,
    textAlignVertical: 'center',
    color: "rgba(255,255,255,1)",
    textAlign: 'center'
  },
  webStyle: {
    flex: 1
  },
  reSearchStyle: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginBottom: 20,
    marginTop: 20,
  }
}