// The second part of the night
module.exports = function() {

  return {
    start: function(room, callback) {
      var duration = 0;
      room.players.forEach(function(p) {
        var r = p.player.roles;
        if(r.dead) return;
        for(var role in r) {
          if(r[role].afterMafia) {
            duration = 20;
          }
        }
      });
      callback(null, duration);
    },
    end: function(room, callback) {
      if(!room.gameplay.gamemasterMode) {
        room.nextStage("vote");
      } else {
        room.nextStage("wait");
      }
    }
  };

};
