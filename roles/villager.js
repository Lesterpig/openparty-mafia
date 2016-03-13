var votes = require("../lib/votes");

module.exports = function() {

  return {

    name: "Villager",
    side: "village",

    actions: {
      vote: votes.getVoteAction("", "vote"),
      skipVote: {
        isAvailable: function(player) {
          return player.room.gameplay.nbDays > 1 && player.room.currentStage === "vote" && !player.roles.dead && !player.skipVote;
        },
        type: "button",
        options: {submit: "Passer le vote"},
        execute: function(player) {
          player.skipVote = true;
          player.sendAvailableActions();

          var skip = player.room.players.every(function(p) {
            return p.player.roles.dead
              || p.player.roles.gamemaster
              || p.player.skipVote;
          });

          if(skip) {
            // skipVote is reset during vote execution
            player.room.endStage();
          }
        }
      }
    },
    channels: {
      village: {r: true, w: false, n: "Village", p: 20}
    }

  };

};
