export interface INotification {
    getName(): string;
    getBody(): any;
    setBody(body: any): void;
}

export interface INotifier {
    sendNotification(notificationName: string, notificationBody?: any): any;
}

export interface IObserver {
    onRegister(): any;
    onRemoved(): any;
    destroy(): any;
    listNotificationInterests(): string[];
    handleNotification(notification: INotification): any;
}

export interface IGameConfig extends Phaser.IGameConfig {
    resolution?: number;
    analytics?: boolean;
    plugins?: string[];
}

export interface IAsset {
    url: string;
    type: string;
    extensions?: string;
    required?: boolean;
    id?: string;
    key?: string;
    resolution: number;
}

export interface ITiledmapAssets extends IAsset{
    assets: Array<IAsset>;
}

export interface IAssetList {
    autoload: boolean;
    required: boolean;
    assets: Array<IAsset>;
}

export interface ISound {
    isAudioSprite?: boolean;
    url?: string;
    key?: string;
    __isAudioSprite?: boolean;
    eventToDispatch?: Phaser.Signal;
    decoded?: boolean;
}

export interface IPathConfig {
    assetPath: string;
    dataPath: string;
    spritesheetPath: string;
    imgPath: string;
    fontPath: string;
    bitmapFontPath: string;
    audioSpritePath: string;
    physicsPath: string;
    soundPath: string;
}

export interface ITransition {
    inHandler?: ITransitionHandler;
    preloadHandler?: IPreloadHandler;
    outHandler: ITransitionHandler;
}

export interface ITransitionHandler {
    transitionInComplete: Phaser.Signal;
    transitionOutComplete: Phaser.Signal;
    transitionOut?: Function;
    transitionIn?: Function;
}

export interface IPreloadHandler extends ITransitionHandler {
    loadStart();
    loadProgress(progress?: number);
    loadComplete();
}

export interface IBrowser {
    firefox?: boolean;
    ie?: boolean;
    safari?: boolean;
    chrome?: boolean;
}
