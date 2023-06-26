module.exports = function serviceProcessGames(games, userid) {
  /*
  
  process the game list to provide user statistics
  
  parameters
  * games to be processed
  * userid to process games for a given user
  
  */

  console.log("user.serviceProcessGames");

  // Initialize
  let stats = {
    games: games.length,
    attack: 0,
    rateattack: 0,
    victory: 0,
    ratevictory: 0,
  };

  if (stats.games > 0) {
    // Summarize game outcomes
    games.forEach((game) => {
      stats.games = stats.games + 1;
      // Attack
      let player = game.players.filter(
        (gameplayer) => gameplayer._id === userid
      )[0];
      if (player.role === attack) {
        stats.attack = stats.attack + 1;
        if (game.outcome >= 0) {
          stats.victory = stats.victory + 1;
        }
      } else {
        if (game.outcome < 0) {
          stats.victory = stats.victory + 1;
        }
      }
    });

    // Compute rates
    stats.rateattack = stats.attack / stats.games;
    stats.ratevictory = stats.victory / stats.games;
  }

  // Neater response
  delete stats.attack;
  delete stats.victory;

  return stats;
};
