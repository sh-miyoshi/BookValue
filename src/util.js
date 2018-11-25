export class Util {
  static getImageExt(filePath) {
    var val = filePath.split('.')
    if (val.length <= 1) {
      return null
    }
    var ext = val[val.length - 1].toLowerCase()
    switch (ext) {
      case 'png':
      case 'jpeg':
        return ext
      case 'jpg':
        return 'jpeg'
    }
    return null
  }

  static getReviewPath(titleName) {
    basePath = "https://www.amazon.co.jp/s/ref=nb_sb_noss_2?__mk_ja_JP=カタカナ&url=search-alias%3Daps&field-keywords="
    return basePath + titleName
  }
}