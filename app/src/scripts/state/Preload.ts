import BaseState from "./BaseState";
import Constants from "../utils/Constants";
import PreloadMediator from "../mediator/PreloadMediator";

export default class Preload extends BaseState {
    // Phaser.State overrides
    public init() {
        this._mediator = new PreloadMediator(this);
    }

    public preload(): void {
        this.game.asset.loadAssets('required');
    }
		
    // dijon.core.State overrides
    public listBuildSequence() {
        return [
            this._addPreloader
        ]
    }

    public afterBuild() {
       // this.game.audio.playAudio('menu_loop', 0.3, true);
    }
		
    // private methods
    private _addPreloader() {
        const test = this.add.dText(50, 150, this.mediator.getCopy('preload', 'title'), 'Arial', 45, '#ffffff'),
            bmText = this.add.bitmapText(50, 300, Constants.FONT_KOMIKAX, 'Bitmap font', 60),
            button = this.add.button(this.game.width - 250, 20, 'menu', this._next, this, 'next_button/over', 'next_button/up', 'next_button/down');
    }

    private _next() {
        this.game.audio.playAudio('wyoming_roar');
        // test adding something to the "Stage" not the Game world
        this.mediator.next();
    }
		
    // public methods
		
    // getter / setter
    protected get mediator(): PreloadMediator {
        return <PreloadMediator>this._mediator;
    }
}
 