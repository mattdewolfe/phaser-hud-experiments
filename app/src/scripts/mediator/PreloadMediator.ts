import {INotification} from 'dijon/interfaces';
import Constants from "../utils/Constants";
import BaseMediator from './BaseMediator';
import Notifications from '../utils/Notifications';

export default class PreloadMediator extends BaseMediator {
    public static MEDIATOR_NAME: string = 'preloadMediator';
		
    // public methods
    // called from Preload state

    public next(): void{
        this.game.transition.to(Constants.STATE_MENU);
    }
		
    // getter / setter
    public get name() {
        return PreloadMediator.MEDIATOR_NAME;
    }
}