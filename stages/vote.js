var votes = require("../lib/votes");
var deathPlaces = require("../data/deathPlaces.json");

module.exports = function() {

  return {
    start: function(room, callback) {
      room.message("<h3>Le jour se lève sur le village</h3>");
      
      var dead = 0;
      room.players.forEach(function(p) {
        if(p.player.pendingDeath && !p.player.isSafeByDoc) { // TODO move this in doctor.js ?
          dead++;
          var deathPlace = deathPlaces[GET_RANDOM(0, deathPlaces.length-1)];
          room.message("<strong><i>✝ " + p.username + " " + p.player.canonicalRole + " a été retrouvé assassiné "+ deathPlace +"...</i></strong>");
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
        room.message("<strong><i>Le village a décidé de lyncher " + victim.username + " " + victim.canonicalRole + ".</i></strong>");
        room.gameplay.kill(victim);
      }

      room.closeChannel("general", "villager");
      if(!room.gameplay.checkEnd()) {
        room.nextStage("mafia");
      }

      // Reset some variables 
      room.players.forEach(function(p) {
        p.player.isSafeByDoc  = false; // TODO 
        p.player.docHasPlayed = false; // Move this in doctor.js ?
      });

    }
  }

};
