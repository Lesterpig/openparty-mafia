var votes = require("../lib/votes");

module.exports = function() {

  return {
    start: function(room, callback) {
      room.message("<h3>Une nouvelle nuit tombe sur le village.</h3>");
      room.message("<strong><i>Tandis que les villageois dorment paisiblement, la Mafia passe à l'action.</i></strong>");

      room.gameplay.resetPlayerInfo();
      room.openChannel("mafia", "mafia");

      callback(null, 30);
    },
    end: function(room, callback) {

      var victim = votes.execute(room);
      if(victim) {
        victim.pendingDeath = "mafia";
        room.message("mafia", "<strong class='mafia-mafia-chat'><i>La Mafia a décidé d'éliminer " + victim.username + "</i></strong>")
      }
      room.closeChannel("mafia", "mafia");
      if(!room.gameplay.checkEnd()) {
        room.nextStage("vote");
      }

    }
  }

};
