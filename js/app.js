/*
* Create a list that holds all of your cards
*/
let classFigures = ["fa-anchor", "fa-bicycle", "fa-bolt", "fa-bomb", "fa-cube", "fa-diamond", "fa-leaf", "fa-paper-plane-o"];
let elements = [];
let previousCardSelected;
let cards = [];
let gamer;

/*
* Objects part of this game!
*/
let Card = class {
    constructor(position, classFigure, element) {
        this.self = this;
        this.position = position;
        this.figure = classFigure;
        this.element = element;
        this.elementChild = $(element).children()[0];
        this.open = false;
        this.match = false;
        this.cleanCard();
    }
    cleanCard() {
        //clean card element
        $(this.element).removeClass();
        $(this.element).addClass('card');
        $(this.element).off("click");
        $(this.element).on("click", { card: this }, this.toggleCard);
        //clean bottom card
        $(this.elementChild).removeClass();
        $(this.elementChild).addClass('fa');
        $(this.elementChild).addClass(this.figure);
    }
    toggleCard(event) {
        //display the card's symbol
        $(this).toggleClass("open show");
        let card = event.data.card;
        card.open = true;
        gamer.loadCard(card);
    }
    resetCard() {
        $(this.element).addClass("unmatch");
        setTimeout(() => {
            $(this.element).removeClass("unmatch");
            $(this.element).removeClass("open show");
        }, 500);
        this.open = false;
    }
    matched() {
        this.match = true;
        $(this.element).off("click");
        $(this.element).addClass('match');
        $(this.element).toggleClass("open show");
    }
    closeShow() {
        $(this.element).removeClass("open show");
    }

};

let Game = class {
    constructor() {
        this.moves = 0;
        this.cardMatched = 0;
        this.stars = 3;
        this.init();
    }
    // Shuffle function from http://stackoverflow.com/a/2450976
    shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
    /*
    * Display the cards on the page
    *   - shuffle the list of cards using the provided "shuffle" method below
    *   - loop through each card and create its HTML
    *   - add each card's HTML to the page
    */
    init() {
        elements = $(".deck").children();

        let contentPage = classFigures.slice().concat(classFigures.slice());
        contentPage = this.shuffle(contentPage);
        let index = 0;
        for (let element of elements) {
            //create a new card
            cards.push(new Card(index, contentPage[index], element));
            index += 1;
        }


    }
    loadCard(card) {

        // increment counter of moves
        this.moves += 1;
        $(".moves").text(this.moves);

        if (!previousCardSelected) {
            previousCardSelected = card;
        } else {
            //check to see if the two cards match
            if (previousCardSelected.figure === card.figure) {

                //if the cards do match, lock the cards in the open position
                previousCardSelected.matched();
                card.matched();
                //increment the move counter and display it on the page                        
                this.cardMatched += 1;
                if (this.cardMatched === 8) {
                    // if all cards have matched, display a message with the final score
                    this.gameOver();
                }
            } else {
                //if the cards do not match, remove the cards from the list and hide the card's symbol

                previousCardSelected.resetCard();
                card.resetCard();
                this.stars -= 1;
                console.log(this.stars);
                // reduce stars when missed
                $("ul.stars li i.fa.fa-star:last").addClass("fa-star-o");
                $("ul.stars li i.fa.fa-star:last").removeClass("fa-star");
                if (this.stars === 0) {
                    //end game and restart!
                    this.gameOver();

                }

            }
            previousCardSelected = null;

        }

    }
    restart(event) {
        // restart the game function

        self = event ? event.data.self : this;
        self.stars = 3;
        self.moves = 0;
        self.cardMatched = 0;
        $(".moves").text(self.moves);
        let starsDom = $("ul.stars li i.fa");
        for (let starDom of starsDom) {
            $(starDom).removeClass("fa-star-o");
            $(starDom).addClass("fa-star");
        }
        for (let card of cards) {
            card.closeShow();
        }
        elements = [];
        cards = [];
        previousCardSelected = null;
        self.init();

    }
    gameOver() {

        if (this.stars === 0) {
            swal({
                title:'Sorry! You lost..',
                text:'No more stars left.',
                type:'error',
                background: '#fff url(../img/geometry2.png)'                
        })
            // end game when stars are out
            this.restart();


        } else {
            swal({
                title:'Congratulations! You Won!',
                text:`With ${this.moves} Moves and ${this.stars} stars left`,
                type:'success',
                background: '#fff url(../img/geometry2.png)'
            })
              this.restart();
        }
    }
}


gamer = new Game();
$(".restart").on("click", { self: gamer }, gamer.restart);
//TODO:
// print game is over