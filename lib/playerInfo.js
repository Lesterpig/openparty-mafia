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

    },

    gameplay.sendPlayerInfo = function(p) {
      var baseInfo = p.username;

      if(!p.player) {
        return;
      }

      if(p.player.roles.dead) {
        baseInfo = "✝ <del>" + baseInfo + "</del>";
      }

      var pIsFromMafia = isFromMafia(p);

      this.room.players.forEach(function(o) {

        var info = baseInfo;
        var oIsFromMafia = isFromMafia(o);

        if(   this.room.currentStage === "end"
           || p.player.roles.dead
           || (o.player.roles.gamemaster && this.room.currentStage !== "vote")
           || p.player.roles.gamemaster
          )
          info += " " + p.player.canonicalRole;

        if(pIsFromMafia && oIsFromMafia && !p.player.roles.gamemaster)
          info = "<strong class='mafia-mafia-chat'>" + info + "</strong>";

        if(this.room.currentStage !== "mafia" || this.room.currentStage === "mafia" && oIsFromMafia) {
          if(p.player.nbVotes)
            info = "<span class='badge'>" + p.player.nbVotes + "</span> " + info;

          if(p.player.choice)
            info += " → " + p.player.choice.username;
        }

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
        if(this.room.currentStage !== "mafia" || baseInfo !== info || oIsFromMafia)
          o.emit("playerInfo", {username: p.username, value: info});

      }.bind(this));

    }

  },
}
