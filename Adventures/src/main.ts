import Phaser from "phaser";
import './style.css';
import { scenes } from "./scenes";  

const app = document.getElementById('app') as HTMLElement;
app.innerHTML = `
  <div id="menu" class="menu">
    <button id="start-game">Start Game</button>
    <button id="options">Options</button>
    <button id="quit">Quit</button>
  </div>
  <button id="toggle-menu" class="toggle-menu">Menu</button>
`;

const menu = document.getElementById('menu') as HTMLElement;
const toggleMenuButton = document.getElementById('toggle-menu') as HTMLButtonElement;
const startGameButton = document.getElementById('start-game') as HTMLButtonElement;
const optionsButton = document.getElementById('options') as HTMLButtonElement;
const quitButton = document.getElementById('quit') as HTMLButtonElement;

toggleMenuButton.addEventListener('click', () => {
  menu.classList.toggle('hidden');
});

startGameButton.addEventListener('click', () => {
  console.log('Start Game clicked');
  menu.classList.add('hidden'); 
  new Phaser.Game({
    width: 1000,
    height: 600,
    title: 'Adventures',
    scene: scenes, 
    backgroundColor: '#000',
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      }
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    pixelArt: true,
  });
});

optionsButton.addEventListener('click', () => {
  console.log('Options clicked');
});

quitButton.addEventListener('click', () => {
  console.log('Quit clicked');
});