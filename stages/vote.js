var votes = require("../lib/votes");

module.exports = function() {

  return {
    start: function(room, callback) {
      room.message("<h3>Le jour se lève sur le village</h3>");
      
      var dead = 0;
      room.players.forEach(function(p) {
        if(p.player.pendingDeath) {
          dead++;
          room.message("<strong><i>✝ " + p.username + " a été retrouvé assassiné près de la mairie !</i></strong>");
          room.gameplay.kill(p.player);
        }
      });

      room.gameplay.resetPlayerInfo();

      if(!dead) {
        room.message("<strong><i>Rien à signaler en cette belle matinée.</i></strong>");
      }

      if(room.gameplay.checkEnd()) {
        return;
      }

      room.openChannel("general", "villager");

      callback(null, 120);
    },
    end: function(room, callback) {

      var victim = votes.execute(room);
      
      if(victim) {
        room.message("<strong><i>Le village a décidé de lyncher " + victim.username + ".</i></strong>");
        room.gameplay.kill(victim);
      }

      room.closeChannel("general", "villager");
      if(!room.gameplay.checkEnd()) {
        room.nextStage("mafia");
      }

    }
  }

};
