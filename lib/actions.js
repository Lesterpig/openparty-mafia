module.exports = {
  
  /**
   * Static
   * @params {String} submit The submit message
   * @return {[type]}        The correct options for alive player selection in actions
   */
  getPlayerSelectOptions: function(submit) {

    return {
      choices: function(room, player) {
        var out = ["(Personne)"];
        room.players.forEach(function(p) {
        if(!p.player.roles.dead) {
          out.push(p.username);
        }
        });

        return out;
      },
      submit: submit
    }
  }

}