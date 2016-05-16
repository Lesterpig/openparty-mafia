module.exports = function() {

  return {

    name: "Terroriste",
    desc: "Vous pouvez vous suicider avec la personne de votre choix durant n'importe quelle nuit. <b>Vous ne connaissez pas les membres de la Mafia</b>, mais eux vous connaissent, et vous devez les aider grâce à votre suicide. <strong>Attention :</strong> si le docteur vous protège, vous ne pourrez pas utiliser votre pouvoir.",
    side: "mafia",
    night: true,

    actions: {
      explode: {
        isAvailable: function(player) {
          var hasExploded = player.pendingDeath ? player.pendingDeath.some(function(i){ return i.type === "terrorist"; }) : false;
          return player.room.currentStage === "mafia" && !player.roles.dead && !hasExploded;
        },
        type: "select",
        options: require("../lib/actions").getPlayerSelectOptions("Attentat", {alive: "yes", innocent: "any"}),
        execute: function(player, choice) {
          choice = player.room.resolveUsername(choice);
          if(!choice || player === choice.player)
            return;

          player.pendingDeath.push({type: "terrorist", target: choice.player});
          player.sendAvailableActions();
          player.message("<span class='mafia-stage-action mafia-mafia-action'><span class='glyphicon glyphicon-flash'></span> Boum ! Vous avez décidé d'emporter "+ choice.username +" dans votre mort</span>");

        }
      }
    },
    channels: {},

    beforeAll: function(room) {
      room.gameplay.events.on("beforeDawn2", function() {
        room.players.forEach(function(p) {
          p.player.pendingDeath.forEach(function(d) {
            if(d.type === "terrorist") {
              // Trigger target death
              d.target.pendingDeath.push({type: "terroristTarget"});
              // Override default death message
              d.target.deathMessage = false;
              p.player.deathMessage = "✝ " + p.username + " " + p.player.canonicalRole +
                " a décidé de se faire exploser en entraînant "  +
                d.target.username + " " + d.target.canonicalRole +
                "..." ;
            }
          });
        });
      });

      room.gameplay.events.on("mafiaTurn", function() {
        room.players.forEach(function(p) {
          if(p.player.roles.terrorist && !p.player.roles.dead)
            room.message("mafia", "<span class='mafia-mafia-chat'>Vous pouvez compter sur l'aide de " + p.username + " " + p.player.canonicalRole + "</span>");
        });
      });
    }

  };

};
