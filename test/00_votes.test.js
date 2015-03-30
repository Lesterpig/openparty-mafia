var votes = require("../lib/votes.js");
var equals = require("assert").strictEqual;

describe("Votes Library", function() {

  describe("getVoteAction", function() {

    it("should returns an action object", function() {

      var v = votes.getVoteAction("role", "stage");
      equals("select", v.type);

    });

    it("should returns distinct objects", function() {

      var a = votes.getVoteAction("roleA", "a");
      var b = votes.getVoteAction("roleB", "b");

      var player = {room: {currentStage: "a"}};

      equals(true, a.isAvailable(player));
      equals(false, b.isAvailable(player));

    });

  });

});
