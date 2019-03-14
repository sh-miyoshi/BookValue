import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { ImagePicker, Permissions, AdMobBanner, ImageManipulator } from 'expo'
import { Button, ButtonGroup } from 'react-native-elements'
import { HyperLink } from './hyperLink'
import { Error } from './error'
import { Uploader } from './uploader'
import { setError, setTitles } from './actions'
import { connect } from 'react-redux'
import Spinner from 'react-native-loading-spinner-overlay'
import { ADMOB_ID } from './env.secret'

class SelectImage extends Component {
  state = {
    analyzing: false,
    modeIndex: 0,
    imageWidth: 0,
    imageHeight: 0
  };

  render() {
    return (
      <View style={styles.mainStyle}>
        <AdMobBanner
          adUnitID={ADMOB_ID}
        />
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

          <View style={{ flexDirection: 'row', flexWrap: 'nowrap' }}>
            <Text style={{ textAlignVertical: 'center' }}>
              タイトルの言語：
            </Text>
            <ButtonGroup
              onPress={this._updateMode}
              selectedIndex={this.state.modeIndex}
              buttons={["日本語", "英語"]}
              containerStyle={styles.modeSelectStyle}
            />
          </View>

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
      </View>
    )
  }

  // フォルダから選択
  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      aspect: [16, 9]
    });

    if (!result.cancelled) {
      this.setState({
        imageHeight: result.height,
        imageWidth: result.width
      })
      this._upload(result.uri)
    }
  }

  // カメラを起動
  _takePhoto = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
    });

    if (!result.cancelled) {
      this.setState({
        imageHeight: result.height,
        imageWidth: result.width
      })
      this._upload(result.uri)
    }
  }

  // アップロード
  _upload = async (image) => {
    this.setState({
      analyzing: true
    })

    const langs = ['ja', 'en']
    let uploader = new Uploader()
    let resizedImageFile = await this._resizeImage(image)
    console.log("resizedImageFile: " + resizedImageFile)
    await uploader.send(resizedImageFile, langs[this.state.modeIndex])
    let [result, error] = uploader.getResult()
    if (error) {
      this.state.analyzing = false
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

  _updateMode = (modeIndex) => {
    this.setState({
      modeIndex: modeIndex
    })
  }

  _resizeImage = async (imageFile) => {
    const base_size = 700
    let w = 0, h = 0
    if (this.state.imageHeight > this.state.imageWidth) {
      w = base_size
      h = base_size * this.state.imageHeight / this.state.imageWidth
    } else {
      w = base_size * this.state.imageWidth / this.state.imageHeight
      h = base_size
    }

    const result = await ImageManipulator.manipulateAsync(
      imageFile,
      [{ resize: { width: w, height: h } }],
      { compress: 0.4 }
    ).catch(() => {
      console.log("failed to resize image")
      return imageFile
    })

    return result.uri
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
  mainStyle: {
    flex: 1,
  },
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
  },
  modeSelectStyle: {
    borderWidth: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    width: 100,
    height: 30
  }
}