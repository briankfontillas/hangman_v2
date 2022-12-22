const rl = require("readline-sync");
const rw = require("random-words");
const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split("");
const STARTING_TURNS = 6;

class Game {
	constructor() {
		this.done = false;
		this.win = false;
	}

	static welcome() {
		console.log("Welcome to Hangman!");
		rl.question("Press the enter key to continue...");
	}

	static goodbye() {
		console.log("Thanks for playing!");
	}

	static displayBoard(player, word) {
		console.log(`Turns left: ${player.turnsLeft}`);
		console.log("");
		console.log(word.hiddenWord);
		console.log("");
		console.log(player.availableLetters.join(', '));
	}

	checkGameStatus(player, word) {
		if (!word.hiddenWord.includes("_") || player.guess === word.word) {
			this.win = true;
			this.done = true;
		}
		if (player.turnsLeft < 1 || !word.hiddenWord.includes("_")) {
			this.done = true;
			return true;
		} 

	}

	gameover() {
		console.log(this.win === true ? "You Win!" : "Game over, you lose!");
	}

	playAgain() {
		let answer;

		while (true) {
			console.log("Would you like to play again?");
			answer = rl.question("");
			if (['y', 'ye', 'yes', 'n', 'no'].includes(answer.toLowerCase())) {
				break;
			} else {
				console.log('That is not a valid answer');
			}
		}

		if (answer.toLowerCase()[0] === 'y') this.done = false;
	}

	reset(player, word) {
		this.done = false;
		this.win = false;
		player.turnsLeft = STARTING_TURNS;
		player.availableLetters = LETTERS;
		word.hiddenWord = null;
	}
}

class Player {
	constructor() {
		this.guess = null;
		this.turnsLeft = STARTING_TURNS;
		this.availableLetters = LETTERS;
	}

	makeGuess() {
		let gs;

		while (true) {
			console.log("Please make a guess:");
			gs = rl.question("");
			if ((gs.length === 1 && this.availableLetters.includes(gs)) ||
				gs.length > 1) break;
			console.log(`${gs} is not a valid input!`);
			console.log("");
		}

		this.guess = gs;
		console.clear();
		console.log(this.guess);
	}

	checkGuess(wrd) {
		if (this.guess.length > 1 && this.guess === wrd.word) {
				console.log(`${this.guess} is correct!`);
		} else if (this.guess.length > 1 && this.guess !== wrd.word) {
				console.log(`${this.guess} is not the correct word!`);	
		} else if (wrd.word.includes(this.guess)) {
				console.log(`${this.guess} is correct!`);
		} else {
				console.log(`${this.guess} is not within the word`);
				this.turnsLeft -= 1;
		}
	}

	updateAvailableLetters() {
		this.availableLetters.splice(this.availableLetters.indexOf(this.guess), 1);
	}
}

class Word {
	constructor() {
		this.word = null;
		this.hiddenWord = null;
	}

	generateWord() {
		console.log("Word generated. Press enter key to continue...");
		rl.question("");
		this.word = rw();
		if (this.word.length < 5) this.word = rw();

		this.hiddenWord = this.word.split("")
			.map(letter => "_").join(" ");

		console.clear();
	}

	refreshWord(avail) {
		this.hiddenWord = this.word.split("")
			.map(letter => {
				return avail.includes(letter) ? "_" : letter;
			}).join(" ");
	}
}

const currentGame = new Game();
const player = new Player();
const myWord = new Word();

Game.welcome();

while (!currentGame.done) {
	myWord.generateWord();
	console.log(myWord.word); //remove

	while (!currentGame.done) {
		Game.displayBoard(player, myWord);
		player.makeGuess();
		player.checkGuess(myWord);
		player.updateAvailableLetters();
		myWord.refreshWord(player.availableLetters);
		if (currentGame.checkGameStatus(player, myWord));
	}
	currentGame.gameover();
	currentGame.playAgain();
	currentGame.reset(player, myWord);
}

Game.goodbye();