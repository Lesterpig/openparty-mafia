module.exports = {

  init: function(room) {
    var out = {};

    out.mafia      = require("./mafia")();
    out.afterMafia = require("./mafia_after")();
    out.end        = require("./end")();
    out.vote       = require("./vote.js")();
    out.wait       = require("./wait.js")();

    (function(room) {
      room.openChannel = function(channel, role) {
        room.gameplay.roles[role].channels[channel].w = true;
        room.updateChannels();
      };

      room.closeChannel = function(channel, role) {
        room.gameplay.roles[role].channels[channel].w = false;
        room.updateChannels();
      };

      room.updateChannels = function() {
        room.players.forEach(function(p) {
          p.player.sendWriteChannels();
        });
      };

    })(room);

    return out;
  },

};
