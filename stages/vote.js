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
          if(p.player.deathMessage !== false) {
            var deathMessage = p.player.deathMessage || "✝ " + p.username + " " + p.player.canonicalRole + " a été retrouvé assassiné "+ deathPlace +"...";
            room.message("<span class='mafia-dead-announce'>" + deathMessage + "</span>");
          }
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
    
      room.players.forEach(function(p) {
        if((p.player.canTalk === 2) && (!p.player.roles.dead))
          p.player.message("<span class='mafia-dead-announce'>Vous êtes <strong>muet</strong>. Vous ne pourrez parler qu'à partir du prochain tour.</span>");
      });

      room.openChannel("village", "villager");

      var duration = 30 * room.gameplay.nbAlive("villager") + 60 * (room.gameplay.nbDays++);
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

      room.closeChannel("village", "villager");
      room.gameplay.events.emit("afterDusk");

      if(!room.gameplay.checkEnd()) {
        room.nextStage("mafia");
      }

    }
  };

};
