module.exports = function() {

  return {

    name: "Docteur",
    desc: "Vous pouvez protéger quelqu'un <strong>chaque nuit</strong>, sauf vous-même. Vous devez aider les villageois à repousser la Mafia...",
    side: "village",
    night: true,

    actions: {
      protect: {
        isAvailable: function(player) {
          return player.room.currentStage === "mafia" && !player.roles.dead && !player.docHasPlayed;
        },
        type: "select",
        options: require("../lib/actions").getPlayerSelectOptions("Protéger", {alive: "yes", innocent: "any"}),
        execute: function(player, choice) {
          choice = player.room.resolveUsername(choice);
          if(!choice || player === choice.player)
            return;

          player.docHasPlayed = true;
          choice.player.isSafeByDoc  = true;
          player.sendAvailableActions();
          player.message("<span class='mafia-stage-action mafia-role-action'><span class='glyphicon glyphicon-heart-empty'></span> "+ choice.username +" est protégé de la mort pour cette nuit</span>");

        }
      }
    },
    channels: {},

    beforeAll: function(room) {
      room.gameplay.events.on("beforeDawn", function() {
        room.players.forEach(function(p) {
          if(p.player.isSafeByDoc && p.player.pendingDeath) {
            p.player.pendingDeath.pop();
            p.player.room.gameplay.events.emit("victimSaved", p.player);
          }
        });
      });

      room.gameplay.events.on("afterDusk", function() {
        room.players.forEach(function(p) {
          p.player.isSafeByDoc  = false;
          p.player.docHasPlayed = false;
        });
      });
    }

  };

};
