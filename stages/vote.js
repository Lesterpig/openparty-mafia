var votes = require("../lib/votes");
var deathPlaces = require("../data/deathPlaces.json");

var MAX_DURATION = 360; // 6 minutes

module.exports = function() {

  return {
    start: function(room, callback) {

      room.message("<h3>Le jour se lève sur le village.</h3>");

      var dead = 0;
      room.players.forEach(function(p) {
        if(p.player.isSafeByDoc) { // TODO move this in doctor.js ?
          p.player.pendingDeath.pop(); // remove one element only!
        }
        if(p.player.isTargetedByTerror && p.player.killer.isSafeByDoc) { // Si le terroriste est protégé, alors sa victime ne meurt pas
          p.player.pendingDeath.pop();
        }
        if(p.player.pendingDeath.length > 0) {
          dead++;
          var deathPlace = deathPlaces[GET_RANDOM(0, deathPlaces.length-1)];
          room.message("<span class='annonce_mort'><strong><i>✝ " + p.username + " " + p.player.canonicalRole + " a été retrouvé assassiné "+ deathPlace +"...</i></strong></span>");
          room.gameplay.kill(p.player);
        }
      });

      room.gameplay.resetPlayerInfo();

      if(!dead) {
        room.message("<span class='annonce_mort'><strong><i>Rien à signaler en cette belle matinée.</i></strong></span>");
      }

      if(room.gameplay.checkEnd()) {
        return;
      }

      room.message("<span class='annonce_mort'><strong><i>Les habitants du village ont la possibilité d'éliminer un suspect lors d'un vote.</i></strong></span>");
      room.openChannel("general", "villager");

      var duration = 30 * room.gameplay.nbAlive("villager");
      if(duration > MAX_DURATION) {
        duration = MAX_DURATION;
      }

      callback(null, duration);
    },
    end: function(room, callback) {

      var victim = votes.execute(room);

      if(victim) {
        room.message("<span class='annonce_mort'><strong><i>Le village a décidé de lyncher " + victim.username + " " + victim.canonicalRole + ".</i></strong></span>");
        room.gameplay.kill(victim);
      } else {
      room.message("<span class='annonce_mort'><strong><i>Indécis, le village choisit de n'éliminer personne ... pour l'instant.</i></strong>");
    }

      room.closeChannel("general", "villager");

      // Reset some variables
      room.players.forEach(function(p) {
        p.player.isSafeByDoc  = false; // TODO
        p.player.docHasPlayed = false; // Move this in doctor.js ?
        p.player.vigilantHasPlayed = false; // (or create an event emitter !)
        p.player.detectHasPlayed = false;
      });

      if(!room.gameplay.checkEnd()) {
        room.nextStage("mafia");
      }

    }
  }

};
