/**
 * Generates the functions for showing playerInformations
 */

module.exports = {

  init: function(gameplay) {

    gameplay.resetPlayerInfo = function() {

      this.room.players.forEach(function(p) {

        this.sendPlayerInfo(p);

      }.bind(this));

    },

    gameplay.sendPlayerInfo = function(p, mafiaOnly) {
      var info = p.username;

      if(!p.player) {
        return;
      }

      if(p.player.choice)
        info = info + " → " + p.player.choice.username;

      if(p.player.roles.dead) {
        info = "✝ <del>" + info + "</del>";
      }

      if(p.player.room.currentStage === "end" || p.player.roles.dead) {
        info += " " + p.player.canonicalRole;
      }

      var channel = "";
      if(mafiaOnly) {
        channel = "mafia";
      }

      this.room.playerInfo(channel, p, info);

      if(p.player.roles.mafia) {
        info = "<strong class='mafia-mafia-chat'>" + info + "</strong>";
        this.room.playerInfo("mafia", p, info);
      }
    }

  },
}
