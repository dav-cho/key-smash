// import { currentGame } from '../app.js';

/**
 ***** Results *******************************************************************************
 **/
export class Result {
  constructor(currentGame) {
    // dom selectors
    this.wordCountResults = null;
    this.scoreResults = null;
    this.highScoreResults = null;

    // result properties
    this.wordCount = currentGame.wordCount;
    this.score = currentGame.score;
    this.highScore = currentGame.highScore;
  }

  initialize() {
    // initialize dom selectors
    this.wordCountResults = document.getElementById('word-count-results');
    this.scoreResults = document.getElementById('score-results');
    this.highScoreResults = document.getElementById('high-score');
  }

  displayResults() {
    this.wordCountResults.innerText = this.wordCount;
    this.scoreResults.innerText = this.score;
    this.highScoreResults.innerText = this.highScore;
  }
}
