/**
 * Generates the functions for showing playerInformations
 */

module.exports = {

  init: function(gameplay) {

    gameplay.resetPlayerInfo = function() {

      this.room.players.forEach(function(p) {
        var info = p.username;
        if(p.player.roles.dead) {
          info = "✝ <del>" + info + "</del> [" + p.player.canonicalRole + "]";
        }

        this.room.playerInfo(p, info); // for all

        if(p.player.roles.mafia && !p.player.roles.dead) {
          info = "<strong class='mafia-mafia-chat'>" + info + "</strong>";
          this.room.playerInfo("mafia", p, info);
        }

      }.bind(this));

    }

  },
}
