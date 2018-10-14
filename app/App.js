import React, { Component } from 'react';
import { Image, View, Text, FlatList, WebView } from 'react-native';
import { ImagePicker, Permissions } from 'expo';
import { CheckBox, Button } from 'react-native-elements';
import { HyperLink } from './src/hyperLink';
import { Error } from './src/error';
import { Util } from './src/util';

export default class Main extends Component {
  state = {
    debug_mode: false,
    image: null,
    app_state: 0,
    titles: null,
    checked: new Array(),
    search_title: "",
    error: null,
    waiting_search: false,
  };

  render() {
    AppMain = () => {
      switch (this.state.app_state) {
        case 0:
          return (
            <View style={styles.containerStyle}>
              {
                this.state.error &&
                <Error message={this.state.error} />
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
                this.state.image &&
                <Image
                  source={{ uri: this.state.image }}
                  style={{ width: 200, height: 200, marginBottom: 5 }}
                />
              }

              <Button
                title="アップロード"
                disabled={this.state.image == null}
                onPress={this._upload}
                buttonStyle={styles.buttonStyle}
                loading={this.state.waiting_search}
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
              </View>
              <View style={{ height: 200 }}>
                <FlatList
                  data={this.state.titles}
                  renderItem={({ item }) =>
                    <CheckBox
                      title={item.key}
                      checked={this.state.checked[item.index]}
                      onPress={() => {
                        tmp = this.state.checked
                        tmp[item.index] = !tmp[item.index]
                        this.setState({ checked: tmp })
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
                source={{ uri: Util.getReviewPath(this.state.search_title) }}
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
      this.setState({
        error: null,
        image: result.uri
      });
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
      this.setState({
        error: null,
        image: result.uri
      });
    }
  }

  // アップロード
  _upload = async () => {
    this.setState({
      waiting_search: true
    });

    let result = new Array()

    if (this.state.debug_mode) {
      result.push({ key: "タイトル1", index: 0 })
      result.push({ key: "カイゼン・ジャーニー", index: 1 })
      result.push({ key: "あああああああああああああああああああああああああいいいい", index: 2 })
      this.state.checked[0] = false
      this.state.checked[1] = false
      this.state.checked[2] = false
    } else {
      let res = null;

      image_type = Util.getImageExt(this.state.image)
      if (!image_type) {
        console.log("invalid image type: " + this.state.image)
        return
      }

      const data = new FormData();
      data.append('name', 'image')
      data.append('image', {
        uri: this.state.image,
        name: 'image',
        type: 'image/' + image_type,
      })

      try {
        url = Util.getOcrServer()
        let tres = await fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data;',
          },
          body: data
        });
        res = await tres.json();
      } catch (error) {
        this._errorExit(error.toString())
        return
      }

      // any error is occured
      if (res["err"]) {
        this._errorExit(res["err"])
        return
      }

      console.log(res);

      res["titles"].forEach(function (element, index) {
        result.push({
          key: element,
          index: index,
        })
      });

      for (var i = 0; i < res["titles"].length; i++) {
        this.state.checked[i] = false
      }
    }

    this.setState({
      app_state: 1,
      titles: result
    });
  }

  // 書籍の検索
  _search = () => {
    title = ""
    for (var i = 0; i < this.state.checked.length; i++) {
      if (this.state.checked[i]) {
        title += this.state.titles[i].key;
      }
    }
    console.log(title)

    this.setState({
      app_state: 2,
      search_title: title
    });
  }

  _retry = () => {
    this.setState({
      app_state: 0,
      error: null,
      waiting_search: false
    });
  }

  _errorExit = (message) => {
    console.log(message)
    this.setState({
      waiting_search: false,
      error: message,
      app_state: 0
    });
  }
}

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