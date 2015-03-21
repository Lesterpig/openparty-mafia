module.exports = function() {

  return {

    actions: {
      choose: {
        isAvailable: function(player) {
          return player.room.currentStage === "mafia";
        },
        type: "select",
        options: {
          choices: "players",
          submit:  "Voter",
        },
        execute: function(player, choice) {
          player.room.message("mafia", "<strong>" + player.username + "</strong> vote <strong>" + choice.username);
          player.choice = choice;

          votes = 0;
          player.room.players.forEach(function(p) {
            if(p.player.choice === choice)
              votes++;
          });

          player.room.playerInfo("mafia", choice, choice.username + " : " + votes);
          
        }
      }
    },
    channels: {
      mafia: {r: true, w: false, n: "Mafia"}
    }

  }

}