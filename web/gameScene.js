class GameScene extends Phaser.Scene {
    constructor() {
      super({ key: 'GameScene' });
    }
  
    preload() {
      // Загрузка спрайтов персонажа, доски и монстров
      this.load.image('tiles', 'assets/tiles.png');
      this.load.spritesheet('geralt', 'assets/geralt.png', {
        frameWidth: 32,
        frameHeight: 32,
      });
      this.load.image('noticeBoard', 'assets/notice_board.png');
    }
  
    create() {
      // Отображение мира
      this.add.image(960, 540, 'tiles');
  
      // Спрайт персонажа
      this.player = this.physics.add.sprite(500, 500, 'geralt');
  
      // Доска объявлений
      this.noticeBoard = this.add.image(800, 500, 'noticeBoard').setInteractive();
  
      // Добавление анимаций
      this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('geralt', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
  
      // Управление движением
      this.cursors = this.input.keyboard.createCursorKeys();
  
      // Взаимодействие с доской
      this.noticeBoard.on('pointerdown', () => {
        alert('You took a new quest!');
      });
    }
  
    update() {
      // Управление игроком
      const speed = 200;
      this.player.setVelocity(0);
  
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-speed);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(speed);
      }
  
      if (this.cursors.up.isDown) {
        this.player.setVelocityY(-speed);
      } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(speed);
      }
  
      // Анимация при движении
      if (this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0) {
        this.player.play('walk', true);
      } else {
        this.player.stop();
      }
    }
  }  