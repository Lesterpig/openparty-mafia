module.exports = {

  init: function(room) {
    out = {};

    out.mafia      = new (require("./mafia"));
    out.afterMafia = new (require("./mafia_after"));
    out.end        = new (require("./end"));
    out.vote       = new (require("./vote.js"));
    out.wait       = new (require("./wait.js"));

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

}
