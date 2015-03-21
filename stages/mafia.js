module.exports = function() {

  return {
    start: function(room, callback) {
      room.message("<h3>Une nouvelle nuit tombe sur le village.</h3>");
      room.message("<strong><i>Tandis que les villageois dorment paisiblement, la Mafia passe à l'action.</i></strong>");

      room.openChannel("mafia", "mafia");

      callback(null, 30);
    },
    end: function(room, callback) {

      room.closeChannel("mafia", "mafia");

    }
  }

};