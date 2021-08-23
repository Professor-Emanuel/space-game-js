const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// innerWidth is a window property, so no need to write window.innerWidth
canvas.width = innerWidth -10;
canvas.height = innerHeight - 10;

const playerX = 40;
const playerY = canvas.height/2;

/*
const scoreElement = ;
const startGameButton = ;
*/
const gameOverScreen = document.querySelector('#gameOverScreen');
//const hugeScoreElement = ;


//Player blueprint
class Player{
    constructor(x, y, radius, color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw(){
        ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        ctx.closePath();
        
    }
}

class PlayerBullet{
    constructor(x, y, radius, color, velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw(){
        ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        ctx.closePath();
    }

    update(){
        this.draw();
        this.x = this.x + this.velocity.x; 
        this.y = this.y + this.velocity.y;
    }
}

class EnemyBullet{
    constructor(x, y, radius, color, velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.sound = 'sound1';
    }

    draw(){
        ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        ctx.closePath();
    }

    update(){
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

//create the object after the class blueprint
//otherwise it won't work, ERROR
const player = new Player(playerX, playerY, 30, 'white');
let enemyBullets = [];
let playerBullets = [];

//sound effects
let explosion = document.createElement(`audio`);
explosion.src = './sounds/explosion3.wav';

function spawnEnemyBullets(){
    // this function, calls the code every x-milliseconds (1000 in our case)
    setInterval( () => {
        const radius = Math.random() * 15 + 5;
        let x;
        let y;
        x = canvas.width + radius;
        y = Math.random() * canvas.height ; 
        // ${Math.random() * 360} is called a template literal
        const color = `hsl( ${Math.random() * 360}, 50%, 50%)`;
        const angle = Math.atan2(playerY - y, playerX - x);
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
        enemyBullets.push(new EnemyBullet(x, y, radius, color, velocity));
    }, 1000);
}

function initialize(){
    enemyBullets = [];
}


function animate(){
    animationId = requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    player.draw();

    playerBullets.forEach( (playerBullet, index) => {
        playerBullet.update();

        //remove off screen (top, bottom, right) player bullets
        if(//right edge
            playerBullet.x - playerBullet.radius > canvas.width ||
            //top edge
            playerBullet.y + playerBullet.radius < 0 ||
            //bottom edge
            playerBullet.y - playerBullet.radius > canvas.height
            ){
                setTimeout( ()=>{
                    playerBullets.splice(index, 1)
                }, 1);
            }
    })

    enemyBullets.forEach( (enemyBullet, index) =>{
        enemyBullet.update();
        //compute the distance between each enemy bullet and the player
        const distance = Math.hypot(player.x - enemyBullet.x, player.y - enemyBullet.y);
        //game over screen
        //detect and resolve player - enemy bullet collision
        if(distance - enemyBullet.radius - player.radius < 1){
            cancelAnimationFrame(animationId);
            gameOverScreen.style.display = 'flex';
            //hugeScoreElement.innerHTML = score;
        }

        //remove off screen (left) enemy bullets
        if(enemyBullet.x + enemyBullet.radius < 0){
            setTimeout( ()=>{
                enemyBullets.splice(index, 1);
            }, 1);
        }

        //detect and resolve player bullet - enemy bullet collision
        playerBullets.forEach( (playerBullet, playerBulletIndex) => {
            //compute the distance between each player bullet and the enemy current bullet
            const distance = Math.hypot(playerBullet.x - enemyBullet.x, playerBullet.y - enemyBullet.y);
            //when player bullets touch enemy bullet
            if(distance - enemyBullet.radius - playerBullet.radius < 1){
                //create an explotion -- will be added

                //update score -- will be added

                //play explosion sound on impact
                setTimeout( () =>{
                    explosion.play();
                    enemyBullets.splice(index, 1);
                    playerBullets.splice(playerBulletIndex, 1);
                }, 0);
            }
        })
        enemyBullet.draw();
    })



    
}

// window.addEventListener same as, addEventListener
addEventListener('click', (event)=>{
    const angle = Math.atan2(event.clientY - playerY, event.clientX - playerX);
    const velocity = {
        x:Math.cos(angle) * 5,
        y:Math.sin(angle) * 5
    }
    playerBullets.push(new PlayerBullet(playerX, playerY, 5, 'green', velocity));
})

animate();
spawnEnemyBullets();
