module.exports = function() {

  return {
    start: function(room, callback) {
      if(!this.called) {
        this.nextStageAfterWait = "mafia";
        this.called = true;

        room.players.forEach(function(p, i) {
          if(i === 0)
            return;
          room.gameplay.gamemaster.message(p.username + " est " + p.player.canonicalRole);
        });

      } else {
        this.nextStageAfterWait = "vote";
      }

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
      room.nextStage(this.nextStageAfterWait);
    }
  }

};
