module.exports = function() {

  return {
    start: function(room, callback) {
      if(!room.gameplay.waitCalled) {
        room.gameplay.nextStageAfterWait = "mafia";
        room.gameplay.waitCalled = true;
      } else {
        room.gameplay.nextStageAfterWait = "vote";
      }

      room.gameplay.resetPlayerInfo();
      room.message("<span class='glyphicon glyphicon-hourglass'></span> <i>En attente du Maître du Jeu...</i>");

      room.players.forEach(function(p) {
        if(!p.player.pendingDeath || p.player.pendingDeath.length === 0)
          return;
        var deathReasons = p.player.pendingDeath.reduce(function(p, n) { // magic!
          p.push(n.type);
          return p;
        }, []).join(", ");
        room.gameplay.gamemaster.message("→ " + p.username + " " + p.player.canonicalRole + " va mourir à l'aube : " + deathReasons);
      });

      callback(null, -1);
    },
    end: function(room, callback) {
      room.nextStage(room.gameplay.nextStageAfterWait);
    }
  };

};
