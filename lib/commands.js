var commands = {
  autoVictory: {
    nb: 0,
    fn: function(player) {
      player.room.gameplay.disableAutoVictory = !player.room.gameplay.disableAutoVictory;
      return "Désactivation de la victoire automatique : " + (player.room.gameplay.disableAutoVictory ? "OUI" : "NON");
    }
  },
  help: {
    nb: 0,
    fn: function(player) {
      return "Pour plus d'informations concernant les commandes disponibles, visitez <a href='https://github.com/Lesterpig/openparty-mafia/blob/master/public/gamemaster.md' target='_blank'>cette page</a>";
    }
  },
  kill: {
    nb: 1,
    fn: function(player, args) {
      var target = player.room.resolveUsername(args[0]);
      if(!target || target.player === player)
        return "Le joueur ["+args[0]+"] n'existe pas.";

      if(!args[1])
        args[1] = "a été foudroyé.";

      player.room.message("<span class='mafia-dead-announce'>"+ target.username + " " + target.player.canonicalRole + " " + args[1] +"</span>");
      player.room.gameplay.kill(target.player);
      player.room.gameplay.resetPlayerInfo();
      player.room.gameplay.checkEnd();
    }
  },
  load: {
    nb: 1,
    fn: function(player, args) {
      var path  = args[0];
      var split = path.split("/");
      if(!split.length)
        return;
      var id    = split[split.length - 1];
      player.room.broadcast("preloadSound", {
        id   : id,
        path : path
      });
      return "Téléchargement du son lancé. Pour lire le son : /play " + id;
    }
  },
  murder: {
    nb: 1,
    fn: function(player, args) {
      var target = player.room.resolveUsername(args[0]);
      if(!target)
        return "Le joueur ["+args[0]+"] n'existe pas.";
      if(player.room.currentStage === "vote" || !target.player.pendingDeath)
        return "Veuillez effectuer cette action la nuit.";
      target.player.pendingDeath.push({type : "gamemaster"});
      return args[0] + " ne se réveillera pas la prochaine nuit.";
    }
  },
  play: {
    nb: 1,
    fn: function(player, args) {
      var sound = {id : args[0], path : args[0]};

      var arg1 = +args[1];
      var arg2 = +args[2];

      var volume   = (arg1 > 0 && arg1 <= 1 ? arg1 : undefined);
      sound.volume = volume || (arg2 > 0 && arg2 <= 1 ? arg2 : undefined);
      sound.loop   = (args[1] === "l" || args[2] === "l");

      player.room.broadcast("playSound", sound);
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
  },
  save: {
    nb: 1,
    fn: function(player, args) {
      var target = player.room.resolveUsername(args[0]);
      if(!target)
        return "Le joueur ["+args[0]+"] n'existe pas.";

      target.player.pendingDeath = [];
      return args[0] + " a été sauvé.";
    }
  },
  stop: {
    nb: 1,
    fn: function(player, args) {
      player.room.broadcast("stopSound", args[0]);
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
      player.room.gameplay.endGame("<span class='glyphicon glyphicon-star'></span> "+args[0]);
    }
  }
};

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
};
