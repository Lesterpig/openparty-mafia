module.exports = function() {

  return {

  name: "Terroriste",
  desc: "Vous pouvez vous suicider avec la personne de votre choix à n'importe quel moment de la partie, pour aider les innocents.",

  actions: {
    protect: {
      isAvailable: function(player) {
        return player.room.currentStage === "mafia" && !player.roles.dead;
      },
      type: "select",
      options: require("../lib/actions").getPlayerSelectOptions("Attentat"),
      execute: function(player, choice) {
        choice = player.room.resolveUsername(choice);
        if(!choice || player === choice.player)
          return;

        choice.player.pendingDeath.push("terrorist");
        player.pendingDeath.push("terrorist");
        choice.player.isTargetedByTerror = true;
        choice.player.killer = player;
        player.sendAvailableActions();
        player.message("<div class='tour_spes'><strong><i>Boum ! Vous avez décidé d'emporter "+ choice.username +" dans votre mort.</i></strong></div>");

      }
    }
  },
  channels: {}

  }

}
