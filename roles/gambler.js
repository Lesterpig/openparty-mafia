module.exports = function() {

  return {

    name: "Parieur",
    desc: "Vous pouvez parier <strong>chaque nuit</strong> sur la victime choisie par la Mafia. Si le pari est réussi vous obtenez le nom d'un mafieux, sinon vous mourez. Vous devez aider les villageois à repousser la Mafia...",
    side: "village",
    night: true,

    actions: {
      bet: {
        isAvailable: function(player) {
          return player.room.currentStage === "mafia" && !player.roles.dead && !player.gamblerHasPlayed && !player.gambleLocked;
        },
        type: "select",
        options: require("../lib/actions").getPlayerSelectOptions("Parier", {alive: "yes", innocent: "any", self: "yes"}),
        execute: function(player, choice) {
          choice = player.room.resolveUsername(choice);
          if(!choice)
            return;

          player.gamblerHasPlayed = true;
          player.gamble = choice.player;
          player.sendAvailableActions();

          var name = choice.player == player ? "vous-même" : choice.username;
          player.message("<span class='mafia-stage-action mafia-role-action'><span class='glyphicon glyphicon-tags'></span>&nbsp; Vous pariez sur " + name + " cette nuit </span>");
        }
      }
    },
    channels: {},

    beforeAll: function(room) {
      room.gameplay.events.on("beforeDawn", function() {
        room.players.forEach(function(p) {
          if (p.player.gamblerHasPlayed && p.player.outcome)
              rewardGambler(p.player);
        });
      });

      room.gameplay.events.on("afterDusk", function() {
        room.players.forEach(function(p) {
          p.player.gamblerHasPlayed = false;
          p.player.gamble = null;
          p.player.outcome = null;
        });
      });
    }

  };
    
}

function rewardGambler(player) {
  var name = giveRandomMafiaName(player);
  player.message("<span class='mafia-dead-announce'><span class='mafia-stage-action mafia-role-action'><span class='glyphicon glyphicon-tags'></span>&nbsp; Pari gagné</span> Vous découvrez que <span class='mafia-stage-action mafia-mafia-action'>" + name + "</span> est dans la Mafia.</span>");
  if (player.gambleLocked)
    player.message("<span class='mafia-dead-announce'>Votre chance a tourné et vous ne pouvez plus parier.</span>");
}

function giveRandomMafiaName(g) {
  var tabMafia = [];
  g.room.players.forEach(function (p) {
    if (p.player.roles.mafia || p.player.roles.godfather || p.player.roles.terrorist)
      tabMafia.push(p.username);
  });
  return tabMafia[Math.floor(Math.random() * tabMafia.length)];
}
