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
        player.message("<div class='tour_spes'><strong><i>Vous avez décidé d'assassiner "+ choice.username +" cette nuit.</i></strong></div>");

      }
    }
  },
  channels: {},

  beforeAll: function(room) {
    room.gameplay.events.on("afterDusk", function() {
      room.players.forEach(function(p) {
        p.player.vigilantHasPlayed = false;
      });
    });
  }

  }

}
