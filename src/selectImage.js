import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { ImagePicker, Permissions } from 'expo'
import { Button } from 'react-native-elements'
import { HyperLink } from './hyperLink'
import { Error } from './error'
import { Uploader } from './uploader'
import { setError, setTitles } from './actions'
import { connect } from 'react-redux'
import Spinner from 'react-native-loading-spinner-overlay'

class SelectImage extends Component {
  state = {
    analyzing: false
  };

  render() {
    return (
      <View style={styles.containerStyle}>
        <Spinner
          visible={this.state.analyzing}
          textContent={'画像を解析しています…'}
          textStyle={styles.spinnerTextStyle}
          overlayColor={"rgba(0, 0, 0, 0.8)"}
        />

        {
          this.props.stores.error &&
          <Error message={this.props.stores.error} />
        }

        <Text style={styles.textStyle}>
          本のタイトル画像を{"\n"}アップロードしよう
        </Text>

        <Button
          title="フォルダから選択する"
          onPress={this._pickImage}
          buttonStyle={styles.buttonStyle}
        />

        <Button
          title="カメラで撮影する"
          onPress={this._takePhoto}
          buttonStyle={styles.buttonStyle}
        />

        <HyperLink
          url="https://sh-miyoshi.github.io/privacy-policy/"
          title="プライバシーポリシーはこちら"
        />
      </View>
    )
  }

  // フォルダから選択
  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      aspect: [16, 9],
      quality: 0.2
    });

    if (!result.cancelled) {
      this._upload(result.uri)
    }
  }

  // カメラを起動
  _takePhoto = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.2
    });

    if (!result.cancelled) {
      this._upload(result.uri)
    }
  }

  // アップロード
  _upload = async (image) => {
    this.setState({
      analyzing: true
    })

    let isDebug = false
    let uploader = new Uploader(image, isDebug)
    await uploader.send()
    let [result, error] = uploader.getResult()
    if (error) {
      this._errorExit(error)
      return
    }

    this.state.analyzing = false
    this.props.setTitles(result.slice())
    this.props.navigation.navigate('SelectTitle')
  }

  _errorExit = (message) => {
    console.log(message)
    this.props.setError(message)
  }
}

const mapStateToProps = state => ({
  stores: state.stores
})

const mapDispatchToProps = {
  setError,
  setTitles
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectImage)

// CSS
const styles = {
  containerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textStyle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    marginHorizontal: 15
  },
  buttonStyle: {
    marginBottom: 5,
    backgroundColor: "rgba(92,99,216,1)",
    width: 300,
    height: 45,
    borderWidth: 0,
    borderRadius: 5
  },
  spinnerTextStyle: {
    color: '#FFF'
  }
}