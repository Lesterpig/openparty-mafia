var votes  = require("../lib/votes");
var french = require("../lib/french");

module.exports = function() {

  return {
    start: function(room, callback) {
      // Reset pending death
      room.players.forEach(function(p) {
        p.player.pendingDeath = [];
      });

      room.message("<div class='mafia-day-transition'><span class='glyphicon glyphicon-fire'></span> La nuit tombe sur le village</div>");

      // Fetch composition

      var roles = {};
      var mafiaNb = 0;
      var speNb   = 0;

      room.players.forEach(function(p) {
        var r = p.player.roles;
        if(!r || r.dead)
          return;
        if(r.mafia || r.godfather)
          mafiaNb++;
        for(var role in r) {
          if(!r[role].night)
            continue;
          var rolename = r[role].name;
          if(!roles[rolename])
            roles[rolename] = 0;
          roles[rolename]++;
          speNb++;
        }
      });

      // Mafia announce

      var mafiaStr = mafiaNb > 1 ? "<u>les " + mafiaNb + " membres</u> de la Mafia passent" : "<u>le seul membre</u> de la Mafia passe";
      if(mafiaNb)
        room.message("<span class='mafia-dead-announce'>Tandis que les villageois s'endorment, " + mafiaStr + " à l'action.</span>");

      // Special announce

      var specialStr = french.join(roles, "<u>", "</u>");
      var specialStrEnd = speNb > 1 ? "opèrent" : "opère";
      if(specialStr)
        room.message("<span class='mafia-dead-announce'>Pendant ce temps, " + specialStr + " " + specialStrEnd + " en secret...</span>");

      room.gameplay.resetPlayerInfo();
      room.openChannel("mafia", "mafia");
      room.openChannel("mafia", "godfather");
      room.gameplay.events.emit("mafiaTurn");
      callback(null, 30);
    },
    end: function(room, callback) {
      var victim = votes.execute(room);
      room.message(""); // empty line
      if(victim) {
        victim.pendingDeath.push({type: "mafia"});
        room.message("mafia", "<span class='mafia-stage-action mafia-mafia-action'><span class='glyphicon glyphicon-screenshot'></span> La Mafia a décidé d'éliminer " + victim.username + "</span>");
      } else {
        room.message("mafia", "<span class='mafia-stage-action mafia-mafia-action'><span class='glyphicon glyphicon-screenshot'></span> Les mafiosi ne se mettent pas d'accord et n'éliminent personne</span>");
      }
      room.gameplay.events.emit("mafiaVote", victim);
      room.closeChannel("mafia", "mafia");
      room.closeChannel("mafia", "godfather");
      room.nextStage("afterMafia");
    }
  };

};
