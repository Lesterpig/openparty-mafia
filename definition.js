'use strict';

var roles  = require("./roles/index");
var stages = require("./stages/index");

module.exports = function() {

  // Metadata

  this.name        = "Mafia";
  this.description = "Une version en ligne du jeu de Dmitry Davidoff";
  this.minPlayers  = 1;
  this.maxPlayers  = 40;
  this.opVersion   = ">=0.0.2";
  this.version     = "0.1.0";

  // Start
  
  this.start = function(room, callback) {

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
    }, 500);

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

  // Stages
  
  this.stages = {};

};