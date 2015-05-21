module.exports = {

  /**
   * Set player roles
   * @param  {Room}   room
   */
  init: function(room) {

    var roles = {};
    var sum = 0;
    var playerShift = 0;

    room.gameplay.parameters.forEach(function(p) {

      // Various parameters registration

      if(p.gamemasterMode && p.value) {
        room.gameplay.gamemasterMode = true;
        room.gameplay.gamemaster     = room.players[0].player;
        playerShift = 1;
      }

      // Roles registration

      if(!p.role)
        return;

      if(p.value < 0)
        throw new Error("Nombre invalide pour le rôle " + p.role + ".");

      if(p.role === "mafia" && !p.value)
        throw new Error("Vous devez avoir au moins un mafioso dans la partie.");

      roles[p.role] = p.value;
      sum += p.value;
    });

    if(sum > room.players.length - playerShift)
      throw new Error("Trop de rôles par rapport au nombre de joueurs.");

    // Suffle player list
    var o = [];
    for(var i = 0; i < room.players.length - playerShift; i++) {
      o[i] = i;
    }

    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);

    // Set default role and remove default channel
    rolesData = {};
    rolesData.villager = require("./villager")();
    rolesData.dead     = require("./dead")();

    room.players.forEach(function(p, i) {
      if(i < playerShift)
        return; // ignore playerShift players
      p.player.setChannel("general", null);
      p.player.setRole("villager", rolesData.villager);
      p.player.canonicalRole = "<span class='label label-default'>Villageois</span>";
      p.player.emit("setGameInfo", "Vous êtes "+ p.player.canonicalRole +". Vous devez éliminer les membres de la Mafia, mais vous n'avez aucun pouvoir spécifique.");
    });

    if(room.gameplay.gamemasterMode) {
      var gamemaster = room.players[0].player;
      gamemaster.setChannel("general", null);
      gamemaster.setRole("gamemaster", require("./gamemaster")(room));
      gamemaster.canonicalRole = "<span class='label label-success'>Maître du Jeu</span>";
      gamemaster.emit("setGameInfo", "Vous êtes <strong>Maître du Jeu</strong>. Bon courage ;)");
    }

    // Affect roles
    for(var r in roles) {
      rolesData[r] = require("./" + r)();

      if(rolesData[r].beforeAll)
        rolesData[r].beforeAll(room);

      for(var i = 0; i < roles[r]; i++) {
        var index = o.pop() + playerShift;
        room.players[index].player.setRole(r, rolesData[r]);

        var c = "primary";
        if(rolesData[r].side === "mafia")
          c = "danger";

        room.players[index].player.canonicalRole = "<span class='label label-"+c+"'>" + rolesData[r].name + "</span>";
        room.players[index].player.emit("setGameInfo", "Vous êtes "+ room.players[index].player.canonicalRole +". " + rolesData[r].desc);
      }
    }

    // Add custom functions in room.gameplay

    room.gameplay.nbAlive = function(role) {
      nb = 0;
      this.room.players.forEach(function(p) {
        if(!p.player.roles.dead && p.player.roles[role]) {
          nb++;
        }
      });
      return nb;
    };

    room.gameplay.kill = function(player) {
      player.setRole("dead", this.roles.dead);
      player.socket.emit("setGameInfo", "Vous êtes <strong>✝ éliminé</strong>. Vous pouvez quitter le village, ou dialoguer avec les âmes perdues du village...");

      // Disable channels
      player.setChannel("general", {r: true, w: false});
      player.setChannel("mafia", {r: false, w: false});
    };

    return rolesData;

  }

}
