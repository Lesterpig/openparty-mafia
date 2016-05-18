// The second part of the night
module.exports = function() {

  return {
    start: function(room, callback) {
      var duration = isNeeded(room);
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

// Check if both a victim and a rescuer are available
function isNeeded(room) {
  var victim = null;
  var rescuer = null;
  room.players.forEach(function(p) {
    var player = p.player;
    var deaths = player.pendingDeath;
    if(deaths.length === 1 && deaths[0].type === "mafia" && !player.isSafeByDoc)
      victim = p;
    if(player.roles.rescuer && !player.roles.dead && !player.rescuerHasPlayed)
      rescuer = p.player;
    if (victim && rescuer)
      break;
  });
  return (victim && rescuer) ? 20 : 0;
}
