import { OCR_SERVER_URL, SUBSCRIPTION_KEY } from "./env.secret"
import { Util } from './util'

export class Uploader {
  constructor() {
    this.result = []
    this.error = null
  }

  async send(imageFile) {
    let sendData = this._createSendData(imageFile)
    if (this.error) {
      return
    }

    let res = null;
    try {
      url = OCR_SERVER_URL
      let tres = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': "multipart/form-data",
          'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY
        },
        body: sendData
      })
      res = await tres.json();
    } catch (error) {
      this.error = error.toString()
      return
    }

    if (!res.regions) {
      this.error = res.message
      return
    }

    titles = new Array()
    res.regions.forEach(function (region) {
      region.lines.forEach(function (line) {
        word = ""
        line.words.forEach(function (w) {
          word += w.text
        })
        titles.push(word)
      })
    })

    this._makeResult(titles)
  }

  getResult() {
    return [this.result, this.error]
  }

  // private methods
  _makeResult(titles) {
    let result = new Array()
    titles.forEach(function (element, index) {
      result.push({
        key: element,
        index: index,
      })
    });
    this.result = result.slice()
  }

  _createSendData(imageFile) {
    let imageType = Util.getImageExt(imageFile)
    if (!imageType) {
      this.error = "invalid image type: " + imageFile
      console.log(error)
      return
    }

    const data = new FormData();
    data.append('photo', {
      uri: imageFile,
      name: `photo.${imageType}`,
      type: `image/${imageType}`,
    });

    console.log(data)
    return data
  }
}
