import BaseState from "./BaseState";
import MenuMediator from '../mediator/MenuMediator';
import HUD from '../hud/HUD';

export default class Menu extends BaseState {
    public hud: HUD;
    // Phaser.State overrides
    public init(): void {
        this._mediator = new MenuMediator();
        this.input.onDown.add(this._updateStats, this);
    }

    public preload(): void {
    }
		
    // dijon.core.State overrides
    public listBuildSequence() {
        return [
            this._addText,
            this._addHUD
        ]
    }

    public afterBuild(): void {
        super.afterBuild()
    }
		
    // private methods
    private _addText(): void {
        let text = this.add.dText(50, 50, 'HUD Test', 'Arial', 36, '#ffffff');
    }

    private _addHUD(): void {
        this.hud = new HUD(this.mediator.hudData);
        this.hud.init();
        this.game.addToUI.existing(this.hud);
    }

    private _updateStats(): void {
        this.hud.update()    
    }
    
    public get mediator(): MenuMediator {
        return <MenuMediator>this._mediator;
    }
}
  