module.exports = {

  getVoteAction: function(role, stage) {

    return {
      isAvailable: function(player) {
        return player.room.currentStage === stage && !player.roles.dead;
      },
      type: "select",
      options: {
        choices: function(room, player) {
          var out = ["(Personne)"];
          room.players.forEach(function(p) {
            if(!p.player.roles.dead) {
              out.push(p.username);
            }
          });

          return out;
        },
        submit:  "Voter",
      },
      execute: function(player, choice) {

        var sendPlayerInfo = player.room.gameplay.sendPlayerInfo.bind(player.room.gameplay);

        if(choice === "(Personne)") {
          choice = null;
        } else {
          choice = player.room.resolveUsername(choice);
          if(choice)
            choice = choice.player;
        }

        var previousChoice = player.choice;
        if(previousChoice === choice)
          return;

        if(choice && (choice.roles.dead || player === choice))
          return;

        if(previousChoice) {
          previousChoice.nbVotes--;
          sendPlayerInfo(previousChoice.socket, role);
        }

        if(choice) {
          player.room.message(role, "<strong>" + player.username + "</strong> vote contre <strong>" + choice.username + "</strong>");
          if(!choice.nbVotes)
            choice.nbVotes = 0;
          choice.nbVotes++;
          sendPlayerInfo(choice.socket, role);
        } else if(previousChoice) {
          player.room.message(role, "<strong>" + player.username + "</strong> retire son vote.");
        }

        player.choice = choice;
        sendPlayerInfo(player.socket, role);
      }

    }

  },

  /**
   * Static
   * Get a victim from choices
   * TODO Refactor
   */
  
  execute: function(room) {
    selected = [];
    max = 0;
    room.players.forEach(function(p) {
      if(p.player.nbVotes) {

        if(p.player.nbVotes > max) {
          selected = [];
          max = p.player.nbVotes;
        }

        if(p.player.nbVotes === max) {
          selected.push(p.player);
        }

      }

      p.player.nbVotes = null;
      p.player.choice  = null;
    });

    if(max === 0)
      return null;

    return selected[GET_RANDOM(0, selected.length-1)];

  }

};
