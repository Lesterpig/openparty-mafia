module.exports = {

  /**
   * Initialize the victory function for the room.
   * Can be overriden by custom roles.
   */
  init: function(gameplay) {

    gameplay.endGame = function(msg) {
      this.room.nextStage("end", function() {
        this.room.message("<h2>" + msg + "</h2>");
      }.bind(this));
    }

    gameplay.checkEnd = function() {

      if(this.room.currentStage === "end")  {
        return false;
      }

      var nbMafiosi   = this.nbAlive("mafia");
      var nbVillagers = this.nbAlive("villager") - nbMafiosi;

      if(nbVillagers === 0 && nbMafiosi === 0) {
        this.endGame("Le village est décimé, il n'y a aucun survivant.");
        return true;
      } else if(nbVillagers === 0) {
        this.endGame("La Mafia a réussi a éliminer tous les citoyens !");
        return true;
      } else if (nbMafiosi === 0) {
        this.endGame("Les citoyens ont réussi à repousser la Mafia !");
        return true;
      }

      return false;

    }

  },
}
