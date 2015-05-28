module.exports = function() {

  return {

  name: "Vigile",
  desc: "Vous pouvez assassiner un des habitants durant une nuit de votre choix; mais gardez à l'esprit que vous devez aider les villageois à repousser la Mafia...",
  side: "village",

  actions: {
    protect: {
      isAvailable: function(player) {
        return player.room.currentStage === "mafia" && !player.roles.dead && !player.vigilantHasPlayed;
      },
      type: "select",
      options: require("../lib/actions").getPlayerSelectOptions("Assassiner"),
      execute: function(player, choice) {
        choice = player.room.resolveUsername(choice);
        if(!choice || player === choice.player)
          return;

        player.vigilantHasPlayed = true;
        choice.player.pendingDeath.push({type: "vigilant"});
        player.sendAvailableActions();
        player.message("<span class='mafia-stage-action mafia-role-action'><span class='glyphicon glyphicon-screenshot'></span> Vous avez décidé d'assassiner "+ choice.username +" cette nuit</span>");

      }
    }
  },
  channels: {},

  }

}
