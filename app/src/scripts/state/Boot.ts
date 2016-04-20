import BaseState from "./BaseState";
import BootMediator from "../mediator/BootMediator";

export default class Boot extends BaseState {
    // Phaser.State overrides
    public init(): void {
        this._mediator = new BootMediator(this);
    }

    public preload(): void {
        if (window['version'] !== undefined) {
            this.game.asset.cacheBustVersion = '@@version';
        }
        this.game.asset.loadJSON('game_data');
        this.game.asset.loadJSON('assets');
        this.game.asset.loadJSON('copy');
        this.game.asset.loadBitmapFont('komikax');
    }

    // dijon.core.State overrides
    public buildInterface(): void {
        this.mediator.bootComplete();
    }

    // private methods

    // getter / setter
    protected get mediator(): BootMediator {
        return <BootMediator>this._mediator;
    }
}