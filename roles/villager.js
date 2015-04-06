var votes = require("../lib/votes");

module.exports = function() {

  return {

    name: "Villager",
    side: "village",

    actions: {
      vote: votes.getVoteAction("", "vote")
    },
    channels: {
      general: {r: true, w: false, n: "Village"}
    }

  }

}
