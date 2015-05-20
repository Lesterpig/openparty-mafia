module.exports = function(room) {

  var channels =  {
    mafia: {r: true, w: true, n: "Mafia"},
    dead: {r: true, w: true, n: "Cimetière"}
  };

  room.players.forEach(function(p,i) {

    if(i === 0)
      return;

    channels["player-" + p.username] = {r: true, w: true, n: "Message à " + p.username};
    p.player.setChannel("player-" + room.players[0].username, {r: false, w: true, n: "Maître du Jeu"});
  });

  return {
    actions: {},
    channels: channels
  }

}
