var votes = require("../lib/votes");

module.exports = function() {

  return {
    start: function(room, callback) {

      // Reset pending death
      room.players.forEach(function(p) {
        p.player.pendingDeath = [];
      });

      room.message("<div class='mafia-day-transition'><span class='glyphicon glyphicon-fire'></span> La nuit tombe sur le village</div>");
      room.message("<span class='mafia-dead-announce'>Tandis que les villageois dorment paisiblement, la Mafia passe à l'action.</span>");

      room.gameplay.resetPlayerInfo();
      room.openChannel("mafia", "mafia");
      room.openChannel("mafia", "godfather");

      room.gameplay.events.emit("mafiaTurn");

      callback(null, 30);
    },
    end: function(room, callback) {

      var victim = votes.execute(room);
      if(victim) {
        victim.pendingDeath.push({type: "mafia"});
        room.message("mafia", "<span class='mafia-stage-action mafia-mafia-action'><span class='glyphicon glyphicon-screenshot'></span> La Mafia a décidé d'éliminer " + victim.username + "</span>");
      } else {
        room.message("mafia", "<span class='mafia-stage-action mafia-mafia-action'><span class='glyphicon glyphicon-screenshot'></span> Les mafiosi ne se mettent pas d'accord et n'éliminent personne</span>");
      }
      room.closeChannel("mafia", "mafia");
      room.closeChannel("mafia", "godfather");
      if(!room.gameplay.checkEnd()) {
        room.nextStage("vote");
      }

    }
  }

};
