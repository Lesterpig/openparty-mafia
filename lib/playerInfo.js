/**
 * Generates the functions for showing playerInformations
 */

module.exports = {

  init: function(gameplay) {

    gameplay.resetPlayerInfo = function() {

      this.room.players.forEach(function(p) {
        var info = p.username;
        if(p.player.roles.dead) {
          info = "<del>" + info + "</del>";
        }

        this.room.playerInfo(p, info); // for all

        if(p.player.roles.mafia) {
          info = "<strong>" + info + "</strong> [Mafia]";
          this.room.playerInfo("mafia", p, info);
        }

      }.bind(this));

    }

  },
}
