module.exports = {

  /**
   * Static
   * @params {String} submit The submit message
   * @return {Array}         The correct options for alive player selection in actions
   */
  getPlayerSelectOptions: function(submit) {

    return {
      choices: function(room, player) {
        var out = ["(Personne)"];
        room.players.forEach(function(p) {
          if(!p.player.roles.dead && !p.player.roles.gamemaster) {
            out.push(p.username);
          }
        });

        return out;
      },
      submit: submit
    };
  }

};
