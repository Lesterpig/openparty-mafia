module.exports = function() {

  return {

    name: "Secouriste",
    desc: "Vous pouvez sauver quelqu'un visé par la mafia, y compris vous-même. Cependant, vous n'avez <strong>qu'une seule possibilité de sauvetage</strong>. Vous devez aider les villageois à repousser la Mafia...",
    side: "village",
    night: true,
    afterMafia: true,

    actions: {
      protect: {
        isAvailable: function(player) {
          return player.room.currentStage === "afterMafia" && !player.roles.dead && !player.rescuerHasPlayed;
        },
        type: "select",
        options: {
          choices: function(room, player) {
            var victim = getFirstMafiaVictim(room);
            return victim ? [victim.username] : ["(Personne n'a été visé)"];
          },
          submit: "Secourir"
        },
        execute: function(player, choice) {
          var victim = getFirstMafiaVictim(player.room);
          if(!victim) { // The victim is not available anymore (left, healed by another rescuer, killed by somebody else...)
            player.sendAvailableActions();
            return;
          }
          victim.player.pendingDeath = [];
          player.room.gameplay.events.emit("victimSaved", victim.player);
  
          player.rescuerHasPlayed = true;
          player.sendAvailableActions();
          player.message("<span class='mafia-stage-action mafia-role-action'><span class='glyphicon glyphicon-heart-empty'></span> "+ victim.username +" a été sauvé d'une mort affreuse</span>");
        }
      }
    },
    channels: {},
    beforeAll: function(room) {}

  };

};

function getFirstMafiaVictim(room) {
  var victim = null;
  room.players.some(function(p) {
    var deaths = p.player.pendingDeath;
    if(deaths.length === 1 && deaths[0].type === "mafia" && !p.player.isSafeByDoc) {
      victim = p;
      return true;
    }
    return false;
  });
  return victim;
}
