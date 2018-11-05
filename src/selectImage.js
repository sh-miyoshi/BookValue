import React, { Component } from 'react'
import { Image, View, Text } from 'react-native'
import { ImagePicker, Permissions } from 'expo'
import { Button } from 'react-native-elements'
import { HyperLink } from './hyperLink'
import { Error } from './error'
import { Uploader } from './uploader'
import { setImage, setError, setTitles, searchStart } from './actions'
import { connect } from 'react-redux'

class SelectImage extends Component {
  render() {
    return (
      <View style={styles.containerStyle}>
        {
          this.props.stores.error &&
          <Error message={this.props.stores.error} />
        }

        <Text style={styles.textStyle}>
          本のタイトル画像を{"\n"}アップロードしよう
        </Text>

        <Button
          title="フォルダから選択"
          onPress={this._pickImage}
          buttonStyle={styles.buttonStyle}
        />

        <Button
          title="カメラを起動"
          onPress={this._takePhoto}
          buttonStyle={styles.buttonStyle}
        />

        {
          this.props.stores.image &&
          <Image
            source={{ uri: this.props.stores.image }}
            style={{ width: 200, height: 200, marginBottom: 5 }}
          />
        }

        <Button
          title="アップロード"
          disabled={this.props.stores.image == null}
          onPress={this._upload}
          buttonStyle={styles.buttonStyle}
          loading={this.props.stores.waiting_search}
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

    console.log(result);

    if (!result.cancelled) {
      this.props.setImage(result.uri)
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

    console.log(result);

    if (!result.cancelled) {
      this.props.setImage(result.uri)
    }
  }

  // アップロード
  _upload = async () => {
    this.props.searchStart()

    let isDebug = true // debug
    let uploader = new Uploader(this.props.stores.image, isDebug)
    await uploader.send()
    let [result, error] = uploader.getResult()
    if (error) {
      this._errorExit(error)
      return
    }

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
  setImage,
  setError,
  setTitles,
  searchStart
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
}