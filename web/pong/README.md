# Pong Game

A classic Pong game implementation using HTML5 Canvas, CSS, and vanilla JavaScript. Play against an AI opponent in this retro-style arcade game.

## 🎮 Features

- **Player vs AI**: Control your paddle and compete against an AI opponent
- **Multiple Control Methods**: Use mouse movement or keyboard (Arrow keys or W/S keys)
- **Score Tracking**: Real-time score display for both players
- **Smooth Gameplay**: Responsive controls and fluid ball physics
- **Modern UI**: Clean, gradient-based design with a retro feel

## 🚀 How to Run

1. Clone or download this repository
2. Open `index.html` in any modern web browser
3. The game starts automatically!

## 🎯 How to Play

- **Move Your Paddle**: 
  - Move your mouse up and down, OR
  - Use Arrow keys (↑/↓) or W/S keys
- **Goal**: Hit the ball past your opponent's paddle to score
- **Win**: First player to score more points wins!

## 🛠️ Technologies Used

- **HTML5**: Structure and canvas element
- **CSS3**: Styling and layout with gradients
- **Vanilla JavaScript**: Game logic and animation

## 📋 Implementation Details

### Game Structure

The game consists of three main files:

- **`index.html`**: Contains the game canvas, score display, and page structure
- **`style.css`**: Handles all visual styling including the gradient background and responsive layout
- **`game.js`**: Contains all game logic including physics, collision detection, and AI behavior

### Key Components

#### Game Objects
- **Player Paddle**: Left side, controlled by user input (mouse/keyboard)
- **AI Paddle**: Right side, automatically follows the ball with slight delay for fairness
- **Ball**: Moves continuously, bounces off walls and paddles

#### Game Loop
The game uses `requestAnimationFrame()` for smooth 60 FPS animation. Each frame:
1. Updates player paddle position based on input
2. Updates AI paddle position (follows ball)
3. Updates ball position and checks collisions
4. Draws all game elements to the canvas
5. Updates score display

#### Collision Detection
- **Wall Collisions**: Ball reverses vertical direction when hitting top/bottom walls
- **Paddle Collisions**: Ball reverses horizontal direction and gains angle based on hit position
- **Scoring**: Points are awarded when ball passes opponent's paddle

#### AI Behavior
The AI paddle uses a simple follow algorithm:
- Calculates the center position of the AI paddle
- Moves toward the ball's Y position
- Slightly slower than player paddle for balanced gameplay

## 📝 Code Structure

```javascript
// Game objects (player, ai, ball)
// Input handling (keyboard and mouse)
// Update functions (player, AI, ball)
// Collision detection
// Drawing functions
// Game loop with requestAnimationFrame
```

## 🎨 Customization

You can easily customize:
- Canvas size: Modify `canvas.width` and `canvas.height` in `game.js`
- Paddle size: Adjust `paddleHeight` and `paddleWidth` constants
- Ball speed: Change `ball.speedX` and `ball.speedY` values
- Colors: Update CSS gradient and fill colors
- AI difficulty: Adjust `ai.speed` multiplier

## 📄 License

This is a simple educational project. Feel free to use and modify as needed!

