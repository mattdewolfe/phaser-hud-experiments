import {Group, Text} from 'dijon/display';
import {IPreloadHandler} from 'dijon/interfaces';

export default class Preloader extends Group implements IPreloadHandler {
    static TEST: number = 1;
    static TEST_2: number = 2;

    private _wiper: Phaser.Image;
    private _loadText: Text;

    public transitionInComplete: Phaser.Signal = new Phaser.Signal();
    public transitionOutComplete: Phaser.Signal = new Phaser.Signal();

    private _inTween: Phaser.Tween;
    private _outTween: Phaser.Tween;

    constructor(x: number, y: number, name: string) {
        super(x, y, name, true);
        this.init();
        this.buildInterface();
    }

    // Group overrides
    protected buildInterface() {
        this._loadText = this.addInternal.dText(50, 50, 'Loading ... ', 'Arial', 36, '#FFFFFF');

        let gfx = this.game.add.graphics();
        gfx.beginFill(0x000000, 1);
        gfx.drawRect(0, 0, this.game.width, this.game.height);
        gfx.endFill();

        this._wiper = this.addInternal.image(0, 0, gfx.generateTexture());

        this.game.world.remove(gfx, true);

        this.alpha = 0;
        this.visible = false;

        this._inTween = this.game.add.tween(this).to({ alpha: 1 }, 300, Phaser.Easing.Quadratic.Out);
        this._outTween = this.game.add.tween(this).to({ alpha: 0 }, 200, Phaser.Easing.Quadratic.In);

        this._inTween.onComplete.add(this._in, this);
        this._outTween.onComplete.add(this._out, this);
    }

    // iPreloadHandler implementations
    public loadStart() {
    }

    public loadProgress(progress: number) {
        const roundedProgress = Math.round(progress).toString();
        this._loadText.setText('Loading ... ' + roundedProgress + '%');
    }

    public loadComplete() {
    }

    public transitionIn() {
        this.visible = true;
        this._inTween.start();
    }

    public transitionOut() {
        this._outTween.start();
    }

    // private methods
    protected _in() {
        this.transitionInComplete.dispatch();
    }

    protected _out() {
        this.visible = false;
        this.transitionOutComplete.dispatch();
    }
}