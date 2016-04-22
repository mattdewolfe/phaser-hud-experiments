import Character from './Character'

export default class Hero extends Character {

    protected _upKey: Phaser.Key;
    protected _downKey: Phaser.Key;
    protected _leftKey: Phaser.Key;
    protected _rightKey: Phaser.Key;
    constructor(data: any) {
        super(data);

        this._upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this._downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this._leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this._rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    }

    public update(): void {
        if (this._upKey.isDown) {
            this.y -= 2;
        }
        if (this._downKey.isDown) {
            this.y += 2;
        }
        if (this._leftKey.isDown) {
            this.x -= 2;
        }
        if (this._rightKey.isDown) {
            this.x += 2;
        }
    }
}