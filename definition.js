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
  this.description = "Une version en ligne du jeu de Dmitry Davidoff";
  this.minPlayers  = 4;
  this.maxPlayers  = 40;
  this.opVersion   = ">=0.0.2";
  this.version     = "0.0.1";

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
      room.message("<strong><i>Vous vous trouvez dans le village de Balakovo. La Mafia rôde, et menace sérieusement la vie des villageois...</i></strong>");
      room.message("<strong><i>La police locale pense que " + room.gameplay.parameters[0].value + " mafiosi sont parmis vous. Prenez garde !");
      room.nextStage("mafia");
    }, 100);

  };

  // Parameters
  
  this.parameters = [
  {
    name: "Nombre de mafiosi",
    type: Number,
    value: 1,
    help: "",
    role: "mafia"
  }
  ];

  // Disconnect
  
  this.onDisconnect = function(room, player) {

    if(player.canonicalRole)
      this.room.message("<strong><i>" + player.username + " (" + player.canonicalRole + ") s'est enfui.</i></strong>");

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