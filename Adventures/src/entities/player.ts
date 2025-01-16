import { Entity } from "./entity";
import { SPRITES } from '../utils/constants';

type SpriteType = {
    [key: string]: string;
    base: string; 
    fight?: string;
}

export class Player extends Entity {
    textureKey: string;
    private moveSpeed: number;
    enemies: Entity[];
    target: any;
    isAttacking: boolean;
    playerHealthBar: Phaser.GameObjects.Graphics;
    enemyHealthBar: Phaser.GameObjects.Graphics;
    isAlive: boolean;
    initialPosition: { x: number; y: number; };
    currentDirection: string;
    private sword: Phaser.GameObjects.Sprite;
    constructor(scene: Phaser.Scene, x: number, y: number, texture: SpriteType) {
        super(scene, x, y, texture.base, SPRITES.PLAYER.base);

        const anims = this.scene.anims;
        const animsFrameRate = 9;
        this.moveSpeed = 50;
        this.setSize(28, 32);
        this.setOffset(10, 16);
        this.initialPosition = { x, y };
        this.isAlive = true;
        this.isAttacking = false;
        this.play('sword-down');

        this.sword = this.scene.add.sprite(0, 0, 'sword');
        this.sword.setOrigin(0.5, 0.5); 
        this.sword.setVisible(false);        

        this.setupKeysListeners();
        this.createAnimation('down', texture.base, 0, 2, anims, animsFrameRate);
        this.createAnimation('left', texture.base, 12, 14, anims, animsFrameRate);
        this.createAnimation('right', texture.base, 24, 26, anims, animsFrameRate);
        this.createAnimation('up', texture.base, 36, 38, anims, animsFrameRate);     

        this.scene.load.spritesheet('sword', 'src/assets/sword.png', {
            frameWidth: 16,
            frameHeight: 16
        });     

        this.drawPlayerHealthBar();
        this.on('animationcomplete', () => {
            this.isAttacking = false;
            this.sword.setVisible(false); 
        });
    }

    private createAnimation(
        key: string,
        textureKey: string,
        start: number,
        end: number,
        anims: Phaser.Animations.AnimationManager,
        frameRate: number,
        repeat: number = -1
    ) {
        anims.create({
            key,
            frames: anims.generateFrameNumbers(textureKey, { start, end }),
            frameRate,
            repeat,
        })
    }

    private drawPlayerHealthBar() {
        this.playerHealthBar = this.scene.add.graphics();
        this.playerHealthBar.setScrollFactor(0);
        this.drawHealthBar(this.playerHealthBar, 10, 10, this.health / 100)
    }

    private drawEnemyHealthBar(target) {
        this.enemyHealthBar = this.scene.add.graphics();
        this.enemyHealthBar.setScrollFactor(0);
        this.drawHealthBar(this.playerHealthBar, 10, 30, target.health / 100)
    }

    private drawHealthBar(grachics, x, y, percentage) {
        grachics.fillStyle(0x000000, 1);
        grachics.fillRect(x, y, 100, 10)

        grachics.fillStyle(0xff0000, 1);
        grachics.fillRect(x, y, 100 * percentage, 10)
    }

    setEnemies(enemies: Entity[]) {
        this.enemies = enemies;
    }

