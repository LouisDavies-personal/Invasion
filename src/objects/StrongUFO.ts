import { GameScene } from "../scenes/Game";

export class StrongUFO extends Phaser.Physics.Arcade.Sprite {

    private _landY: number;

    // Hit points for the UFO represents the amount of times it can be hit
    private hitPoints: integer;

    constructor (scene, x, y) {
        super(scene, x, y, 'strong_ufo');
        this._landY = GameScene.height * 0.795;

        this.on('animationcomplete', () => {
            this.setActive(false);
            this.setVisible(false);
            this.body.enable = false;
            this.hitPoints = 2;
        });

        setTimeout(() => {
            this.postConstructor();
        }, 1);
    }

    private postConstructor() {
        this.body.enable = false;
    }

    public startLanding(x, y, speed) {
        this.hitPoints = 2;
        this.setFrame(0);
        this.body.enable = true;
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);

        this.setVelocityY(speed);
    }

    public preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.y >= this._landY) {

            this.scene.sound.stopAll();
            GameScene.GameRunning = false;

            console.log("INVASION BEGINS! GAME OVER");
            this.scene.sound.play('sfx/game_over', { volume: 2, loop: false });

            this.setActive(false);
            this.setVelocityY(0);
            this.body.enable = false;
        }
    }

    /**
     * To be called when a missile makes contact with a the UFO
     * Takes one hit point from the UFO and kills it if hit points
     * are reduced to 0 or below
     *
     * returns true if the ufo is killed or false if it survives
     */
    public damageAndCheckIfWillKill() {
        this.hitPoints -= 1;
        if (this.hitPoints <= 0) {
            this.kill();
            return true;
        }
        return false;
    }

    public kill() {
        this.setVelocityY(0);

        this.scene.sound.play(`sfx/explode_${Math.floor(Math.random() * 5)}`, { volume: 2 });
        this.play("strong_ufo_killed");
    }
}