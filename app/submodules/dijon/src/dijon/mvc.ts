import {INotification,IObserver} from './interfaces';
import {Application} from './application';
import {Game} from './core';
/**
 * Model
 */

export class Model {
    public app: Application;
    public game: Game;
    protected _data: any;

    public static MODEL_NAME: string = 'Model';

    constructor(dataKey: string = null, private modelName: string = null) {
        this.app = Application.getInstance();
        this.game = this.app.game;

        if (dataKey) {
            this.setData(dataKey);
        }

        this.app.registerModel(this);
    }
    
    public onRegister():void{
        
    }
    
    public onRemoved():void{
        
    }

    protected getKeyExists(key: string): boolean {
        return this.game.cache.getJSON(key) !== null;
    }

    public setData(dataKey: string): any {
        if (!this.getKeyExists(dataKey)) {
            console.log('Model:: cannot set data from key ' + dataKey + '. Is it in the Phaser cache?');
            return false;
        }

        this._data = this.game.cache.getJSON(dataKey);
        return this._data;
    }

    public getData(): any {
        return this._data;
    }

    public destroy(): void {
        this.app.removeModel(this);
    }

    public get name(): string {
        return this.modelName || Model.MODEL_NAME;
    }
}

export class CopyModel extends Model {
    public static MODEL_NAME: string = 'copyModel';

    private _languages: { [languageName: string]: any } = {};

    constructor(dataKey: string = null) {
        super(dataKey);

        this._languages['en'] = this._data;
    }

    public getCopy(groupId: string, itemId: string): string {
        return this.getCopyGroup(groupId)[itemId];
    }

    public getCopyGroup(groupId: string): any {
        return this._data[groupId];
    }

    public addLanguage(languageId: string, dataKey: string): any {
        if (!this.getKeyExists(dataKey)) {
            throw new Error('cannot add an alternate language from key ' + dataKey + '. Is it in the Phaser cache?');
        }

        this._languages[languageId] = this.game.cache.getJSON(dataKey);
    }

    public changeLanguage(languageId: string): void {
        if (typeof this._languages[languageId] === 'undefined')
            throw new Error('there is no language ' + languageId);

        this._data = this._languages[languageId];
    }

    public get name(): string {
        return CopyModel.MODEL_NAME;
    }
}

/**
 * Mediator
 */

export class Mediator implements IObserver {
    public static MEDIATOR_NAME: string = 'Mediator';

    protected mediatorName: string = null;
    protected app: Application;
    protected game: Game;

    constructor(protected _viewComponent: any = null, autoReg: boolean = true, mediatorName: string = null) {
        this.app = Application.getInstance();
        this.game = this.app.game;
        this.mediatorName = mediatorName;

        if (autoReg) {
            this.register();
        }
    }

    // private methods
    protected register(): void {
        this.app.registerMediator(this);
    }

    protected remove(): void {
        this.app.removeMediator(this);
    }

    public onRegister(): void {
        // override me freely
    }

    public onRemoved(): void {

    }

    public destroy(): void {
        this.remove();
    }

    public listNotificationInterests(): string[] {
        return [];
    }

    public handleNotification(notification: INotification) {
        /**
         * default immplementation would look something like:
         * switch( notification: dijon.INotification ){
         * 		case Notifications.SOMETHING:
         * 			// do something
         * 			break;
         * 		case Notifications.SOMETHING_ELSE:
         * 			// do something else
         * 			break;
         * }
         */
    }

    public sendNotification(notificationName: string, notificationBody?: any) {
        this.app.sendNotification(notificationName, notificationBody);
    }

    // getter / setter
    public set viewComponent(viewComponent: any) {
        this._viewComponent = viewComponent;
    }

    public get viewComponent(): any {
        return this._viewComponent;
    }

    public get name(): string {
        return this.mediatorName || Mediator.MEDIATOR_NAME;
    }
}

/**
 * Notification
 */

export class Notification implements INotification {
    constructor(private _name: string, private _body: any = null) { }

    public getName(): string {
        return this._name;
    }

    public setBody(body: any): void {
        this._body = body;
    }

    public getBody(): any {
        return this._body;
    }

    public destroy() {
        this._body = null;
        this._name = null;
    }
}

