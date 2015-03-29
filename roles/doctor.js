module.exports = function() {

  return {

  name: "Docteur",
  desc: "Vous pouvez protéger quelqu'un contre la mafia <strong>chaque nuit</strong>, sauf vous-même. Vous devez aider les villageois à repousser la Mafia...",

  actions: {
    protect: {
      isAvailable: function(player) {
        return player.room.currentStage === "mafia" && !player.roles.dead && !player.docHasPlayed;
      },
      type: "select",
      options: require("../lib/actions").getPlayerSelectOptions("Protéger"),
      execute: function(player, choice) {
        choice = player.room.resolveUsername(choice);
        if(!choice || player === choice.player)
          return;

        player.docHasPlayed = true; // reset at dusk
        choice.player.isSafeByDoc  = true; // reset at dusk
        player.sendAvailableActions();
        player.message("<div class="tour_spes"><strong>[Privé] <i>"+ choice.username +" est protégé de la mort pour cette nuit.</i></strong></div>");

      }
    }
  },
  channels: {}

  }

}
