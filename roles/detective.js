module.exports = function() {

  return {

  name: "Détective",
  desc: "Vous pouvez découvrir le camp d'un joueur <strong>chaque nuit</strong> : innocent ou mafioso. Vous devez aider les villageois à repousser la Mafia...",
  side: "village",

  actions: {
    spy: {
      isAvailable: function(player) {
        return player.room.currentStage === "mafia" && !player.roles.dead && !player.detectHasPlayed;
      },
      type: "select",
      options: require("../lib/actions").getPlayerSelectOptions("Découvrir"),
      execute: function(player, choice) {
        choice = player.room.resolveUsername(choice);
        if(!choice || player === choice.player)
          return;

        player.detectHasPlayed = true;
        player.sendAvailableActions();
        var playerSide = (choice.player.roles.mafia ? "mafioso" : "innocent");
        player.message("<div class='tour_spes'><strong><i>" + choice.username + " est " + playerSide + ".</i></strong></div>");

      }
    }
  },
  channels: {},

  beforeAll: function(room) {
    room.gameplay.events.on("afterDusk", function() {
      room.players.forEach(function(p) {
        p.player.detectHasPlayed = false;
      });
    });
  }

  }

}
