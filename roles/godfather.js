var votes = require("../lib/votes");

module.exports = function() {

  /**
   * TODO some refactor
   * The godfather should have two roles: "mafia" and "godfather"
   * When refactored, it would be easier to deal with clans management
   */

  return {

    name: "Parrain",
    desc: "Vous devez assassiner tous les innocents villageois, vous apparaissez comme un innocent aux yeux du Détective...",
    side: "mafia",

    actions: {
      vote: votes.getVoteAction("mafia", "mafia")
    },
    channels: {
      mafia: {r: true, w: false, n: "Mafia", p: 10}
    }

  };

};
