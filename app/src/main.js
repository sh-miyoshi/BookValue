import React, { Component } from 'react';
import { Image, View, Text, FlatList, WebView, Alert } from 'react-native';
import { ImagePicker, Permissions } from 'expo';
import { CheckBox, Button, Icon } from 'react-native-elements';
import { HyperLink } from './hyperLink';
import { Error } from './error';
import { Util } from './util';
import { Uploader } from './uploader';
import { setImage, setError, setTitles, setChecked, setSearchTitle, searchStart } from './actions'
import { connect } from 'react-redux'

export class Main extends Component {
  state = {
    app_state: 0
  };

  render() {
    AppMain = () => {
      switch (this.state.app_state) {
        case 0:
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
          );
        case 1:
          return (
            <View style={styles.containerStyle}>
              <View style={{ flexDirection: 'row', flexWrap: 'nowrap' }}>
                <Text style={styles.textStyle}>
                  正しい本のタイトルは？
                </Text>
                <Icon
                  name='help'
                  color='#517fa4'
                  size={30}
                  containerStyle={{ marginBottom: 20 }}
                  onPress={() => Alert.alert("HELP!", "下のリストの中から正しい本のタイトルを選択してください。\nそのタイトルで評価を検索します。\nなお、複数選択した場合は選択した候補が連結されて検索されます。")}
                />
              </View>
              <View style={{ height: 200 }}>
                <FlatList
                  data={this.props.stores.titles}
                  renderItem={({ item }) =>
                    <CheckBox
                      title={item.key}
                      checked={this.props.stores.checked[item.index]}
                      onPress={() => {
                        tmp = this.props.stores.checked.slice()
                        tmp[item.index] = !tmp[item.index]
                        this.props.setChecked(tmp)
                      }}
                    />
                  }
                />
              </View>
              <Button
                title="決定"
                onPress={this._search}
                buttonStyle={styles.buttonStyle}
              />
              <Button
                title="もう一回"
                onPress={this._retry}
                buttonStyle={styles.buttonStyle}
              />
            </View>
          );
        case 2:
          return (
            <View style={styles.webStyle}>
              <View style={{ alignItems: 'center' }}>
                <Button
                  title="もう一度検索"
                  onPress={this._retry}
                  buttonStyle={[styles.buttonStyle, styles.retryButtonStyle]}
                />
              </View>
              <WebView
                source={{ uri: Util.getReviewPath(this.props.stores.search_title) }}
              />
            </View>
          );
      }
      return "";
    }

    return (
      <AppMain />
    );
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

    let isDebug = true// debug
    let uploader = new Uploader(this.props.stores.image, isDebug)
    await uploader.send()
    let [result, checked, error] = uploader.getResult()
    if (error) {
      this._errorExit(error)
      return
    }

    this.props.setTitles(result.slice(), checked.slice())
    this.setState({
      app_state: 1
    });
  }

  // 書籍の検索
  _search = () => {
    title = ""
    for (var i = 0; i < this.props.stores.checked.length; i++) {
      if (this.props.stores.checked[i]) {
        title += this.props.stores.titles[i].key;
      }
    }
    console.log(title)

    this.props.setSearchTitle(title)
    this.setState({
      app_state: 2
    });
  }

  _retry = () => {
    this.props.setError(null)
    this.setState({
      app_state: 0
    });
  }

  _errorExit = (message) => {
    console.log(message)
    this.props.setError(message)
    this.setState({
      app_state: 0
    });
  }
}

const mapStateToProps = state => ({
  stores: state.stores
})

const mapDispatchToProps = {
  setImage,
  setError,
  setTitles,
  setChecked,
  setSearchTitle,
  searchStart
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main)

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
  webStyle: {
    flex: 1
  },
  retryButtonStyle: {
    marginBottom: 30,
    marginTop: 30,
  },
}