import { OCR_SERVER_URL } from "./env.secret"

export class Util {
  static getImageExt(filePath) {
    var val = filePath.split('.')
    var ext = val[val.length - 1].toLowerCase()
    switch (ext) {
      case 'png':
      case 'jpeg':
      case 'bmp':
        return ext
      case 'ico':
        return 'x-icon'
      case 'jpg':
        return 'jpeg'
    }
    return null
  }

  static getReviewPath(titleName) {
    basePath = "https://www.amazon.co.jp/s/ref=nb_sb_noss_2?__mk_ja_JP=カタカナ&url=search-alias%3Daps&field-keywords="
    return basePath + titleName
  }

  static getOcrServer() {
    // return http://<ocr_server_url>/ocr
    return OCR_SERVER_URL + "/ocr"
  }
}