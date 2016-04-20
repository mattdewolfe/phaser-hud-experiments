import {Application} from "dijon/application";
import {Game} from "dijon/core";
import {Device} from "dijon/utils";
import {CopyModel} from "dijon/mvc";

import ApplicationMediator from "./mediator/ApplicationMediator";
import Constants from "./utils/Constants";
import Notifications from "./utils/Notifications";
import Boot from "./state/Boot";
import Preload from "./state/Preload";
import Menu from "./state/Menu";
import GameModel from "./model/GameModel";

export default class HUDApplication extends Application {
    public gameId: string = null;

    constructor() {
        super();
    }

    // overrides
    public createGame() {
        this.game = new Game({
            width: this._getGameWidth(),
            height: this._getGameHeight(),
            parent: 'game-container',
            //renderer: Phaser.CANVAS,
            renderer: Device.cocoon ? Phaser.CANVAS : this._getRendererByDevice(),
            transparent: false,
            // use this if you want to switch between @2x and @1x graphics
            //resolution: this._getResolution(),
            resolution: 1,
            plugins: Device.mobile ? [] : ['Debug']

        });

        this._mediator = new ApplicationMediator(this);
        this._addStates();
    }
    // public methods
    public startGame(): void {
        this.game.state.start(Constants.STATE_BOOT);
    }

    public bootComplete(): void {
        this.game.transition.to(Constants.STATE_PRELOAD);
    }

    public adjustScaleSettings(): void {
        if (Device.cocoon) {
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
        } else {
            if (this.game.device.desktop) {
                this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.game.scale.setMinMax(512, 384, 1024, 768);
                this.game.scale.pageAlignHorizontally = true;
            } else {
                this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
            }
            this.game.scale.forceLandscape = true;
            this.game.scale.refresh();
        }
    }

    public adjustRendererSettings(): void {
        this.game.stage.disableVisibilityChange = true;
        this.game.forceSingleUpdate = true;
        //this.game.camera.roundPx = false;
        //this.game.renderer.renderSession.roundPixels = false;
        //this.game.antialias = true;
        //this.game.renderer.clearBeforeRender = this.game.renderType === Phaser.CANVAS;
    }

    // called from the boot state as we can't initialize plugins until the game is booted
    public registerModels(): void {
        const gameModel = new GameModel('game_data');
        const copyModel = new CopyModel('copy');
    }

    // private methods
    // adds states
    private _addStates() {
        this.game.state.add(Constants.STATE_BOOT, Boot);
        this.game.state.add(Constants.STATE_PRELOAD, Preload);
        this.game.state.add(Constants.STATE_MENU, Menu);
    }

    private _getGameWidth(): number {
        return Device.cocoon ? window.innerWidth : 1024;
    }

    private _getGameHeight(): number {
        return Device.cocoon ? window.innerHeight : 768;
    }

    private _getResolution(): number {
        if (Application.queryVar('resolution') && !isNaN(Application.queryVar('resolution'))) {
            return Application.queryVar('resolution');
        }
        if (Device.cocoon) {
            return (window.devicePixelRatio > 1 ? 2 : 1);
        } else {
            return Device.mobile ? 1 : (window.devicePixelRatio > 1 ? 2 : 1);
        }
    }

    private _getRendererByDevice(): number {
        return Device.mobile && window.devicePixelRatio < 2 ? Phaser.CANVAS : Phaser.AUTO;
    }
    
    // getter / setter
    public get mediator(): ApplicationMediator {
        return <ApplicationMediator>this._mediator;
    }

    public get gameModel(): GameModel {
        return <GameModel>this.retrieveModel(GameModel.MODEL_NAME);
    }

    public get copyModel(): CopyModel {
        return <CopyModel>this.retrieveModel(CopyModel.MODEL_NAME);
    }
}