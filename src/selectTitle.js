import React, { Component } from 'react'
import { View, Text, FlatList, Alert } from 'react-native'
import { CheckBox, Button, Icon } from 'react-native-elements'
import { setError, setSearchTitle } from './actions'
import { connect } from 'react-redux'

class SelectTitle extends Component {
  state = {
    checked: new Array(),
    listUpdate: 0 // use title list update
  };

  render() {
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
            execData={this.state.listUpdate}
            renderItem={({ item }) =>
              <CheckBox
                title={item.key}
                checked={this.state.checked[item.index]}
                onPress={() => {
                  tmp = this.state.checked
                  tmp[item.index] = !tmp[item.index]
                  this.setState({
                    checked: tmp,
                    listUpdate: this.state.listUpdate + 1
                  })
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
    )
  }

  _test = (index) => {
    console.log(index)
    console.log(this.state.checked)
    return this.state.checked[index]
  }

  // 書籍の検索
  _search = () => {
    title = ""
    for (var i = 0; i < this.state.checked.length; i++) {
      if (this.state.checked[i]) {
        title += this.props.stores.titles[i].key;
      }
    }
    console.log(title)

    this.props.setSearchTitle(title)
    this.props.navigation.navigate('BookDetails')
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
)(SelectTitle)

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