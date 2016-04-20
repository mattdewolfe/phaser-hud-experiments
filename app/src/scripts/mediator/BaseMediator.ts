import {Mediator, CopyModel} from "dijon/mvc";
import {Application} from "dijon/application";

import GameModel from "../model/GameModel";

export default class BaseMediator extends Mediator {
    // public methods
    // so any mediator extending BaseMediator can get copy
    public getCopy(groupId: string, textId: string): string {
        return this.copyModel.getCopy(groupId, textId);
    }
		
    // getter / setter
    // offer access to the GameModel and CopyModel from any mediator extending BaseMediator
    public get gameModel(): GameModel {
        return <GameModel>Application.getInstance().retrieveModel(GameModel.MODEL_NAME);
    }

    public get copyModel(): CopyModel {
        return <CopyModel>Application.getInstance().retrieveModel(CopyModel.MODEL_NAME);
    }

    public get name(): string { 
        return "baseMediator_" + this.game.rnd.uuid();
    }
}