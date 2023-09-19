// pre-load x image
let hitImage = new Image();
hitImage.src = 'x.png';

let difficultyOptions = document.querySelectorAll('.difficulty-option');

//setup the difficulty selection
difficultyOptions.forEach(option => {
  option.addEventListener('click', function() {
    // Remove 'selected' class from previously selected difficulty
    document.querySelectorAll('.difficulty-option').forEach(opt => opt.classList.remove('selected'));

    // Add 'selected' class to clicked difficulty
    this.classList.add('selected');
  });
});

//make sure the start button works with the difficulty selected
document.getElementById('start-game').addEventListener('click', function() {
  let selectedDifficulty = document.querySelector('.difficulty-option.selected');
  
  if (selectedDifficulty) {
    let difficulty = selectedDifficulty.id;
    new Game(difficulty);
    // Start the game music
    let gameMusic = document.getElementById('gameMusic');
    gameMusic.play();
  } else {
    // Provide feedback to the user if no difficulty is selected
    alert('Please select a difficulty level.');
  }
});


// bird class
class Bird {
    constructor(speed, gameContainer) {
      // create the bird element
      this.element = document.createElement('div');
      this.element.style.backgroundSize = 'contain';
      this.element.className = 'bird';
      this.x = Math.random() * 800; // position the bird at a random x-coordinate within the game area
      this.y = Math.random() * 600; // position the bird at a random y-coordinate within the game area
      
      //initializes speed and direction
      this.speedX = speed * (Math.random() < 0.5 ? -1 : 1);
      this.speedY = speed * (Math.random() < 0.5 ? -1 : 1);
      this.gameContainer = gameContainer;
  
      // listen for clicks on the bird
      this.element.addEventListener('click', (event) => {
        // check if the player has any shots left
        if (Game.shotsFired < Game.maxShots) {
          // increment the shot counter
          Game.shotsFired++;
  
          // hit the bird
          this.hit();
  
          // increment the score
          Game.score++;
          document.getElementById('score').textContent = 'Score: ' + Game.score;
  
          // update the number of shots remaining
          document.getElementById('shots-remaining').textContent = 'Bullets: ' + (Game.maxShots - Game.shotsFired);
        }
        event.stopPropagation();
      });
  
      // start the bird animation
      this.animate();
    }
    
    // animate the bird
    animate() {
      // update bird position
      this.x += this.speedX;
      this.y += this.speedY;
  
      // if the bird is off the grid, reverse the direction
      if (this.x < 0 || this.x > 750) { // adjust as needed
        this.speedX *= -1;
      }
      if (this.y < 0 || this.y > 550) { // adjust as needed
        this.speedY *= -1;
      }
      // update bird element
      this.element.style.left = this.x + 'px';
      this.element.style.top = this.y + 'px';
  
      // call animate again in the next frame
      this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    // mark the bird as hit
    hit() {
      // replace the bird image with an X
      this.element.style.backgroundImage = 'url(' + hitImage.src + ')'; // Replace with the path to your X image
      this.element.style.backgroundSize = '100% 100%';  // make the 'x' image cover the entire bird element
      // stop the birds current trajectory
      cancelAnimationFrame(this.animationFrame);
      // make the bird fall
      this.element.style.transition = 'top 2s';
      this.element.style.top = '550px';
      setTimeout(() => {
        this.gameContainer.removeChild(this.element);
        Game.currentGame.checkGameOver();
    }, 2000);
  }
}
  // game class
  class Game {
    constructor(difficulty) {
      // get the game container
      this.gameContainer = document.getElementById('game-container');
  
      // initialize shot counter, score, and misses
      Game.shotsFired = 0;
      Game.maxShots = 75;
      Game.score = 0;
      Game.misses = 0;
      Game.birds = [];
      this.gameContainer.addEventListener('click', () => {
        // A click occurred on the game container, but not on a bird.
        // This is a miss, so increment the miss counter.
        Game.misses++;
        document.getElementById('misses').textContent = 'Misses: ' + Game.misses;
        
        // Decrease the bullet count.
        Game.shotsFired++;
        document.getElementById('shots-remaining').textContent = 'Bullets: ' + (Game.maxShots - Game.shotsFired);
      });
      
      // difficulty levels
      const DIFFICULTIES = {
        'EASY': {numBirds: 5, speed: 1},
        'MEDIUM': {numBirds: 15, speed: 3},
        'XTREME': {numBirds: 25, speed: 5}
      };
  
      // create the birds
      var birdInfo = DIFFICULTIES[difficulty];
      for (var i = 0; i < birdInfo.numBirds; i++) {
        var bird = new Bird(birdInfo.speed, this.gameContainer);
        Game.birds.push(bird);
        this.gameContainer.appendChild(bird.element);
    
      }
      Game.currentGame = this;
    }
    checkGameOver() {
        if (document.getElementsByClassName('bird').length === 0) {
          document.getElementById('win-message').style.display = 'block';
          localStorage.setItem('difficulty', this.difficulty);  // store the difficulty in localStorage
          setTimeout(() => {
            location.reload();  // reload the page to restart the game
          }, 2000);
        }
      }
      
      
  }
  
 /* 
  let difficulties = ['EASY', 'MEDIUM', 'XTREME'];
  let selectedIndex = 0;
  
  function selectDifficulty(index) {
    // Remove 'selected' class from previously selected difficulty
    document.getElementById(difficulties[selectedIndex]).classList.remove('selected');
  
    // Add 'selected' class to currently selected difficulty
    selectedIndex = index;
    document.getElementById(difficulties[selectedIndex]).classList.add('selected');
  }
  
  // Initially select the first difficulty
  selectDifficulty(0);
  
  window.addEventListener('keydown', (event) => {
    switch (event.keyCode) {
      case 38:  // up arrow key
        selectDifficulty((selectedIndex - 1 + difficulties.length) % difficulties.length);
        break;
      case 40:  // down arrow key
        selectDifficulty((selectedIndex + 1) % difficulties.length);
        break;
      case 13:  // enter key
        new Game(difficulties[selectedIndex]);
        break;
    }
  } 
  );*/ 
  
  

  