import worldJSON from '../assets/world.json';
import { SIZES, SPRITES, TILES, LAYERS } from '../utils/constants';
import { Player } from '../entities/player';

export class World extends Phaser.Scene {
    private player?: Player;
    constructor() {
        super('WorldScene');
    }

    preload () {
        this.load.image(TILES.WORLD, 'src/assets/durotar.png')
        this.load.tilemapTiledJSON('map', 'src/assets/world.json')
        this.load.spritesheet(SPRITES.PLAYER, 'src/assets/characters/alliance.png', {
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
        
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.add.collider(this.player, wallslayer);
        wallslayer.setCollisionByExclusion([-1]);
    }

    update(_: number, delta: number): void {
        this.player.update(delta);
    }
} 