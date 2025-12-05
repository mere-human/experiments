// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 400;

// Game objects
const paddleHeight = 80;
const paddleWidth = 10;
const ballSize = 10;
const paddleSpeed = 5;

// Player paddle (left side)
const player = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    speed: paddleSpeed,
    score: 0
};

// AI paddle (right side)
const ai = {
    x: canvas.width - 20,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    speed: paddleSpeed * 0.7, // Slightly slower for fairness
    score: 0
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: ballSize,
    height: ballSize,
    speedX: 5,
    speedY: 5
};

// Input handling
let keys = {};
let mouseY = canvas.height / 2;

// Keyboard events
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Mouse events
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Update player paddle position
function updatePlayer() {
    // Keyboard controls
    if (keys['ArrowUp'] || keys['w'] || keys['W']) {
        player.y -= player.speed;
    }
    if (keys['ArrowDown'] || keys['s'] || keys['S']) {
        player.y += player.speed;
    }
    
    // Mouse controls
    const targetY = mouseY - player.height / 2;
    if (Math.abs(targetY - player.y) > 2) {
        player.y += (targetY - player.y) * 0.1;
    }
    
    // Keep paddle on screen
    if (player.y < 0) {
        player.y = 0;
    }
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
}

// Update AI paddle position
function updateAI() {
    const aiCenter = ai.y + ai.height / 2;
    const ballY = ball.y;
    
    // Simple AI: follow the ball
    if (ballY < aiCenter - 10) {
        ai.y -= ai.speed;
    } else if (ballY > aiCenter + 10) {
        ai.y += ai.speed;
    }
    
    // Keep paddle on screen
    if (ai.y < 0) {
        ai.y = 0;
    }
    if (ai.y + ai.height > canvas.height) {
        ai.y = canvas.height - ai.height;
    }
}

// Update ball position
function updateBall() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;
    
    // Ball collision with top and bottom walls
    if (ball.y <= 0 || ball.y + ball.height >= canvas.height) {
        ball.speedY = -ball.speedY;
    }
    
    // Ball collision with player paddle
    if (ball.x <= player.x + player.width &&
        ball.y + ball.height >= player.y &&
        ball.y <= player.y + player.height &&
        ball.speedX < 0) {
        ball.speedX = -ball.speedX;
        // Add slight angle based on where ball hits paddle
        const hitPos = (ball.y - player.y) / player.height;
        ball.speedY = (hitPos - 0.5) * 10;
    }
    
    // Ball collision with AI paddle
    if (ball.x + ball.width >= ai.x &&
        ball.y + ball.height >= ai.y &&
        ball.y <= ai.y + ai.height &&
        ball.speedX > 0) {
        ball.speedX = -ball.speedX;
        // Add slight angle based on where ball hits paddle
        const hitPos = (ball.y - ai.y) / ai.height;
        ball.speedY = (hitPos - 0.5) * 10;
    }
    
    // Score points
    if (ball.x < 0) {
        ai.score++;
        resetBall();
    }
    if (ball.x > canvas.width) {
        player.score++;
        resetBall();
    }
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.speedY = (Math.random() > 0.5 ? 1 : -1) * 5;
}

// Draw game objects
function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw center line
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillRect(ai.x, ai.y, ai.width, ai.height);
    
    // Draw ball
    ctx.fillRect(ball.x, ball.y, ball.width, ball.height);
    
    // Update score display
    document.getElementById('player-score').textContent = player.score;
    document.getElementById('ai-score').textContent = ai.score;
}

// Game loop
function gameLoop() {
    updatePlayer();
    updateAI();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
resetBall();
gameLoop();

