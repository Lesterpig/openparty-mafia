module.exports = {

  /**
   * Static
   * @params {String} submit   The submit message
   * @params {Array}  targets  Type of targets for this action. Format : {alive, innocent, self}
   * @return {Array}           The correct options for alive player selection in actions
   */
  getPlayerSelectOptions: function(submit, targets) {

    return {
      choices: function(room, player) {
        var out = ["(Personne)"];
        room.players.forEach(function(p) {
          if(isValidTarget(player, p.player, targets)) {
            out.push(p.username);
          }
        });

        return out;
      },
      submit: submit
    };
  }
};

var isValidTarget = function(playerSource, playerTarget, targets) {
  return !((playerTarget.roles.gamemaster)
       || (!targets.self && playerSource == playerTarget)
       || ((targets.innocent === "yes" && (playerTarget.roles.mafia || playerTarget.roles.godfather)) || (!targets.innocent && (!playerTarget.roles.mafia && !playerTarget.roles.godfather)))
       || ((targets.alive === "yes" && playerTarget.roles.dead) || (!targets.alive && !playerTarget.roles.dead)));
};
