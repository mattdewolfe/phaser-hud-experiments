import {INotification} from 'dijon/interfaces';
import Constants from "../utils/Constants";
import BaseMediator from './BaseMediator';
import Notifications from '../utils/Notifications';

export default class MenuMediator extends BaseMediator {
    public static MEDIATOR_NAME: string = 'menuMediator';
		
    // getter / setter
    public get name(): string {
        return MenuMediator.MEDIATOR_NAME;
    }

    public get hudData(): any {
        return this.gameModel.gameData.hud;
    }

    public get statData(): any {
        return this.gameModel.gameData.main.stats;
    }

    public get worldData(): any {
        return this.gameModel.gameData.main.world;
    }
}