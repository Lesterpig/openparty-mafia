module.exports = function(room) {

  var channels =  {
    mafia: {r: true, w: true, n: "Mafia", p: 10},
    dead: {r: true, w: true, n: "Cimetière", p: 5},
    village: {r: true, w: true, n: "Village", p: 20}
  };

  room.players.forEach(function(p,i) {

    if(i === 0)
      return;

    channels["player-" + p.username] = {r: false, w: true, n: "Message à " + p.username};
    p.player.setChannel("player-" + room.players[0].username, {r: false, w: true, n: "Maître du Jeu"});

    // Overload player.message to send special messages to gamemaster
    // TODO : check closure...

    var baseFn = p.player.message;
    p.player.message = function(m, disable) {
      baseFn.call(p.player, m);
      if(room.gameplay.gamemaster && !disable) {
        room.gameplay.gamemaster.message("Action de <strong>" + p.username + "</strong> : " + m);
      }
    };

  });

  return {
    actions: {
      abortWait: {
        isAvailable: function(player) {
          return player.room.currentStage === "wait";
        },
        type: "button",
        options: {submit: "Terminer l'attente"},
        execute: function(player) {
          player.room.endStage();
        }
      }
    },
    channels: channels
  };

};
