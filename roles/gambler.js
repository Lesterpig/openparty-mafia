var deathGambles = require("../data/deathGambles.json");

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
          else if (isGambleDeathCancelled(p.player))
            p.player.deathMessage = null;
        });
      });

      room.gameplay.events.on("afterDusk", function() {
        room.players.forEach(function(p) {
          p.player.gamblerHasPlayed = false;
          p.player.gamble = null;
          p.player.outcome = null;
        });
      });

      // Check gamble outcome after mafia has selected a victim
      room.gameplay.events.on("mafiaVote", function(victim) {
        room.players.forEach(function(p) {
          if (p.player.gamblerHasPlayed) {
            if (p.player.gamble == victim)
              p.player.outcome = "win";
            else {
              p.player.pendingDeath.unshift({type: "gamble"});
              var deathGamble = deathGambles[GET_RANDOM(0, deathGambles.length-1)];
              p.player.deathMessage = "✝ " + p.username + " " + p.player.canonicalRole + " a été retrouvé " + deathGamble +"...";          
            }
          }
        }); 
      });
      
      // Doctor or rescuer have saved the mafia's victim : gamblers may lose their power
      room.gameplay.events.on("victimSaved", function(victim) {
        room.players.forEach(function(p) {
        if ((p.player.gamblerHasPlayed) && (p.player.gamble == victim))
          p.player.gambleLocked = true;
        });        
      });
    }

  };
    
}

function rewardGambler(player) {
  var name = giveRandomMafiaName(player);
  if (name)
    player.message("<span class='mafia-dead-announce'><span class='mafia-stage-action mafia-role-action'><span class='glyphicon glyphicon-tags'></span>&nbsp; Pari gagné</span> Vous découvrez que <span class='mafia-stage-action mafia-mafia-action'>" + name + "</span> est dans la Mafia.</span>");
  if (player.gambleLocked)
    player.message("<span class='mafia-dead-announce'>Votre chance a tourné et vous ne pouvez plus parier.</span>");
}

function giveRandomMafiaName(g) {
  var tabMafia = [];
  g.room.players.forEach(function (p) {
    if (!p.player.roles.dead && p.player.pendingDeath.length === 0 && (p.player.roles.mafia || p.player.roles.godfather || p.player.roles.terrorist))
      tabMafia.push(p.username);
  });
  if (tabMafia.length > 0)
    return tabMafia[Math.floor(Math.random() * tabMafia.length)];
  return null;
}

function isGambleDeathCancelled(player) {
  return player.pendingDeath.length > 1 && player.pendingDeath[0].type === "gamble";
}
