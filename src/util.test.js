import { Util } from './util'

describe("test getImageExt method", () => {
  describe("test correct image file", () => {
    it('test png image', () => {
      expect(Util.getImageExt("test.png")).toBe("png")
    });
    it('test jpeg image', () => {
      expect(Util.getImageExt("test.jpeg")).toBe("jpeg")
    });
    it('test bmp image', () => {
      expect(Util.getImageExt("test.bmp")).toBe(null)
    });
    it('test jpg image', () => {
      expect(Util.getImageExt("test.jpg")).toBe("jpeg")
    });
    it('test icon image', () => {
      expect(Util.getImageExt("test.icon")).toBe(null)
    });
    it('test multi dots in file name', () => {
      expect(Util.getImageExt("test.ex.png")).toBe("png")
    });
  })

  describe("test illegal image file", () => {
    it('wrong extension', () => {
      expect(Util.getImageExt("test.abc")).toBe(null)
    });

    it('empty file name', () => {
      expect(Util.getImageExt("")).toBe(null)
    });

    it('no extension file', () => {
      expect(Util.getImageExt("png")).toBe(null)
    });
  })
})