module.exports = function() {

  return {

    name: "Espion",
    desc: "Chaque nuit, vous pouvez discrètement espionner la Mafia pour savoir quelle sera leur victime... À vous de faire bon usage de ces informations pour aider le village !",
    side: "village",
    night: true,

    actions: {},
    channels: {},
    beforeAll: function(room) {
      room.gameplay.events.on("mafiaVote", function(victim) {
        var announce = "Personne n'a été ciblé par la Mafia cette nuit";
        if(victim) {
          announce = victim.username + " a été ciblé par la Mafia cette nuit";
        }
        room.players.forEach(function(p) {
          if(p.player.roles.spy && !p.player.roles.dead){
            p.player.message("<span class='mafia-stage-action mafia-role-action'><span class='glyphicon glyphicon-user'></span> " + announce + "</span>");
          }
        });
      });
    }

  };
};
