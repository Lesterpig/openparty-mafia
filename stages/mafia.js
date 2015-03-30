var votes = require("../lib/votes");

module.exports = function() {

  return {
    start: function(room, callback) {

      // Reset pending death
      room.players.forEach(function(p) {
        p.player.pendingDeath = [];
      });

      room.message("<h3>Une nouvelle nuit tombe sur le village.</h3>");
      room.message("<div class='tour_spes'><strong><i>Le docteur va pouvoir protéger quelqu'un.<br />Le vigile peut choisir d'assassiner un joueur.</div></i></strong>")
      room.message("<strong><i>Tandis que les villageois dorment paisiblement, la Mafia passe à l'action.</i></strong>");

      room.gameplay.resetPlayerInfo();
      room.openChannel("mafia", "mafia");

      callback(null, 30);
    },
    end: function(room, callback) {

      var victim = votes.execute(room);
      if(victim) {
        victim.pendingDeath.push("mafia");
        room.message("mafia", "<strong class='mafia-mafia-chat'><i>La Mafia a décidé d'éliminer " + victim.username + "</i></strong>")
      }
      room.closeChannel("mafia", "mafia");
      if(!room.gameplay.checkEnd()) {
        room.nextStage("vote");
      }

    }
  }

};
