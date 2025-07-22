//musics
let turnMusic = new Audio('select-sound.mp3');
let winMusic = new Audio('winning.wav');


//making cell
const grid = document.getElementById('gridBox');
const gridSize = 10
for(let i = 0; i < gridSize**2; i++){
    const cell = document.createElement('div');
    cell.classList.add('cell');
    grid.append(cell);
}

let player1Wins = 0;
let player2Wins = 0;
let gameplayed = 0;

let board = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
//initialiaze with some value using fill() to iterate the map()
// //with each call of arrow func new array with own memory location, not pointing to same one
// 0: Empty, 1: Player 1, 2: Player 2

let turn = 2;



//access cells
const cells = document.getElementsByClassName('cell');

const dome =  document.getElementById('turnDome');

const turntext = document.createElement('p');
    turntext.setAttribute('id', 'turn_text');

    dome.append(turntext);

Array.from(cells).forEach((cell, index) => {//index here is cell's index
    cell.addEventListener('click', () => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;

        if (cell.innerHTML === '' && board[row][col] === 0) { //checking for an empty cell along with which player cell is it
            const ball = document.createElement('div');
            ball.classList.add('ball');
            turn = turn === 2 ? 1 : 2 ;
            turnMusic.play();

            if (turn === 1) { // Player 1's blue
                ball.style.backgroundColor = '#EC4067';

                document.body.style.backgroundColor = '#1EA896';

                dome.style.backgroundColor = '#1EA896';
                dome.style.right = 'auto';
                dome.style.left = '0';
                dome.style.transform = 'translate(0%, -50%)';

                turntext.innerText = `Player ${turn}`;
            } else { // Player 2 red
                ball.style.backgroundColor = '#1EA896';

                document.body.style.backgroundColor = '#EC4067';

                dome.style.backgroundColor = '#EC4067';
                dome.style.left = 'auto';
                dome.style.right = '0';
                dome.style.transform = 'translate(0%, -50%) rotate(180deg)';
               
                turntext.innerText = `Player ${turn}`;
            }
            board[row][col] = turn;
            cell.append(ball);
        
            dome.style.width = '10vw';
            turntext.style.fontSize = '3vw';
            setTimeout(() => {
                dome.style.width = '0';
                turntext.style.fontSize = '0';
                if (turn === 1) {
                    dome.style.transform = 'translate(0%, -50%)'; //Player 1
                } else {
                    dome.style.transform = 'translate(0%, -50%) rotate(180deg)'; //Player 2
                }
            }, 1000);

            // win condition
            if (win(row, col)) {
                disableBoard();
                winMessage(turn);
                
                return;
            }
        }
    });
});

function win(row, col){
    const directions = [
        [0, 1], // Horizontal, only column changes
        [1, 0], // Vertical, only row changes
        [1, 1], // Diagonal (top-left to bottom-right)
        [1, -1], // Diagonal (top-right to bottom-left)
    ];
    for (const [dx, dy] of directions) {
        let marked = [[row, col]];//mark[[3,2]]

        // let count = 1;

        //forward check
        let r = row + dx;
        let c = col + dy;

        while(r>=0 && r<gridSize && c>=0 && c<gridSize && board[r][c] === turn){
            marked.push([r,c]); 
            r += dx;
            c += dy;
            //mark[[3,2], [3,3], [3,4], [3,5], [3,6]] - horizontal check
        }

        //backward check
        r = row - dx;
        c = col - dy;

        while(r>=0 && r<gridSize && c>=0 && c<gridSize && board[r][c] === turn){
            marked.push([r,c]);
            r -= dx;
            c -= dy;
        }
        if (marked.length >= 5) {
            marked.forEach(([r, c]) => {
                cells[r * gridSize + c].classList.add('win'); // Highlight the exact cell (formula)
            });
            return true;
        }
    }
    return false;
}

function winMessage(turn){
    gameplayed++;
    const winMsg = document.createElement('div');
    winMsg.id = 'winmsg';
    winMsg.innerText = `Player ${turn} Wins!`;
    grid.append(winMsg);

    const imgBox = document.createElement('div');
        imgBox.className = 'imgbox'; 

        const img = document.createElement('img');
        img.src = 'icegif.gif'; 
        img.alt = 'Animated GIF'; 

        imgBox.appendChild(img);

    winMsg.appendChild(imgBox);
    
    

    document.querySelector('.imgbox').getElementsByTagName('img')[0].style.width = '10vw';
    winMusic.play();
    winMsg.style.fontWeight = 'bold';

    setTimeout(() => {
        winMsg.style.display = 'none';
    }, 5000);

    if (turn === 1) {
        player1Wins++; 
        winMsg.style.color = '#EC4067';
        document.getElementById('player1Score').innerText = player1Wins + '/' + gameplayed; 
    } else {
        player2Wins++;
        winMsg.style.color = '#1EA896';
        document.getElementById('player2Score').innerText = player2Wins + '/' + gameplayed;
    }
}


function reset() {
    board = Array(gridSize)
        .fill()
        .map(() => Array(gridSize).fill(0));
    Array.from(cells).forEach(cell => {
        cell.innerHTML = '';
        cell.classList.remove('win');
        cell.style.pointerEvents = 'auto';
    });
    turn = 2; // Reset to Player 2 starting
    document.body.style.backgroundColor = '#f4f4f4';
    
}



function disableBoard() {
    Array.from(cells).forEach(cell => (cell.style.pointerEvents = 'none'));
}

document.getElementById('info').addEventListener('click', () =>{
    document.getElementById('play').style.display = 'block';
})

function closeManual(){
    document.getElementById('play').style.display = 'none';
}