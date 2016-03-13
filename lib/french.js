module.exports = {

  nb2word: function(nb) {
    switch(nb) {
      case 0: return "aucun";
      case 1: return "un";
      case 2: return "deux";
      case 3: return "trois";
      case 4: return "quatre";
      case 5: return "cinq";
      case 6: return "six";
      case 7: return "sept";
      case 8: return "huit";
      case 9: return "neuf";
      case 10: return "dix";
      case 11: return "onze";
      case 12: return "douze";
      default: return ""+nb;
    }
  },

  /**
   * Joins an object as a french sentence.
   *
   * join({ a: 1, b: 2 }) = "un a et deux b"
   *
   * @param  Object obj      Keys are "noun" and values are "nb of noun"
   * @param  String beforeNb
   * @param  String afterNb
   * @return String
   */
  join: function(obj, beforeNb, afterNb) {

    beforeNb = beforeNb || "";
    afterNb  = afterNb  || "";

    var array = [];
    for(var i in obj) { // to array
      array.push({k: i, v: obj[i]});
    }

    if(array.length === 0)
      return false;

    var output = "";
    array.forEach(function(e, i, a) {

      if(i > 0) {
        output += i < a.length-1 ? ", " : " et ";
      }
      output += beforeNb + this.nb2word(e.v) + afterNb + " " + e.k;
      if(e.v > 1)
        output += "s"; //should be improved

    }.bind(this));

    return output;
  }

};
