var commands = {
  help: {
    nb: 0,
    fn: function(player) {
      return "Pour plus d'informations concernant les commandes disponibles, visitez <a href='https://github.com/Lesterpig/openparty-mafia/blob/master/public/gamemaster.md' target='_blank'>cette page</a>";
    }
  },
  autoVictory: {
    nb: 0,
    fn: function(player) {
      player.room.gameplay.disableAutoVictory = !player.room.gameplay.disableAutoVictory;
      return "Désactivation de la victoire automatique : " + (player.room.gameplay.disableAutoVictory ? "OUI" : "NON");
    }
  },
  kill: {
    nb: 1,
    fn: function(player, args) {
      var target = player.room.resolveUsername(args[0]);
      if(!target)
        return "Le joueur ["+target+"] n'existe pas.";

      if(!args[1])
        args[1] = "a été foudroyé.";

      player.room.message("<span class='mafia-dead-announce'>"+ target.username + " " + target.player.canonicalRole + " " + args[1] +"</span>");
      player.room.gameplay.kill(target.player);
      player.room.gameplay.resetPlayerInfo();
      player.room.gameplay.checkEnd();
    }
  },
  time: {
    nb: 1,
    fn: function(player, args) {
      player.room.setStageDuration(Number(args[0]));
    }
  },
  victory: {
    nb: 1,
    fn: function(player, args) {
      player.room.gameplay.endGame(args[0]);
    }
  },
  role: {
    nb: 2,
    fn: function(player, args) {
      var target = player.room.resolveUsername(args[0]);
      if(!target)
        return "Le joueur ["+target+"] n'existe pas.";

      var type = "default";
      if(args[2] === "b")
        type = "primary";
      else if(args[2] === "r")
        type = "danger";
      else if(args[2] === "o")
        type = "warning";

      target.player.canonicalRole = "<span class='label label-"+type+"'>" + args[1] + "</span>";
      target.player.emit("setGameInfo", "Vous êtes "+ target.player.canonicalRole +". Ce rôle a été défini par le Maître du Jeu.");
      return target.username + " est désormais " + target.player.canonicalRole;
    }
  }
}

module.exports = {

  /**
   * Warning: static among rooms (WIP)
   */
  test: function(message, player) {
    if(message.charAt(0) !== "/")
      return false; // not a command

    var action = this.parseAction(message);

    if(!commands[action]) {
      player.message("La commande ["+action+"] n'existe pas.");
      return true; // wrong command
    }

    var args   = this.parseArgs(message.substr(action.length + 2));

    if(commands[action].nb && commands[action].nb > args.length) {
      player.message("La commande ["+action+"] a besoin d'au moins "+commands[action].nb+" paramètres, vous en avez donné "+args.length+".");
      return true; // wrong args
    }

    if(message = commands[action].fn(player, args)) {
      player.message("→ " + message);
    }

    return true;
  },

  parseAction: function(message) {
    var actionRegex = /^\/(\w+)/;
    return actionRegex.exec(message)[1];
  },

  parseArgs: function(message) {
    var argRegex    = /(?:"([^"]+)"|([^" ]+))/g;
    var args = [];
    var current;

    while((current = argRegex.exec(message)) !== null) {
      args.push(current[1] || current[2]);
    }

    return args;
  }
}