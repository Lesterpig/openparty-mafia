'use strict';

var roles = require("./roles/index");

module.exports = function() {

  // Metadata

  this.name        = "Mafia";
  this.description = "Une version en ligne du jeu de Dmitry Davidoff";
  this.minPlayers  = 4;
  this.maxPlayers  = 40;
  this.opVersion   = ">=0.0.2";
  this.version     = "0.1.0";

  // Start
  
  this.start = function(room, callback) {

    roles.init(room);
    callback(null);

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

};