import {Model} from 'dijon/mvc';

export default class GameModel extends Model {
    public static MODEL_NAME: string = "gameModel";

    public get name(): string {
        return GameModel.MODEL_NAME;
    }

    public get gameData(): any {
        return this._data;
    }    
}