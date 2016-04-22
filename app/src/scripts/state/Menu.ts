import BaseState from "./BaseState";
import MenuMediator from '../mediator/MenuMediator';
import HUD from '../hud/HUD';
import {StatManager} from '../stats/StatManager';
import {BaseObject, ICharacterData} from '../objects/BaseObject';
import Character from '../objects/Character';
import Hero from '../objects/Hero';

export default class Menu extends BaseState {
    public hud: HUD;
    public statManager: StatManager;
    
    // Phaser.State overrides
    public init(): void {
        this._mediator = new MenuMediator();
    }

    public preload(): void {
    }
		
    // dijon.core.State overrides
    public listBuildSequence() {
        return [
            this._createSystems,
            this._createWorld,
            this._addText
        ]
    }

    public afterBuild(): void {
        super.afterBuild()
    }

    public _createSystems(): void {
        this.statManager = new StatManager(this.mediator.statData);
        this.hud = new HUD(this.mediator.hudData);
        this.statManager.setHUD(this.hud);
        this.hud.init();
        this.game.addToUI.existing(this.hud);
        this.input.onDown.add(this.statManager.logAllStats, this.statManager);
    }

    public _createWorld(): void {
        let worldData = this.mediator.worldData;
        // Hard set level to load.
        for (let i = 0; i < worldData.level1.length; i++) {
            let newData: ICharacterData = <ICharacterData>{};
            let baseData: any = worldData.objects[worldData.level1[i].type];
            newData.stats = baseData.stats;
            newData.key = baseData.key;
            newData.name = worldData.level1[i].type;
            newData.x = worldData.level1[i].x;
            newData.y = worldData.level1[i].y;

            let newCharacter = this._spawnObject(newData);
            this.game.addToGame.existing(newCharacter);
        }
    }
    
    // private methods
    private _addText(): void {
        let text = this.add.dText(200, 200, 'HUD Test', 'Arial', 36, '#ffffff');
    }

    private _updateStats(): void {
        
    }

    private _spawnObject(data: any): BaseObject {
        let newObj = data.name === "hero" ? new Hero(data) : new Character(data);
        console.log("Spawning a " + data.name);
        newObj.addAllStats(this.statManager.getStatsForCharacter(data.stats, newObj.name));
        return newObj;
    }
    
    public get mediator(): MenuMediator {
        return <MenuMediator>this._mediator;
    }
}
  