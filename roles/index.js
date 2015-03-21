module.exports = {

  /**
   * Set player roles
   * @param  {Room}   room
   */
  init: function(room) {

    var roles = {};
    var sum = 0;
    room.gameplay.parameters.forEach(function(p) {
      
      if(p.value < 0)
        throw new Error("Nombre invalide pour le rôle " + p.role);

      roles[p.role] = p.value;
      sum += p.value;
    });

    if(sum > room.players.length)
      throw new Error("Trop de rôles par rapport au nombre de joueurs.");
    
    // Suffle player list
    var o = [];
    for(var i = 0; i < room.players.length; i++) {
      o[i] = i;
    }

    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);


    // Affect roles
    rolesData = {};
    for(var r in roles) {
      rolesData[r] = new require("./" + r);
      for(var i = 0; i < roles[r]; i++) {
        room.players[o.pop()].player.setRole(r, rolesData[r]);
      }
    }

    // Set default role and remove default channel
    rolesData.villager = require("./villager");
    room.players.forEach(function(p) {
      p.player.setRole("villager", rolesData.villager);
      p.player.setChannel("general", {r: true, w: false});
    });

    return rolesData;

  }

}