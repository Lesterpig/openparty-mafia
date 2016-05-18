module.exports = function() {

  return {

    name: "Dentiste",
    desc: "Vous pouvez interdire à une personne de parler au prochain tour <strong>une fois par partie</strong>. Vous devez aider les villageois à repousser la Mafia...",
    side: "village",
    night: true,

    actions: {
      mute: {
        isAvailable: function(player) {
          return player.room.currentStage === "mafia" && !player.roles.dead && !player.dentistHasPlayed;
        },
        type: "select",
        options: require("../lib/actions").getPlayerSelectOptions("Priver de parole", {alive: "yes", innocent: "any"}),
        execute: function(player, choice) {
          choice = player.room.resolveUsername(choice);
          if(!choice || player === choice.player)
            return;

          player.dentistHasPlayed = true;
          player.sendAvailableActions();
          
          // player.canTalk :
          //   0 = nothing (can use chat)
          //   1 = mute player next round
          //   2 = unmute player next round
          choice.player.canTalk = 1;
            
          player.room.message("<span class='mafia-stage-action mafia-role-action'><span class='glyphicon glyphicon-exclamation-sign'></span> Un dentiste a oublié " + funInstrument[GET_RANDOM(0, funInstrument.length-1)] + " dans la bouche de " + choice.username + "</span>");
          player.roles.dentist.night = false;
        }
      }
    },
    channels: {},

    beforeAll: function(room) {
      room.gameplay.events.on("beforeDawn", function() {
        room.players.forEach(function(p) {
          switch(p.player.canTalk) {
              case 1:
              {
                p.player.canTalk = 2;
                room.gameplay.mute(p.player);
                break;
              }
              case 2:
              {
                p.player.canTalk = 0;
                room.gameplay.unmute(p.player);
                break;
              }
          }    
        });
      });
    }
  };
};

var funInstrument = [
  "son scalpel",
  "sa fraiseuse",
  "sa compresse",
  "sa curette",
  "son moulage",
  "sa turbine",
  "sa spatule",
  "son miroir",
];
