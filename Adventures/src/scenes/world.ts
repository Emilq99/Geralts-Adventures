import worldJSON from '../assets/world.json';
import { SIZES, SPRITES, TILES, LAYERS } from '../utils/constants';
import { Player } from '../entities/player';
import { Enemy } from '../entities/enemy';

export class World extends Phaser.Scene {
    private player?: Player;
    private boar: Enemy;
    boarSecond: Enemy;
    boarMatvienko: Enemy;
    boarGosha: Enemy;
    boarYarik: Enemy;
    boarDaddy: Enemy;
    constructor() {
        super('WorldScene');
    }

    preload () {
        this.load.image(TILES.WORLD, 'src/assets/durotar.png')
        this.load.tilemapTiledJSON('map', 'src/assets/world.json')
        this.load.spritesheet(SPRITES.PLAYER.base, 'src/assets/characters/alliance.png', {
            frameWidth: SIZES.PLAYER.WIDTH,
            frameHeight: SIZES.PLAYER.HEIGHT
        })

        this.load.spritesheet(SPRITES.PLAYER.fight, 'src/assets/characters/alliance-fight-small.png', {
            frameWidth: SIZES.PLAYER.WIDTH,
            frameHeight: SIZES.PLAYER.HEIGHT
        })
        
        this.load.spritesheet(SPRITES.BOAR.base, 'src/assets/characters/boar.png', {
            frameWidth: SIZES.PLAYER.WIDTH,
            frameHeight: SIZES.PLAYER.HEIGHT
        })
    }

    create () {
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage(worldJSON.tilesets[0].name, TILES.WORLD, SIZES.TILE, SIZES.TILE);
        const groundlayer = map.createLayer(LAYERS.GROUND, tileset, 0, 0);
        const wallslayer = map.createLayer(LAYERS.WALLS, tileset, 0, 0);

        this.player = new Player(this, 400, 400, SPRITES.PLAYER);
        this.player.setCollideWorldBounds(true);
        this.player.setEnemies([this.boar, this.boarSecond]);

        this.boar = new Enemy(this, 600, 250, SPRITES.BOAR.base);
        this.boar.setPlayer(this.player);

        this.boarMatvienko = new Enemy(this, 500, 200, SPRITES.BOAR.base);
        this.boarMatvienko.setPlayer(this.player);

        this.boarGosha = new Enemy(this, 500, 500, SPRITES.BOAR.base);
        this.boarGosha.setPlayer(this.player);

        this.boarYarik = new Enemy(this, 1200, 800, SPRITES.BOAR.base);
        this.boarYarik.setPlayer(this.player);

        this.boarDaddy = new Enemy(this, 1500, 600, SPRITES.BOAR.base);
        this.boarDaddy.setPlayer(this.player);

        this.boarSecond = new Enemy(this, 800, 400, SPRITES.BOAR.base);
        this.boarSecond.setPlayer(this.player);
        
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.add.collider(this.player, wallslayer);
        wallslayer.setCollisionByExclusion([-1]);
    }

    update(_: number, delta: number): void {
        this.player.update(delta);
        this.boar.update();
        this.boarDaddy.update();
        this.boarGosha.update();
        this.boarMatvienko.update();
        this.boarSecond.update();
        this.boarYarik.update();
    }
} 