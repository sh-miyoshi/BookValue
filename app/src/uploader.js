import { Util } from './util';

export class Uploader {
  constructor(imageFile, isDebug) {
    this.imageFile = imageFile
    this.isDebug = isDebug
    this.result = []
    this.checked = []
    this.error = null
  }

  async send() {
    if (this.isDebug) {
      this._debugSend()
    } else {
      let sendData = this._createSendData()
      if (this.error) {
        return
      }

      let res = null;
      try {
        url = Util.getOcrServer()
        let tres = await fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data;',
          },
          body: sendData
        });
        res = await tres.json();
      } catch (error) {
        this.error = error.toString()
        return
      }

      // any error is occured
      if (res["err"]) {
        this.error = res["err"]
        return
      }

      console.log(res);

      this._makeResult(res["titles"])
    }
  }

  getResult() {
    return [this.result, this.checked, this.error]
  }

  // private methods
  _makeResult(titles) {
    let result = new Array()
    let checked = new Array()
    titles.forEach(function (element, index) {
      result.push({
        key: element,
        index: index,
      })
      checked.push(false)
    });
    this.result = result.slice()
    this.checked = checked.slice()
  }

  _debugSend() {
    const titles = [
      "タイトル1",
      "カイゼン・ジャーニー",
      "あああああああああああああああああああああああああいいいい"
    ]
    this._makeResult(titles)
  }

  _createSendData() {
    let imageType = Util.getImageExt(this.imageFile)
    if (!imageType) {
      this.error = "invalid image type: " + this.imageFile
      console.log(error)
      return
    }

    const data = new FormData();
    data.append('name', 'image')
    data.append('image', {
      uri: this.imageFile,
      name: 'image',
      type: 'image/' + imageType,
    })

    return data
  }
}
