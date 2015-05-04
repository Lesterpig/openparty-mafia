var votes = require("../lib/votes");
var deathPlaces = require("../data/deathPlaces.json");

var MAX_DURATION = 360; // 6 minutes

module.exports = function() {

  return {
    start: function(room, callback) {

      room.message("<div class='mafia-day-transition'><span class='glyphicon glyphicon-bell'></span> Un nouveau jour se lève...</div>");

      room.gameplay.events.emit("beforeDawn");
      room.gameplay.events.emit("beforeDawn1");
      room.gameplay.events.emit("beforeDawn2");

      var dead = 0;
      room.players.forEach(function(p) {
        if(p.player.pendingDeath.length > 0) {
          dead++;
          var deathPlace = deathPlaces[GET_RANDOM(0, deathPlaces.length-1)];
          room.message("<span class='mafia-dead-announce'>✝ " + p.username + " " + p.player.canonicalRole + " a été retrouvé assassiné "+ deathPlace +"...</span>");
          room.gameplay.kill(p.player);
        }
      });

      room.gameplay.resetPlayerInfo();

      if(!dead) {
        room.message("<span class='mafia-dead-announce'>Rien à signaler en cette belle matinée.</span>");
      }

      if(room.gameplay.checkEnd()) {
        return;
      }

      room.gameplay.events.emit("afterDawn");

      room.message("<span class='mafia-dead-announce'>Les habitants du village ont la possibilité d'éliminer un suspect lors d'un vote.</span>");
      room.openChannel("general", "villager");

      var duration = 30 * room.gameplay.nbAlive("villager");
      if(duration > MAX_DURATION) {
        duration = MAX_DURATION;
      }

      callback(null, duration);
    },
    end: function(room, callback) {

      room.gameplay.events.emit("beforeDusk");

      var victim = votes.execute(room);

      if(victim) {
        room.message("<span class='mafia-dead-announce'>Le village a décidé de lyncher " + victim.username + " " + victim.canonicalRole + ".</span>");
        room.gameplay.kill(victim);
      } else {
        room.message("<span class='mafia-dead-announce'>Indécis, le village choisit de n'éliminer personne ... pour l'instant.</span>");
      }

      room.closeChannel("general", "villager");
      room.gameplay.events.emit("afterDusk");

      if(!room.gameplay.checkEnd()) {
        room.nextStage("mafia");
      }

    }
  }

};
