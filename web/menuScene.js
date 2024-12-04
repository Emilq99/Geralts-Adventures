class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  preload() {
    // Загрузка фонов и кнопок
    this.load.image('background', 'assets/background.png');
    this.load.image('button', 'assets/button.png');
  }

  create() {
    // Центр сцены
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Фон
    this.add.image(centerX, centerY, 'background')
      .setOrigin(0.5)
      .setDisplaySize(1920, 1080);

    // Текст заголовка
    this.add.text(centerX, centerY - 300, 'Geralts Adventures', {
      font: '48px Arial',
      fill: '#ffffff',
    }).setOrigin(0.5);

    // Кнопка "Start Game"
    const startButton = this.add.image(centerX, centerY, 'button').setInteractive();
    this.add.text(centerX, centerY, 'Start Game', {
      font: '24px Arial',
      fill: '#000000',
    }).setOrigin(0.5);

    // Обработчик клика
    startButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });
  }
}