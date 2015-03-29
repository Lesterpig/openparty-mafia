/**
 * MAIN DEFINITION FILE FOR OPENPARTY-MAFIA
 * LICENSED UNDER GPLv3
 *
 * From the original idea of Dmitry Davidoff.
 */

'use strict';

var roles      = require("./roles/index");
var stages     = require("./stages/index");
var victory    = require("./lib/victory");
var playerInfo = require("./lib/playerInfo");

module.exports = function() {

  // Metadata

  this.name        = "Mafia";
  this.version     = "0.0.3-dev";
  this.description = "Une version en ligne du jeu de Dmitry Davidoff - v" + this.version;
  this.minPlayers  = 4;
  this.maxPlayers  = 40;
  this.opVersion   = ">=0.0.3-dev";

  this.css         = ["mafia.css"];

  // Start
  
  this.start = function(room, callback) {

    victory.init(this);
    playerInfo.init(this);

    try {
      this.roles  = roles.init(room);
      this.stages = stages.init(room);
    } catch(e) {
      return callback(e.message);
    }

    callback(null);

    setTimeout(function() {
      var nbMafio  = room.gameplay.parameters[0].value;
      var mafioStr = (nbMafio > 1 ? "mafiosi est" : "mafioso sont"); 
      room.message("<strong><i>Vous vous trouvez dans le village de Salem. La Mafia rôde, et menace sérieusement la vie des villageois...</i></strong>");
      room.message("<strong><i>La police locale pense que " + nbMafio + " " + mafioStr + " parmi vous. Prenez garde !");
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
    help: "Un médecin peut protéger un citoyen par nuit s'il le souhaite. Si le protégé est attaqué par la Mafia, il survivra.",
    role: "doctor"
  },
  {
    name: "Nombre de Vigiles",
    type: Number,
    value: 0,
    help: "Un vigile peut assassiner un des habitants durant une nuit de son choix. Il est toutefois du côté des honnêtes citoyens.",
    role: "vigilant"
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
