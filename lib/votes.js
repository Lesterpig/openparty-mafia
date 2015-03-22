module.exports = {

  getVoteAction: function(role, stage) {

    return {
      isAvailable: function(player) {
        return player.room.currentStage === stage && !player.roles.dead;
      },
      type: "select",
      options: {
        choices: "players",
        submit:  "Voter",
      },
      execute: function(player, choice) {
        if(choice.roles.dead || player === choice)
          return;
        player.room.message(role, "<strong>" + player.username + "</strong> vote contre <strong>" + choice.username + "</strong>");
        player.choice = choice;
      }

    }

  },

  /**
   * Static
   * Get a victim from choices
   * TODO Refactor
   */
  execute: function(room) {

    choices = {};
    room.players.forEach(function(p) {
      if(p.player.choice) {
        var choice = p.player.choice.username;
        if(!choices[choice]) {
          choices[choice] = 0;
        }

        choices[choice]++;
        p.player.choice = null;
      }
    });

    selected = [];
    max = 0;
    for(var i in choices) {
      if(choices[i] > max) {
        selected = [];
        max = choices[i];
      }
      if(choices[i] === max) {
        selected.push(i);
      }
    }

    if(max === 0) {
      return null;
    }

    var chosen = selected[GET_RANDOM(0, selected.length-1)];

    return room.resolveUsername(chosen).player;
  }

};
