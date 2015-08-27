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

  // Start

  this.start = function(room, callback) {

    victory.init(this);
    playerInfo.init(this);

    try {
      room.gameplay.events = new Emitter();
      this.roles  = roles.init(room);
      this.stages = stages.init(room);
    } catch(e) {
      return callback(e.message);
    }

    callback(null);

    // TODO See #16
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
    name: "Mode Maître du Jeu",
    type: Boolean,
    value: false,
    help: "Quand ce mode est actif, le créateur de la partie devient MENEUR DE JEU. Il dispose de pouvoirs supplémentaires pour animer la partie à sa guise : modification du temps, ajouts de rôles personnalisés, discussions privées avec les joueurs...",
    gamemasterMode: true
  }
  ];

  // Disconnect

  this.onDisconnect = function(room, player) {

    if(player.roles && player.roles.gamemaster) { // TODO : move this is gamemaster.js file

      room.gameplay.gamemasterMode = false;
      room.gameplay.gamemaster     = null;
      room.gameplay.disableAutoVictory = false;

      if(room.getRemainingTime() > 1000 * 60 * 3) // to avoid infinite stages
        room.setStageDuration(60 * 3);

      if(room.currentStage === "wait")
        room.endStage();

      room.players.forEach(function(p) { // disable gamemaster communication
        p.player.setChannel("player-" + player.username, {r: false, w: false});
      });
    }

    if(player.canonicalRole)
      this.room.message("<strong><i>" + player.username + " " + player.canonicalRole + " s'est enfui.</i></strong>");

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
