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

module.exports = function() {

  // Metadata

  this.name        = "Mafia";
  this.version     = "0.0.3-dev";
  this.description = "Une version en ligne du jeu de Dimitry Davidoff - v" + this.version;
  this.minPlayers  = 4;
  this.maxPlayers  = 40;
  this.opVersion   = ">=0.0.3-dev";

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
      var nbMafio    = room.gameplay.parameters[0].value;
      var mafioStr   = (nbMafio > 1 ? "mafiosi sont" : "mafioso est");
      var nbDoc      = room.gameplay.parameters[1].value;
      var docStr     = (nbDoc > 1 ? "docteurs" :  "docteur");
      var nbVigile   = room.gameplay.parameters[2].value;
      var vigileStr  = (nbVigile > 1 ? "vigiles" : "vigile");
      var nbTerror   = room.gameplay.parameters[3].value;
      var terrorStr  = (nbTerror > 1 ? "terroristes" : "terroriste");
      var nbDetect   = room.gameplay.parameters[4].value;
      var detectStr  = (nbDetect > 1 ? "détectives" : "detective");
      var nbParrain  = room.gameplay.parameters[5].value;
      var parrainStr = (nbParrain > 1 ? "parrains" : "parrain");
      room.message("<strong><i>Vous vous trouvez dans le village de Salem. La Mafia rôde, et menace sérieusement la vie des villageois...</i></strong>");
      room.message("<strong><i>La police locale pense que " + nbMafio + " " + mafioStr + " parmi vous, " + nbTerror + " " + terrorStr + ", ainsi que " + nbParrain + " " + parrainStr + ". Prenez garde !</strong></i>");
      room.message("<strong><i>Pour aider les innocents, il y a " + nbDoc + " " + docStr + ", " + nbVigile + " " + vigileStr + " et " + nbDetect + " " + detectStr + ".")
      room.nextStage("mafia");
    }, 100);

  };

  // Parameters

  this.parameters = [
  {
    name: "Nombre de Mafiosi",
    type: Number,
    value: 1,
    help: "Les Mafiosi ont pour objectif de prendre le contrôle du village. Ensemble, ils décident d'éliminer un citoyen par nuit.",
    role: "mafia"
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
    name: "Nombre de Terroristes",
    type: Number,
    value: 0,
    help: "Un terroriste peut commettre un attentat suicide durant une nuit de son choix. Il mourra avec la cible de son choix. Le docteur ne protège pas contre l'attentat; mais empêchera un terroriste d'agir s'il protège celui-ci pendant la nuit.",
    role: "terrorist"
  },
  {
    name: "Nombre de Détectives",
    type: Number,
    value: 0,
    help: "Un détective peut découvrir, chaque nuit, le camp d'un joueur (innocent ou mafioso).",
    role: "detective"
  },
  {
    name: "Nombre de Parrains",
    type: Number,
    value: 0,
    help: "Un parrain fait parti du camp de la mafia mais apparait comme un innocent aux yeux du détective.",
    role: "godfather"
  }
  ];

  // Disconnect

  this.onDisconnect = function(room, player) {

    if(player.canonicalRole)
      this.room.message("<strong><i>" + player.username + " " + player.canonicalRole + " s'est enfui.</i></strong>");

    if(room.gameplay.checkEnd)
      room.gameplay.checkEnd();
  }

  // Chat styles

  this.processMessage = function(channel, message, player) {

    if(channel === "dead") {
      message = "<i class='mafia-dead-chat'>" + message + "</i>";
    }

    if(channel === "mafia") {
      message = "<span class='mafia-mafia-chat'>" + message + "</span>";
    }

    return message;
  }

};
