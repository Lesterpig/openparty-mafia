var french = require("../lib/french.js");
var equals = require("assert").strictEqual;

describe("French Library", function() {

  describe("join", function() {

    it("should return false in case of empty object", function() {
      equals(french.join({}), false);
    });

    it("should work with one word", function() {
      equals(french.join({a:1}), "un a");
      equals(french.join({a:2}), "deux as");
    });

    it("should work with more than one word", function() {
      equals(french.join({a:1, b:2}), "un a et deux bs");
      equals(french.join({a:1, b:2, c:3}), "un a, deux bs et trois cs");
    });

    it("should encapsulate numbers between <span> tags", function() {
      equals(french.join({a:1, b:2}, "<span>", "</span>"), "<span>un</span> a et <span>deux</span> bs");
    });

  });

});
