/**
 * Generates the functions for showing playerInformations
 */

function isFromMafia(p) {
  return p.player.roles.mafia || p.player.roles.godfather || p.player.roles.gamemaster;
}

module.exports = {

  init: function(gameplay) {

    gameplay.resetPlayerInfo = function() {
      this.room.players.forEach(function(p) {
        this.sendPlayerInfo(p);
      }.bind(this));
    };

    gameplay.sendPlayerInfo = function(p) {
      if(!p.player) {
        return;
      }

      var pIsFromMafia = isFromMafia(p);

      this.room.players.forEach(function(o) {

        var username = p.username;
        var prefix   = "";
        var suffix   = "";

        if(p.player.roles.dead) {
          username = "<del>" + username + "</del>";
          prefix   = "✝";
        }

        var oIsFromMafia = isFromMafia(o);

        if(   this.room.currentStage === "end"
            || p.player.roles.dead
            || (o.player.roles.gamemaster && this.room.currentStage !== "vote")
            || p.player.roles.gamemaster
          )
          suffix = p.player.canonicalRole;

        if(pIsFromMafia && oIsFromMafia && !p.player.roles.gamemaster)
          username = "<strong class='mafia-mafia-chat'>" + username + "</strong>";

        if(this.room.currentStage !== "mafia" || this.room.currentStage === "mafia" && oIsFromMafia) {
          if(p.player.nbVotes)
            prefix = "<span class='badge'>" + p.player.nbVotes + "</span> ";

          if(p.player.choice)
            suffix = " → " + p.player.choice.username;
        }

        var info =  '<div class="col-xs-1 mafia-small-padding">' + prefix + '</div>' +
          '<div class="col-xs-5 mafia-small-padding">' + username + '</div>' +
          '<div class="col-xs-6 mafia-small-padding">' + suffix + '</div>';

        /**
         * Really important condition to avoid "hint" of mafia members
         * Safe reasons to push new infos:
         *
         * - We are in a safe moment (not while mafia vote)
         * - The info has changed for the player
         * - The player is from mafia
         *
         * TODO : We probably could improve this unflexible condition (or remove it with "abort" smaller conditions)
         */
        if(this.room.currentStage !== "mafia" || prefix || suffix || username !== p.username || oIsFromMafia)
          o.emit("playerInfo", {username: p.username, value: info});

      }.bind(this));
    };
  },
};
