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

    /**
     * TODO : Refactor.
     * This function works, but is hard to modify.
     * We should use another system to push playerInfo to players, maybe in a "per-player" basis.
     * ~ Lesterpig
     */
    gameplay.sendPlayerInfo = function(p, mafiaOnly) {
      var info = p.username;

      if(!p.player) {
        return;
      }

      if(p.player.nbVotes)
        info = "<span class='badge'>" + p.player.nbVotes + "</span> " + info;

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

      if(p.player.roles.mafia || p.player.roles.godfather) {
        info = "<strong class='mafia-mafia-chat'>" + info + "</strong>";
        this.room.playerInfo("mafia", p, info);
      }
    }

  },
}
