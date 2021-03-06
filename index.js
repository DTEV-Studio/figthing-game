const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576
let lastKey

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.75

class Sprite {
    constructor({position, velocity, color = 'red', offset}) {
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color
        this.isAttacking
        this.health = 100
    }

    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        // attack box
            if (this.isAttacking) {
            c.fillStyle = 'Yellow'
            c.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height
            )
        }
    }

    update() {
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y
        
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
          this.velocity.y = 0
        } else this.velocity.y += gravity
    }
    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }
}

const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    }
})

const enemy = new Sprite({
    position: {
        x: 974,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false 
    }
}
function rectangularCollision({rectangle1, rectangle2}){
    return(
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height 
    )
}

function determineWinner({player, enemy, setTimerId}){
    clearTimeout(setTimerId)
    document.getElementById('Result').style.display = 'flex'
    if(player.health === enemy.health) {
        document.getElementById('Result').innerHTML = 'Tie'
    }else if(player.health > enemy.health) {
        document.getElementById('Result').innerHTML = 'Player 1 Wins'
    }else if(player.health < enemy.health) {
        document.getElementById('Result').innerHTML = 'Player 2 Wins'
    }
}

let setTimer = 60
let setTimerId
function decreaseTimer(){
    if(setTimer > 0) {
        setTimerId = setTimeout(decreaseTimer, 1000)
        setTimer--
        document.getElementById('setTimer').innerHTML = setTimer
    }
    if (setTimer === 0) {
    determineWinner({player, enemy, setTimerId})
    }
}

decreaseTimer()

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
    if (keys.a.pressed && lastKey === 'a') {
        player.velocity.x = -4
    }else if (keys.d.pressed && lastKey === 'd') {
        player.velocity.x = 4
    }

    //enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -4
    }else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 4
    }

    //detect for collisions
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking
    )   {
        player.isAttacking = false
        enemy.health -= 20
        document.getElementById('enemyHealth').style.width = enemy.health + '%';
    }

    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking
    )   {
        enemy.isAttacking = false
        player.health -= 20
        document.getElementById('playerHealth').style.width = player.health + '%';
    }

    //end game based on health
    if(enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, setTimerId})
    }
    
}

animate()

addEventListener('keydown', (event) => {
    switch (event.key) {
//player
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 'w':
            player.velocity.y = -20
            break
        case 's':
            player.attack()
            break
//enemy
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -20
            break
        case 'ArrowDown':
            enemy.attack()
            break
                }

})
addEventListener('keyup', (event) => {
//player
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
                }
//enemy
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
                }    
})