    private findTarget (enemies: Entity[]) {
        let target = null;
        let minDistance = Infinity;

        for (const enemy of enemies) {
            const distanceToEnemy = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);

            if (distanceToEnemy < minDistance) {
                minDistance = distanceToEnemy;
                target = enemy;
            }
        }
        return target;
    }

    private animateSword() {
        this.sword.setVisible(true);
        this.sword.setAlpha(1);
    
        if (this.currentDirection === 'down') {
            this.sword.setPosition(this.x, this.y + 16);
            this.sword.setRotation(Math.PI);
            this.sword.play('sword-down');
        } else if (this.currentDirection === 'up') {
            this.sword.setPosition(this.x, this.y - 16);
            this.sword.setRotation(0);
            this.sword.play('sword-up');
        } else if (this.currentDirection === 'left') {
            this.sword.setPosition(this.x - 16, this.y + 8);
            this.sword.setRotation(-Math.PI / 2);
            this.sword.play('sword-left');
        } else if (this.currentDirection === 'right') {
            this.sword.setPosition(this.x + 16, this.y + 8);
            this.sword.setRotation(Math.PI / 2);
            this.sword.play('sword-right');
        }
    
        console.log(`Sword position: (${this.sword.x}, ${this.sword.y}), Direction: ${this.currentDirection}`);
    
        this.sword.on('animationcomplete', (anim) => {
            console.log(`Animation completed: ${anim.key}`);
            this.sword.setVisible(false);  
        });
    }      

    setupKeysListeners() {
        this.scene.input.keyboard.on('keydown-SPACE', () => {
            const target = this.findTarget(this.enemies);
            console.log(target);
            this.drawEnemyHealthBar(target);
    
            this.setVelocity(0, 0);
            this.play('attack-' + this.currentDirection); 
    
            this.attack(target); 
    
            this.sword.setVisible(true);  
            this.animateSword();  
        });
    }
    
    
    attack (target: Entity) {
        const distanceToEnemy = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);

        if (distanceToEnemy < 50) {
            target.takeDamage(25);
        }

        this.sword.setVisible(true); 
        this.animateSword();
    }

    stopCycleTween() {
        this.scene.tweens.killTweensOf(this);
    }
 
    diactivate() {
        if (this.health > 0) return; 
        this.stopCycleTween();
        this.setPosition(this.initialPosition.x, this.initialPosition.y);
        this.setVisible(false); 
        this.isAlive = false;
        this.destroy(); 
    }

    update(delta: number) {
        const keys = this.scene.input.keyboard.createCursorKeys();
        this.drawPlayerHealthBar();
    
        if (this.health <= 0 && this.isAlive) {
            this.die();
            return;
        }
    
        if (!this.isAlive) {
            return; 
        }
    
        if (keys.up.isDown) {
            this.currentDirection = 'up';
            this.play('up', true);
            this.setVelocity(0, -delta * this.moveSpeed);
        } else if (keys.down.isDown) {
            this.currentDirection = 'down';
            this.play('down', true);
            this.setVelocity(0, delta * this.moveSpeed);
        } else if (keys.left.isDown) {
            this.currentDirection = 'left';
            this.play('left', true);
            this.setVelocity(-delta * this.moveSpeed, 0);
        } else if (keys.right.isDown) {
            this.currentDirection = 'right';
            this.play('right', true);
            this.setVelocity(delta * this.moveSpeed, 0);
        } else if (this.isAttacking) {
            this.setVelocity(0, 0);
        } else {
            this.setVelocity(0, 0);
            this.stop();
        }
    }        
     
    private die() {
        this.isAlive = false;
    
        this.setVisible(false);
        this.setActive(false);
        this.body.enable = false; 
    
        this.scene.add.text(
            this.scene.cameras.main.centerX - 150, 
            this.scene.cameras.main.centerY - 50,   
            'You Die',
            {
                fontSize: '64px',   
                color: '#ff0000',   
                fontStyle: 'bold', 
                align: 'center',    
                stroke: '#000000',   
                strokeThickness: 4  
            }
        ).setScrollFactor(0);

        const fadeRect = this.scene.add.graphics();
        fadeRect.fillStyle(0x000000, 1);
        fadeRect.fillRect(0, 0, 1920, 1080); 
    
        fadeRect.setAlpha(0);
    
        this.scene.tweens.add({
            targets: fadeRect,
            alpha: 1, 
            duration: 1500,
            onComplete: () => {
                this.scene.time.delayedCall(2000, () => {
                    this.scene.scene.restart();
                });
            }
        });

        this.scene.time.delayedCall(4000, () => {
            this.scene.scene.restart();
        });
    }     
}   