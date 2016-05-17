module.exports = function() {

  return {

    name: "Conseiller",
    desc: "Vous pouvez chaque jour empêcher le vote <strong>d'un habitant du village</strong> différent grâce à votre poste à la Mairie.",
    side: "village",
    night: true,

    actions: {
      protect: {
        isAvailable: function(player) {
          return player.room.currentStage === "mafia" && !player.roles.dead && !player.councilmanHasPlayed;
        },
        type: "select",
        options: require("../lib/actions").getPlayerSelectOptions("Interdire de vote", {alive: "yes", innocent: "any"}),
        execute: function(player, choice) {
          choice = player.room.resolveUsername(choice);
          if(!choice || choice === player.councilmanLastChoice)
            return;

          // Extract villager role from choice and stuck the vote action
          var v = choice.player.roles.villager;
          if(!v) {
            return; // Paranormal case, should never happen
          }
          var oldFn = v.actions.vote.isAvailable;
          if(oldFn === disabledAction) {
            return; // Avoid multiple override
          }

          v.actions.vote.isAvailable = disabledAction;

          // Restore previous state on dusk
          player.room.gameplay.events.once("afterDusk", function() {
            // These instructions are protected by try blocks because both players can leave the room at any time
            try { v.actions.vote.isAvailable = oldFn; } catch(e) {}
            try { player.councilmanHasPlayed = false; } catch(e) {}
          });

          player.councilmanHasPlayed = true;
          player.councilmanLastChoice = choice;
          player.sendAvailableActions();
          player.room.message("<span class='mafia-stage-action mafia-role-action'><span class='glyphicon glyphicon-exclamation-sign'></span> Un conseiller a interdit de vote " + choice.username + " pour " + funReasons[GET_RANDOM(0, funReasons.length-1)] + "</span>");
        }
      }
    },
    channels: {},
    beforeAll: function(room) {
      room.gameplay.events.on("beforeDawn", function() {
        room.players.forEach(function(p) {
          if(p.player.roles.councilman && !p.player.councilmanHasPlayed)
            p.player.councilmanLastChoice = null; // Reset if the councilman decided to choose nobody
        });
      });
    },
  };

};

function disabledAction() { return false; }

var funReasons = [
  "fraude fiscale",
  "avoir caché de la vodka dans sa cave",
  "exhibitionnisme",
  "non-respect des délais de paiment",
  "pratiques allant à l'encontre des bonnes moeurs",
  "emploi de fausses factures",
  "avoir perdu un pari",
  "avoir battu son chien",
];
