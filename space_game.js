const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// innerWidth is a window property, so no need to write window.innerWidth
canvas.width = innerWidth -10;
canvas.height = innerHeight - 10;

const playerX = 40;
const playerY = canvas.height/2;


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

class EnemyBullet{
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
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
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
        this.x = this.x + this.velocity; 
    }
}

//create the object after the class blueprint
//otherwise it won't work, ERROR
const player = new Player(playerX, playerY, 30, 'white');
let enemyBullets = [];
let playerBullet = new PlayerBullet(playerX + 50, playerY, 15, 'blue', 2.5);

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
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    player.draw();
    playerBullet.draw();
    playerBullet.update();

    enemyBullets.forEach( (enemyBullet, index) =>{
        enemyBullet.update();
        enemyBullet.draw();
    })
}


animate();
spawnEnemyBullets();
