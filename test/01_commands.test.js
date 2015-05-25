var commands = require("../lib/commands.js");
var equals = require("assert").deepEqual;

describe("Commands Library", function() {

  describe("parse", function() {

    it("should parse action name", function() {
      equals("test", commands.parseAction("/test"));
      equals("test", commands.parseAction("/test "));
      equals("test", commands.parseAction("/test argument"));
    });

    it("should parse classic arguments", function() {
      equals([], commands.parseArgs(" "));
      equals(["arg"], commands.parseArgs("arg"));
      equals(["arg"], commands.parseArgs("  arg   "));
      equals(["arg", "arg2"], commands.parseArgs("arg arg2"));
      equals(["arg", "arg2"], commands.parseArgs("  arg  arg2  "));
    });

    it("should parse string arguments", function() {
      equals(["a strong argument"], commands.parseArgs('   "a strong argument"'));
      equals(["arg", "a strong argument"], commands.parseArgs('  arg    "a strong argument"  '));
    });

  });

});