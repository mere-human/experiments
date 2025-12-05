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
const baseSpeed = 5;
const speedIncreaseRate = 0.02; // Speed multiplier increase per second
const maxSpeedMultiplier = 2.5; // Maximum speed multiplier
const speedIncreaseInterval = 2; // Increase speed every N seconds
let speedMultiplier = 1;
let lastSpeedIncreaseTime = Date.now();

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: ballSize,
    height: ballSize,
    speedX: baseSpeed,
    speedY: baseSpeed
};

// Input handling
let keys = {};
let mouseY = canvas.height / 2;
let previousMouseY = canvas.height / 2;
let mouseMoved = false;

// Game state
let isPaused = false;
let animationFrameId = null;

// Sound system (minimal - using Web Audio API)
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Resume audio context on first user interaction (required by some browsers)
let audioInitialized = false;
function initAudio() {
    if (!audioInitialized && audioContext.state === 'suspended') {
        audioContext.resume();
        audioInitialized = true;
    }
}

function playSound(frequency, duration = 0.1, type = 'sine') {
    if (isPaused) return; // Don't play sounds when paused
    
    initAudio(); // Ensure audio is initialized
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Keyboard events
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    // Handle Escape key for pause/resume
    if (e.key === 'Escape') {
        e.preventDefault();
        togglePause();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Mouse events
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
    mouseMoved = true;
});

// Update player paddle position
function updatePlayer() {
    // Check if any keyboard keys are pressed
    const keyboardPressed = keys['ArrowUp'] || keys['ArrowDown'] || keys['w'] || keys['W'] || keys['s'] || keys['S'];

    // Keyboard controls (priority)
    if (keys['ArrowUp'] || keys['w'] || keys['W']) {
        player.y -= player.speed;
        mouseMoved = false; // Disable mouse control when using keyboard
    }
    if (keys['ArrowDown'] || keys['s'] || keys['S']) {
        player.y += player.speed;
        mouseMoved = false; // Disable mouse control when using keyboard
    }
    
    // Mouse controls (only when mouse is actively moving and keyboard is not being used)
    if (!keyboardPressed && mouseMoved && mouseY !== previousMouseY) {
        const targetY = mouseY - player.height / 2;
        player.y = targetY; // Direct positioning for responsive mouse control
        mouseMoved = false; // Reset flag after applying mouse control
    }
    
    // Update previous mouse position
    previousMouseY = mouseY;

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

// Increase ball speed over time
function increaseBallSpeed() {
    const currentTime = Date.now();
    const timeDelta = (currentTime - lastSpeedIncreaseTime) / 1000; // Convert to seconds
    
    if (timeDelta >= speedIncreaseInterval) {
        // Increase speed multiplier
        const oldMultiplier = speedMultiplier;
        speedMultiplier = Math.min(speedMultiplier + speedIncreaseRate, maxSpeedMultiplier);
        
        // Only update if multiplier actually increased
        if (speedMultiplier > oldMultiplier) {
            // Proportionally increase speed while preserving direction
            const speedRatio = speedMultiplier / oldMultiplier;
            ball.speedX *= speedRatio;
            ball.speedY *= speedRatio;
            
            lastSpeedIncreaseTime = currentTime;
        }
    }
}

// Update ball position
function updateBall() {
    // Gradually increase speed over time
    increaseBallSpeed();
    
    ball.x += ball.speedX;
    ball.y += ball.speedY;
    
    // Ball collision with top and bottom walls
    if (ball.y <= 0 || ball.y + ball.height >= canvas.height) {
        ball.speedY = -ball.speedY;
        playSound(200, 0.05); // Low beep for wall hit
    }
    
    // Ball collision with player paddle
    if (ball.x <= player.x + player.width &&
        ball.y + ball.height >= player.y &&
        ball.y <= player.y + player.height &&
        ball.speedX < 0) {
        ball.speedX = -ball.speedX; // Reverse direction, speed already has multiplier applied
        // Add slight angle based on where ball hits paddle
        const hitPos = (ball.y - player.y) / player.height;
        ball.speedY = (hitPos - 0.5) * 10 * speedMultiplier;
        playSound(400, 0.1); // Medium pitch for paddle hit
    }
    
    // Ball collision with AI paddle
    if (ball.x + ball.width >= ai.x &&
        ball.y + ball.height >= ai.y &&
        ball.y <= ai.y + ai.height &&
        ball.speedX > 0) {
        ball.speedX = -ball.speedX; // Reverse direction, speed already has multiplier applied
        // Add slight angle based on where ball hits paddle
        const hitPos = (ball.y - ai.y) / ai.height;
        ball.speedY = (hitPos - 0.5) * 10 * speedMultiplier;
        playSound(400, 0.1); // Medium pitch for paddle hit
    }
    
    // Score points
    if (ball.x < 0) {
        ai.score++;
        playSound(300, 0.15); // Lower pitch for AI score
        resetBall();
    }
    if (ball.x > canvas.width) {
        player.score++;
        playSound(600, 0.15); // Higher pitch for player score
        resetBall();
    }
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    // Reset speed multiplier when ball resets (optional - comment out to keep speed increasing)
    // speedMultiplier = 1;
    ball.speedX = (Math.random() > 0.5 ? 1 : -1) * baseSpeed * speedMultiplier;
    ball.speedY = (Math.random() > 0.5 ? 1 : -1) * baseSpeed * speedMultiplier;
    lastSpeedIncreaseTime = Date.now();
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

// Pause the game (without toggling)
function pauseGame() {
    if (!isPaused) {
        isPaused = true;
        const pauseOverlay = document.getElementById('pause-overlay');
        const pauseBtn = document.getElementById('pause-btn');
        pauseOverlay.classList.remove('hidden');
        pauseBtn.textContent = 'Resume';
    }
}

// Resume the game
function resumeGame() {
    if (isPaused) {
        isPaused = false;
        const pauseOverlay = document.getElementById('pause-overlay');
        const pauseBtn = document.getElementById('pause-btn');
        pauseOverlay.classList.add('hidden');
        pauseBtn.textContent = 'Pause';
        // Resume game loop
        gameLoop();
    }
}

// Toggle pause state
function togglePause() {
    if (isPaused) {
        resumeGame();
    } else {
        pauseGame();
    }
}

// Game loop
function gameLoop() {
    if (!isPaused) {
        updatePlayer();
        updateAI();
        updateBall();
        draw();
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

// Pause button click handler
document.getElementById('pause-btn').addEventListener('click', togglePause);

// Auto-pause when tab loses focus
window.addEventListener('blur', () => {
    pauseGame();
});

// Start the game
resetBall();
gameLoop();

