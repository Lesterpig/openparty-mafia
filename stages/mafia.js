var votes = require("../lib/votes");

module.exports = function() {

  return {
    start: function(room, callback) {

      // Reset pending death
      room.players.forEach(function(p) {
        p.player.pendingDeath = [];
      });

      room.message("<h3>Une nouvelle nuit tombe sur le village.</h3>");
      room.message("<div class='tour_mafia'><strong><i>Tandis que les villageois dorment paisiblement, la Mafia passe à l'action.</i></strong></div>");

      room.gameplay.resetPlayerInfo();
      room.openChannel("mafia", "mafia");
      room.openChannel("mafia", "godfather");

      callback(null, 30);
    },
    end: function(room, callback) {

      var victim = votes.execute(room);
      if(victim) {
        victim.pendingDeath.push("mafia");
        room.message("mafia", "<br /><div class='tour_mafia'><strong><i>La Mafia a décidé d'éliminer " + victim.username + "</i></strong></div>")
      } else {
        room.message("mafia", "<br /><div class='tour_mafia'><strong><i>Les mafiosi ne se mettent pas d'accord et n'éliminent personne.</i></strong></div>")
      }
      room.closeChannel("mafia", "mafia");
      room.closeChannel("mafia", "godfather");
      if(!room.gameplay.checkEnd()) {
        room.nextStage("vote");
      }

    }
  }

};
