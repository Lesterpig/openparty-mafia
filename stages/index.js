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
        room.setChannelStatus(channel, role, true);
      };

      room.closeChannel = function(channel, role) {
        room.setChannelStatus(channel, role, false);
      };

      room.setChannelStatus = function(channel, role, open) {
        room.players.forEach(function(p) {
          var r = p.player.roles[role];
          if(r) {
            r.channels[channel].w = open;
            p.player.sendWriteChannels();
          }
        });
      };

    })(room);

    return out;
  },

};
