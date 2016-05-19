/**
 * MAIN DEFINITION FILE FOR OPENPARTY-MAFIA
 * LICENSED UNDER GPLv3
 *
 * From the original idea of Dmitry Davidoff.
 */

'use strict';

var Emitter = require("events").EventEmitter;

var roles      = require("./roles/index");
var stages     = require("./stages/index");
var victory    = require("./lib/victory");
var playerInfo = require("./lib/playerInfo");
var commands   = require("./lib/commands");

module.exports = function() {

  // Metadata

  this.name        = "Mafia";
  this.version     = "0.1.0";
  this.description = "Une version en ligne du jeu de Dimitry Davidoff - v" + this.version;
  this.minPlayers  = 3;
  this.maxPlayers  = 40;
  this.opVersion   = ">0.1.2";

  this.css         = ["mafia.css"];
  this.sounds      = require('./data/audio.json');

  // Start

  this.start = function(room, callback) {

    this.nbDays = 0;
    victory.init(this);
    playerInfo.init(this);

    try {
      room.gameplay.events = new Emitter();
      roles.init(room);
      this.stages = stages.init(room);
    } catch(e) {
      return callback(e.message);
    }

    room.broadcast("playSound", "start");
    callback(null);

    setTimeout(function() {
      room.message("<strong><i>Vous vous trouvez dans le village de Salem. La Mafia rôde, et menace sérieusement la vie des villageois...</i></strong>");

      if(!room.gameplay.gamemasterMode)
        room.nextStage("mafia");
      else
        room.nextStage("wait");
    }, 100);

  };

  // Parameters

  this.parameters = [
  {
    name: "Nombre de Mafiosi (mafia)",
    type: Number,
    value: 1,
    help: "Les Mafiosi ont pour objectif de prendre le contrôle du village. Ensemble, ils décident d'éliminer un citoyen par nuit.",
    role: "mafia"
  },
  {
    name: "Nombre de Parrains (mafia)",
    type: Number,
    value: 0,
    help: "Un parrain fait partie du camp de la mafia mais apparait comme un innocent aux yeux du détective.",
    role: "godfather"
  },
  {
    name: "Nombre de Terroristes (mafia)",
    type: Number,
    value: 0,
    help: "Un terroriste peut commettre un attentat suicide durant une nuit de son choix. Il mourra avec la cible de son choix. Le docteur ne protège pas contre l'attentat; mais empêchera un terroriste d'agir s'il protège celui-ci pendant la nuit.",
    role: "terrorist"
  },
  {
    name: "Nombre de Docteurs",
    type: Number,
    value: 0,
    help: "Un médecin peut protéger un citoyen par nuit s'il le souhaite. Si la vie du protégé est menacée, il survivra quand même.",
    role: "doctor"
  },
  {
    name: "Nombre de Secouristes",
    type: Number,
    value: 0,
    help: "Un secouriste peut sauver une victime de la Mafia. Il est déconseillé de mettre plusieurs secouristes dans la composition, même si cela est possible.",
    role: "rescuer"
  },
  {
    name: "Nombre de Vigiles",
    type: Number,
    value: 0,
    help: "Un vigile peut assassiner un des habitants durant une nuit de son choix. Il est toutefois du côté des honnêtes citoyens.",
    role: "vigilant"
  },
  {
    name: "Nombre de Détectives",
    type: Number,
    value: 0,
    help: "Un détective peut découvrir, chaque nuit, le camp d'un joueur (innocent ou mafioso).",
    role: "detective"
  },
  {
    name: "Nombre de Dentistes",
    type: Number,
    value: 0,
    help: "Un dentiste peut, durant une nuit de son choix, interdire à un habitant de parler au prochain tour.",
    role: "dentist"
  },
  {
    name: "Nombre d'Espions",
    type: Number,
    value: 0,
    help: "Un espion peut connaître la victime de la Mafia chaque nuit, sans se faire repérer.",
    role: "spy"
  },
  {
    name: "Nombre de Conseillers",
    type: Number,
    value: 0,
    help: "Un conseiller peut chaque nuit interdire de vote un habitant du village.",
    role: "councilman"
  },
  {
    name: "Nombre de Parieurs",
    type: Number,
    value: 0,
    help: "Un parieur peut chaque nuit parier sur la victime choisie par les mafieux.",
    role: "gambler"
  },
  {
    name: "Mode Maître du Jeu",
    type: Boolean,
    value: false,
    help: "Quand ce mode est actif, le créateur de la partie devient MENEUR DE JEU. Il dispose de pouvoirs supplémentaires pour animer la partie à sa guise : modification du temps, ajouts de rôles personnalisés, discussions privées avec les joueurs...",
    gamemasterMode: true
  }
  ];

  // Disconnect

  this.onReconnect = function(room, player) {
    // Resend role and players
    player.emit("setGameInfo", "Vous êtes "+ player.canonicalRole +". Vous avez été absent pendant un court instant, l'historique n'est pas totalement disponible.");
    room.gameplay.resetPlayerInfo();

    // Refresh gamemaster private channels
    if(!player.roles.gamemaster && room.gameplay.gamemasterMode) {
      room.gameplay.processUserForGamemaster(player.socket);
    }
  }

  this.onDisconnect = function(room, player) {

    if(player.roles && player.roles.gamemaster) { // TODO : move this is gamemaster.js file
      room.gameplay.gamemasterMode = false;
      room.gameplay.gamemaster     = null;
      room.gameplay.disableAutoVictory = false;

      if(room.getRemainingTime() == Number.POSITIVE_INFINITY) // to avoid infinite stages
        room.setStageDuration(0);

      if(room.currentStage === "wait")
        room.endStage();

      room.players.forEach(function(p) { // disable gamemaster communication
        p.player.setChannel("player-" + player.username, {r: false, w: false});
      });
    }

    if(player.canonicalRole)
      this.room.message("<strong><i>" + player.username + " " + player.canonicalRole + " s'est enfui.</i></strong>");

    // Update vote (if any)
    if(player.choice) {
      player.choice.nbVotes--;
      this.sendPlayerInfo(player.choice.socket)
    }

    if(room.gameplay.checkEnd)
      room.gameplay.checkEnd();
  }

  // Chat styles

  this.processMessage = function(channel, message, player) {

    if(player.roles.gamemaster && commands.test(message, player)) {
      return false;
    }

    if(channel.match(/^player\-/)) {
      player.message("<span class='mafia-private-chat'>À " + channel.replace(/player\-/, "") + " : " + message + "</span>", true);
      message = "<span class='mafia-private-chat'>[PRIVÉ] " + message + "</span>";
    }

    if(channel === "dead") {
      message = "<i class='mafia-dead-chat'>" + message + "</i>";
    }

    if(channel === "mafia") {
      message = "<span class='mafia-mafia-chat'>" + message + "</span>";
    }

    if(player.roles.gamemaster) {
      message = "<span class='mafia-gamemaster-chat'>" + message + "</span>";
    }

    return message;
  }

};
