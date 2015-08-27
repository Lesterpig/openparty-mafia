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
    };

    gameplay.checkEnd = function() {

      if(this.room.currentStage === "end" || this.room.gameplay.disableAutoVictory)  {
        return false;
      }

      var nbMafiosi   = this.nbAlive("mafia") + this.nbAlive("godfather") + this.nbAlive("terrorist");
      var nbVillagers = this.nbAlive("villager") - nbMafiosi;

      if(nbVillagers === 0 && nbMafiosi === 0) {
        this.endGame("<span class='glyphicon glyphicon-star'></span> Le village est décimé, il n'y a <strong>aucun</strong> survivant.");
        return true;
      } else if (nbMafiosi === 0) {
        this.endGame("<span class='glyphicon glyphicon-star'></span> Les citoyens ont réussi à repousser la Mafia !");
        return true;
      } else if(nbVillagers <= 1) {
        this.endGame("<span class='glyphicon glyphicon-star'></span> La Mafia a réussi à contrôler le village !");
        return true;
      }

      return false;

    };

  },
};
