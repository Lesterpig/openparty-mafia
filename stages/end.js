module.exports = function() {

  return {
    start: function(room, callback) {
      room.gameplay.resetPlayerInfo();
      room.closeChannel("dead", "dead");

      // Allow everyone to speak
      room.players.forEach(function(p) {
        p.player.setChannel("general", {r: true, w: true, n: "Général", p: 100});
      });

      callback(null, -1);
    },
  };

};
