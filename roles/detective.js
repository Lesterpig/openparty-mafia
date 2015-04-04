module.exports = function() {

  return {

  name: "Détective",
  desc: "Vous pouvez découvrir le camp d'un joueur <strong>chaque nuit</strong> : innocent ou mafioso. Vous devez aider les villageois à repousser la Mafia...",

  actions: {
    protect: {
      isAvailable: function(player) {
        return player.room.currentStage === "mafia" && !player.roles.dead && !player.detectHasPlayed;
      },
      type: "select",
      options: require("../lib/actions").getPlayerSelectOptions("Découvrir"),
      execute: function(player, choice) {
        choice = player.room.resolveUsername(choice);
        if(!choice || player === choice.player)
          return;

        player.detectHasPlayed = true; // reset at dusk
        player.sendAvailableActions();
        var campJoueur = (choice.player.roles.mafia ? "mafioso" : "innocent");
        player.message("<div class='tour_spes'><strong><i>"+ choice.username +" est " + campJoueur + ".</i></strong></div>");

      }
    }
  },
  channels: {}

  }

}
