module.exports = {

  /**
   * Set player roles
   * @param  {Room}   room
   */
  init: function(room) {

    var roles = {};
    var sum = 0;
    var playerShift = 0;
    var mafiaOk = true;

    room.gameplay.gamemasterMode = false;
    room.gameplay.gamemaster = undefined;

    room.gameplay.parameters.forEach(function(p) {
      // Various parameters registration

      if(p.gamemasterMode && p.value) {
        room.gameplay.gamemasterMode = true;
        room.gameplay.gamemaster     = room.players[0].player;
        playerShift = 1;
        mafiaOk = true;
      }

      // Roles registration

      if(!p.role)
        return;

      if(p.value < 0)
        throw new Error("Nombre invalide pour le rôle " + p.role + ".");

      if((p.role === "mafia" || p.role === "godfather") && p.value)
        mafiaOk = true;

      roles[p.role] = p.value;
      sum += p.value;
    });

    if(!mafiaOk)
      throw new Error("Vous devez avoir au moins un mafioso dans la partie.");

    if(sum > room.players.length - playerShift)
      throw new Error("Trop de rôles par rapport au nombre de joueurs.");

    // Suffle player list
    var o = [];
    for(var i = 0; i < room.players.length - playerShift; i++) {
      o[i] = i;
    }

    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);

    room.players.forEach(function(p, i) {
      if(i < playerShift)
        return; // ignore playerShift players
      p.player.setChannel("general", null); // remove general channel (unused in Mafia, but proposed by Openparty by default)
      p.player.setRole("villager", require("./villager")()); // everyone is a villager, except gamemaster
      p.player.canonicalRole = "<span class='label label-default'>Villageois</span>";
      p.player.emit("setGameInfo", "Vous êtes "+ p.player.canonicalRole +". Vous devez éliminer les membres de la Mafia, mais vous n'avez aucun pouvoir spécifique.");
    });

    if(room.gameplay.gamemasterMode) {
      var gamemaster = room.players[0].player;
      gamemaster.setChannel("general", null);
      gamemaster.setRole("gamemaster", require("./gamemaster")(room));
      gamemaster.canonicalRole = "<span class='label label-success'>Maître du Jeu</span>";
      gamemaster.emit("setGameInfo", "Vous êtes <strong>Maître du Jeu</strong>. Tapez /help pour obtenir de l'aide sur les commandes. Bon courage ;)");
    }

    // Affect roles
    for(var r in roles) {
      var roleData = require("./" + r);
      var globalSample = roleData(); // This object is just used to trigger events global to each role
      if(globalSample.beforeAll)
        globalSample.beforeAll(room);

      for(var i = 0; i < roles[r]; i++) {
        var j = o.pop() + playerShift;
        room.players[j].player.setRole(r, roleData()); // Each player has a NEW instance of each role, for excellent customization posibilities

        var c = "primary";
        if(globalSample.side === "mafia")
          c = "danger";

        room.players[j].player.canonicalRole = "<span class='label label-"+c+"'>" + globalSample.name + "</span>";
        room.players[j].player.emit("setGameInfo", "Vous êtes "+ room.players[j].player.canonicalRole +". " + globalSample.desc);
      }
    }

    // Add custom functions in room.gameplay

    room.gameplay.nbAlive = function(role) {
      var nb = 0;
      this.room.players.forEach(function(p) {
        if(!p.player.roles.dead && p.player.roles[role]) {
          nb++;
        }
      });
      return nb;
    };

    room.gameplay.kill = function(player) {
      player.setRole("dead", require("./dead")());
      player.socket.emit("setGameInfo", "Vous êtes <strong>✝ éliminé</strong>. Vous pouvez quitter le village, ou dialoguer avec les âmes perdues du village...");

      // Disable channels
      player.setChannel("village", {r: true, w: false});
      player.setChannel("mafia", {r: false, w: false});
    };

    room.gameplay.mute = function(player) {
      if (!player.roles.dead) {
        // Disable channels
        player.setChannel("village", {r: true, w: false});
        if (player.roles.mafia)
          player.setChannel("mafia", {r: true, w: false});
      }
    };

    room.gameplay.unmute = function(player) {
      if (!player.roles.dead) {
        // Enable channels
        player.setChannel("village", {r: true, w: true});
        if (player.roles.mafia)
          player.setChannel("mafia", {r: true, w: true});
      }
    };
  }

};
