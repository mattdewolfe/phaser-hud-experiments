import {Application} from './application';
import {INotifier, IAssetList, IPathConfig, ISound, IAsset, ITiledmapAssets, IGameConfig, ITransition, ITransitionHandler, IPreloadHandler} from './interfaces';
import {Mediator} from './mvc';
import {Notifications} from './utils';
import {Sprite, Group, Text, Component} from './display';

export class AnalyticsManager {
    constructor(public enabled: boolean = true, public category: string = null) { }

    public trackEvent(action: string = null, label: string = null, value: string = null) {
        if (!this.active || !this.enabled) {
            return;
        }

        if (!action) {
            throw new AnalyticsException('No action defined');
        }

        if (value) {
            this.ga('send', 'event', this.category, action, label, value);
        }
        else if (label) {
            this.ga('send', 'event', this.category, action, label);
        }
        else {
            this.ga('send', 'event', this.category, action);
        }
    }

    trackOmnitureEvent(gameName: string, activity: string, isGameEvent: boolean) {
        if (!this.enabled) {
            return;
        }
        //console.log('tracking omniture', gameName, activity, isGameEvent);
        if (typeof window['trackFlashEvent'] === 'undefined')
            return false;
        window['trackFlashEvent'](gameName, activity, isGameEvent);
    }

    // getter / setter
    get active(): boolean {
        return (window['ga']) ? true : false;
    }

    get ga(): Function {
        return window['ga'];
    }
}

export class AnalyticsException {
    public name: string = 'AnalyticsException';
    constructor(public message: string) { }
}


/**
 * Wraps Phaser.Loader
*/
export class AssetManager implements INotifier {
    protected app: Application;

    // private variables
    private _data = {};
    private _baseURL: string = '';
    private _pathObj: IPathConfig | any = {};
    private _assetPath: string = null;
    private _dataPath: string = null;
    private _spriteSheetPath: string = null;
    private _imgPath: string = null;
    private _fontPath: string = null;
    private _bitmapFontPath: string = null;
    private _physicsPath: string = null;
    private _audioSpritePath: string = null;
    private _soundPath: string = null;
    private _soundDecodingModifier: number = 2;
    private _res: number = 1;
    private _resolution: string = null;

    private _loadData = {};
    private _autoLoadData = {};
    private _completedLoads = {};
    private _requiredData = {};

    private _currentAssetList: string = null;
    private _hasFiles: boolean = false;
    private _soundsToDecode: Array<ISound> = [];
    private _isLoadingQueue: boolean = false;
    private _fileCompleteProgress: number = 0;
    private _maxPercent: number = 100;

    private _numSounds: number = 0;
    private _soundsDecoded: number = 0;

    private _cacheBustVersion: string = '';

    // public variables
    public game: Game;

    public onLoadStart = new Phaser.Signal();
    public onFileStart = new Phaser.Signal();
    public onFileComplete = new Phaser.Signal();
    public onLoadComplete = new Phaser.Signal();
    public onLoadCompleteAndAudioDecoded = new Phaser.Signal();

    public onBackgroundLoadStart = new Phaser.Signal();
    public onBackgroundFileStart = new Phaser.Signal();
    public onBackgroundFileComplete = new Phaser.Signal();
    public onBackgroundLoadComplete = new Phaser.Signal();
    public onBackgroundLoadCompleteAndAudioDecoded = new Phaser.Signal();

    // static constants
    // asset types
    public static AUDIO: string = 'audio';
    public static SOUND: string = 'sound';
    public static AUDIO_SPRITE: string = 'audioSprite';
    public static IMAGE: string = 'image';
    public static ATLAS: string = 'atlas';
    public static TEXT: string = 'text';
    public static JSON: string = 'json';
    public static TILEMAP: string = 'tilemap';
    public static TILEDMAP: string = 'tiledmap';
    public static TILEDMAP_TILESET: string = 'tileset';
    public static TILEDMAP_LAYER: string = 'layer';
    public static PHYSICS: string = 'physics';
    public static ASSET_LIST: string = 'assetList';

    // resolutions
    public static RESOLUTION_2X: string = "@2x";
    public static RESOLUTION_3X: string = "@3x";

    constructor() {
        this._init();
    }
    // private methods
    /**
    * adds internal variables and signals
    * @return {void}
    * @private
    */
    private _init() {
        this.app = Application.getInstance();
        this.game = this.app.game;
        this.baseURL = '';
        this.paths = null;
        this.resolution = this.game.resolution;
    }

    /**
    * parses an asset list by key (usually from data/assets.json) and stores them internally
    * @param  {String} key the id of the list
    * @param  {Array}  list the json array of assets
    * @return {void}
    * @private
    */
    private _parseAssetList(key: string, list: IAssetList) {
        this._autoLoadData[key] = list.autoload;
        this._requiredData[key] = list.required;

        this._loadData[key] = [];

        list.assets.forEach(asset => {
            this._loadData[key].push(asset);
        });
    }

    /**
    * adds assets from a list to the load list
    * @param  {String} id id of the list to add
    * @return {void}
    * @private
    */
    private _loadAssets(id: string) {
        var assets = this._loadData[id],
            i;

        for (i = 0; i < assets.length; i++) {
            this._loadAsset(assets[i]);
        }
    }

    /**
    * start the background loading
    * @return {void}
    * @private
    */
    private _backgroundLoadStart() {
        this.onBackgroundLoadStart.dispatch();
    }

    /**
    * when a file completes in an background load queue - dispatches the onBackgroundFileComplete signal
    * @param  {Number} progress   the percent progress
    * @param  {String} id         the file id
    * @param  {int}    fileIndex  the index of the file in the list
    * @param  {int}    totalFiles the total number of files in the list
    * @return {void}
    * @private
    */
    private _backgroundFileComplete(progress: number, id: string, fileIndex: number, totalFiles: number) {
        if (this.game.cache.checkKey(Phaser.Cache.IMAGE, id)) {
            this._setBaseTextureResolution(this.game.cache.getPixiBaseTexture(id));
        }
        this._fileCompleteProgress = progress;
        this.onBackgroundFileComplete.dispatch(progress, id, fileIndex, totalFiles);
    }

    /**
    * when the background load completes - dispatches the onBackgroundLoadComplete signal, starts checking for decoded sounds
    * @return {void}
    * @private
    */
    private _backgroundLoadComplete() {
        this.game.load.onFileComplete.remove(this._backgroundFileComplete, this);

        this.onBackgroundLoadComplete.dispatch();
        this._checkSoundDecoding(this.onBackgroundLoadCompleteAndAudioDecoded);
    }

    /**
    * when the asset list starts loading, dispatches the onLoadStart signal
    * @return {void}
    */
    private _gameLoadStart() {
        this.onLoadStart.dispatch();
    }

    /**
    * when a file starts loading - dispatches the onFileStart signal
    * @return {void}
    */
    private _gameFileStart() {
        this.onFileStart.dispatch();
    }

    /**
    * when a file completes in the game load - dispatches the onFileComplete signal
    * @param  {Number} progress   the percent progress
    * @param  {String} id         the file id
    * @param  {int}    fileIndex  the index of the file in the list
    * @param  {int}    totalFiles the total number of files in the list
    * @return {void}
    * @private
    */
    private _gameFileComplete(progress: number, id?: string, fileIndex?: number, totalFiles?: number) {
        if (this.game.cache.checkKey(Phaser.Cache.IMAGE, id)) {
            this._setBaseTextureResolution(this.game.cache.getPixiBaseTexture(id));
        }
        this._fileCompleteProgress = progress;
        this.onFileComplete.dispatch(this.getLoadProgress(), id, fileIndex, totalFiles);
    }

    private _setBaseTextureResolution(texture: PIXI.BaseTexture): void {
        if (texture && texture.source.src.indexOf('@' + this.resolution + 'x') >= 0) {
            texture.resolution = this.resolution;
        }
    };

    /**
    * when the background load completes - dispatches the onLoadComplete signal, starts checking for decoded sounds
    * @return {void}
    * @private
    */
    private _gameLoadComplete() {
        this._completedLoads[this._currentAssetList] = true;
        this.onLoadComplete.dispatch();
        this.game.load.onFileStart.remove(this._gameFileStart, this);
        this.game.load.onFileComplete.remove(this._gameFileComplete, this);

        this._checkSoundDecoding(this.onLoadCompleteAndAudioDecoded);
    }

    /**
    * checks if all the sounds in the queue are decoded
    * @param  {Phaser.Signal} eventToDispatch the signal to be dispatched when all sounds are decoded
    * @return {void}
    * @private
    */
    private _checkSoundDecoding(eventToDispatch: Phaser.Signal) {
        var sound, i, isAudioSprite;

        if (this._soundsToDecode && this._soundsToDecode.length > 0) {
            for (i = 0; i < this._soundsToDecode.length; i++) {
                isAudioSprite = this._soundsToDecode[i].isAudioSprite;
                sound = this.game.add.sound(this._soundsToDecode[i].url);
                sound.__isAudioSprite = isAudioSprite;
                sound.eventToDispatch = eventToDispatch;
                sound.onDecoded.addOnce(this._onSoundDecoded, this);
            }
        } else {
            eventToDispatch.dispatch();
        }
    }

    /**
    * when a sound is decoded, this method removes it from the _soundsToDecode array, and increases the overall percentage loaded
    * @param  {Phaser.Sound} sound the sound being decoded
    * @return {void}
    * @private
    */
    private _onSoundDecoded(sound: ISound) {
        var soundIndex = this._soundsToDecode.indexOf(sound.key);
        this._soundsToDecode.splice(soundIndex, 1);

        if (typeof this.game.audio !== 'undefined' && typeof this.game.audio.addAudio !== 'undefined') {
            if (sound.__isAudioSprite)
                this.game.add.audioSprite(sound.key);

            this.game.audio.addAudio(sound.key, sound.__isAudioSprite);
        }

        this._soundsDecoded++;
        this._maxPercent = (100 - (this._numSounds * this.soundDecodingModifier) + (this._soundsDecoded * this.soundDecodingModifier));
        this._gameFileComplete(100);

        if (this._soundsToDecode.length === 0) {
            sound.eventToDispatch.dispatch();
        }
    }

    /**
    * shortcut to get an asset key using a file name (strips its extension)
    * @param  {String} fileName the url of the file
    * @return {Stirng}          the asset key (the filename with its extension stripped)
    * @private
    */
    private _getAssetKey(fileName: string): string {
        if (fileName.indexOf('.') < 0)
            return fileName;
        var ext = fileName.split('.');
        ext.pop();

        return ext.join('');
    }

    /**
    * gets the extension of a given file
    * @param  {String} fileName
    * @return {String}          the extension
    * @private
    */
    private _getExtension(fileName: string): string {
        return fileName.split('.').pop();
    }

    /**
    * gets the extension of a given file
    * @param  {String} fileName
    * @return {String}          the extension
    * @private
    */
    private _getResolution(res: any): string {
        var result = '';

        if (typeof res === 'string') {
            res = parseFloat(res);
        }

        if (res === undefined) {
            res = this.resolution;
        }

        if (res > 1.5) {
            result = AssetManager.RESOLUTION_2X;
        }

        return result;
    }

    /**
    * determines what kind of asset we're dealing with and adds it to the load queue
    * @param  {Object} asset the asset object we're going to load
    * @return {void}
    * @private
    */
    private _loadAsset(asset: IAsset) {
        var type = asset.type,
            url = asset.url || asset.key;

        switch (type) {
            case AssetManager.ASSET_LIST:
                this._loadAssets(asset.id);
                break;
            case AssetManager.SOUND:
                this.loadSound(url, asset.extensions);
                break;
            case AssetManager.AUDIO_SPRITE:
                this.loadAudioSprite(url, asset.extensions);
                break;
            case AssetManager.IMAGE:
                this.loadImage(url, this._getResolution(asset.resolution));
                break;
            case AssetManager.ATLAS:
                this.loadAtlas(url, this._getResolution(asset.resolution));
                break;
            case AssetManager.TEXT:
                this.loadText(url);
                break;
            case AssetManager.JSON:
                this.loadJSON(url);
                break;
            case AssetManager.TILEMAP:
                this.loadTilemap(url);
                break;
            case AssetManager.TILEDMAP:
                this.loadTiledmap(url, (<ITiledmapAssets>asset).assets);
                break;
            case AssetManager.PHYSICS:
                this.loadPhysics(url);
                break;
        }
    }

    /**
    * parses the data from the external assets file (normally data/assets.json)
    * @return {void}
    * @private
    */
    private _parseData() {
        var key;

        for (key in this._data) {
            this._parseAssetList(key, this._data[key]);
        }
    }

    private _getCacheBustedUrl(url: string): string {
        if (this._cacheBustVersion === undefined || this._cacheBustVersion === '') {
            return url;
        }

        return url + '?v=' + this._cacheBustVersion;
    }
    // public methods
    public loadText(url: string) {
        var key = this._getAssetKey(url);
        return this.game.load.text(key, this._getCacheBustedUrl(this._dataPath + '/' + url));
    }

    public loadJSON(key: string) {
        key = this._getAssetKey(key);
        return this.game.load.json(key, this._getCacheBustedUrl(this._dataPath + '/' + key + '.json'));
    }

    public loadTilemap(key: string) {
        key = this._getAssetKey(key);
        return this.game.load.tilemap(key, this._getCacheBustedUrl(this._dataPath + '/tilemap/' + key + '.json'), null, Phaser.Tilemap.TILED_JSON);
    }

    public loadTiledmap(key: string, assets: IAsset[]) {
        if (Phaser.Plugin['Tiled'] === undefined) {
            console.log('tiledmap requires the phaser-tiled plugin from https://github.com/englercj/phaser-tiled');
            return null;
        }
        const cacheKey: any = Phaser.Plugin['Tiled'].utils.cacheKey;

        this.game.load['tiledmap'](cacheKey(key, 'tiledmap'), this._getCacheBustedUrl(this._dataPath + '/tilemap/' + key + '.json'), null, Phaser.Tilemap.TILED_JSON);

        assets.forEach(asset => {
            switch (asset.type) {
                case AssetManager.TILEDMAP_TILESET:
                case AssetManager.TILEDMAP_LAYER:
                    this.loadTiledmapImage(key, asset.type, asset);
                    break;
            }

        });
    }

    public loadTiledmapImage(key: string, tilesetImageType: string, asset: IAsset) {
        const cacheKey: any = Phaser.Plugin['Tiled'].utils.cacheKey;

        let resolution: string = '';
        const newKey: string = this._getAssetKey(asset.url);
        const cKey: string = cacheKey(key, 'tileset', newKey);

        if (typeof asset.resolution !== 'string') {
            resolution = this._getResolution(asset.resolution);
        }
        const url = this._getAssetKey(newKey + resolution + '.' + this._getExtension(asset.url));
        console.log(asset.url, cKey);
        this.game.load.image(cKey, this._getCacheBustedUrl(this._spriteSheetPath + '/' + url + '.png'));
    }

    public loadPhysics(key: string) {
        key = this._getAssetKey(key);
        return this.game.load.physics(key, this._getCacheBustedUrl(this._physicsPath + '/' + key + '.json'));
    }

    public loadAtlas(url: string, resolution?: any): Phaser.Loader | string {
        if (typeof resolution !== 'string') {
            resolution = this._getResolution(resolution);
        }
        if (this.game.cache.checkImageKey(url)) {
            return url;
        }
        return this.game.load.atlasJSONHash(url, this._getCacheBustedUrl(this._spriteSheetPath + '/' + url + resolution + '.png'), this._getCacheBustedUrl(this._spriteSheetPath + '/' + url + resolution + '.json'));
    }

    public loadImage(url: string, resolution?: any): Phaser.Loader | string {
        if (typeof resolution !== 'string') {
            resolution = this._getResolution(resolution);
        }
        const key: string = this._getAssetKey(url);

        if (this.game.cache.checkImageKey(key)) {
            // if the image key already exists, don't reload the image and return the key
            return key;
        }
        url = key + resolution + '.' + this._getExtension(url);
        return this.game.load.image(key, this._getCacheBustedUrl(this._imgPath + '/' + url));
    }

    public loadBitmapFont(url: string, resolution?: any) {
        if (typeof resolution !== 'string') {
            resolution = this._getResolution(resolution);
        }
        this.game.load.bitmapFont(url, this._getCacheBustedUrl(this._bitmapFontPath + '/' + url + resolution + '.png'), this._getCacheBustedUrl(this._bitmapFontPath + '/' + url + resolution + '.json'));
    }


    public loadAudio(url: string, exts: any, isAudioSprite: boolean) {
        var type, path;
        if (this.game.cache.checkSoundKey(url) && this.game.cache.getSound(url).isDecoded) {
            return;
        }
        // type should be 'sound' or 'sprite' ('fx' and 'music' to be deprecated)
        // default to sound

        if (typeof type === 'undefined') {
            type = 'sound';
        }

        if (exts.indexOf(',') >= 0) {
            exts = exts.split(',');
        }

        if (this.game.device.iOS && exts.indexOf('m4a') === -1) {
            exts.unshift('m4a');
        }

        if (typeof exts === 'object') {
            path = [];
            for (var i = 0; i < exts.length; i++) {
                path.push(this._getCacheBustedUrl((isAudioSprite ? this._audioSpritePath : this._soundPath) + '/' + url + '.' + exts[i]));
            }
        } else {
            path = this._getCacheBustedUrl((isAudioSprite ? this._audioSpritePath : this._soundPath) + '/' + type + '/' + url + '.' + exts);
        }

        if (isAudioSprite) {
            this.game.load.audiosprite(url, path, this._audioSpritePath + '/' + url + '.json');
        } else {
            this.game.load.audio(url, path);
        }

        this._soundsToDecode.push({
            url: url,
            isAudioSprite: isAudioSprite
        });
    }

    public loadSound(url: string, exts: any) {
        return this.loadAudio(url, exts, false);
    }

    public loadAudioSprite(url: string, exts: any) {
        return this.loadAudio(url, exts, true);
    }

    public loadAssets(id: string, background: boolean = false) {
        this._currentAssetList = id;
        this.game.load.onFileComplete.remove(this._backgroundFileComplete, this);
        this.game.load.onFileComplete.remove(this._gameFileComplete, this);

        this._hasFiles = false;
        this._soundsToDecode = [];

        if (typeof this._data === 'undefined') {
            return;
        }

        if (typeof this._data[id] === 'undefined' || this._data[id].length < 1) {
            return console.log('no preload data registered for ', id);
        }

        this._loadAssets(id);
        this._hasFiles = this.game.load.totalQueuedFiles() > 0;

        if (background) {
            this.game.load.onLoadStart.addOnce(this._backgroundLoadStart, this);
            this.game.load.onFileComplete.add(this._backgroundFileComplete, this);
            this.game.load.onLoadComplete.addOnce(this._backgroundLoadComplete, this);
        } else {
            this.game.load.onLoadStart.addOnce(this._gameLoadStart, this);
            this.game.load.onFileStart.add(this._gameFileStart, this);
            this.game.load.onFileComplete.add(this._gameFileComplete, this);
            this.game.load.onLoadComplete.addOnce(this._gameLoadComplete, this);
        }

        if (!this._hasFiles) {
            this._gameLoadStart();
            this._gameFileComplete(100);
            this._gameLoadComplete();
            return;
        }

        this._numSounds = this._soundsToDecode.length;
        this._soundsDecoded = 0;
        this._maxPercent = 100 - (this._numSounds * this.soundDecodingModifier);

        if (background) {
            this.game.load.start();
        }
    }

    public loadQueue() {
        if (this._isLoadingQueue) {
            return;
        }

        if (typeof this._data === 'undefined') {
            return console.log('no preload queue to load');
        }

        let assets: any,
            state: string,
            i: number;

        for (state in this._data) {
            if (this._autoLoadData[state]) {

                assets = this._data[state];
                for (i = 0; i < assets.length; i++) {
                    this._loadAsset(assets[i]);
                }
            }
        }

        this.game.load.start();
        this._isLoadingQueue = true;
        this.game.load.onLoadStart.addOnce(this._backgroundLoadStart, this);
        this.game.load.onFileComplete.add(this._backgroundFileComplete, this);
        this.game.load.onLoadComplete.addOnce(this._backgroundLoadComplete, this);
    }


    public getLoadProgress() {
        const adjustedProgress = this._fileCompleteProgress * this._maxPercent / 100;
        return adjustedProgress;
    }


    public allSoundsDecoded() {
        //console.log('sounds to decode', this._soundsToDecode.length);
        return this._soundsToDecode.length === 0;
    }


    /**
    * sets the data for the AssetManager to use as a reference (usually from data/assets.json)
    * triggers the _parseData internal method, which stores the asset list for later use
    * @param {String} textFileFromCache the id of the file in the Phaser.Cache
    */
    public setData(data: Object) {
        this._data = data;
        this._loadData = {};
        this._parseData();

        this.sendNotification(Notifications.ASSET_MANAGER_DATA_SET, this._data);
    }

    /**
    * clears the assets from a particular id in the storage
    * @param  {String} id            the id of the asset list to clear
    * @param  {Boolean} [clearAudio = true]    whether to clear audio files
    * @param  {Boolean} [clearAtlasses = true] whether to clear texture atlasses
    * @param  {Boolean} [clearImages = true]   whether to clear images
    * @param  {Boolean} [clearText = true]     whether to clear text files
    * @return {void}
    */
    public clearAssets(id: string, clearAudio: boolean = true, clearAtlasses: boolean = true, clearImages: boolean = true, clearText: boolean = true, clearJSON: boolean = true) {
        var assets = this._data[id];

        console.log('clearing: ', id);

        if (!assets || typeof assets === 'undefined' || assets.length < 1) {
            return console.log('no assets', assets);
        }

        for (var i = 0; i < assets.length; i++) {
            this.clearAsset(assets[i], clearAudio, clearAtlasses, clearImages, clearText, clearJSON);
        }

        this._completedLoads[id] = false;

        this.sendNotification(Notifications.ASSET_MANAGER_ASSETS_CLEARED, id);
    }

    /**
    * clears an asset from the game's memory
    * @param  {Object} asset         the asset to clear
    * @param  {Boolean} [clearAudio = true]    whether to clear audio files
    * @param  {Boolean} [clearAtlasses = true] whether to clear texture atlasses
    * @param  {Boolean} [clearImages = true]   whether to clear images
    * @param  {Boolean} [clearText = true]     whether to clear text files
    * @return {void}
    */
    public clearAsset(asset: IAsset, clearAudio: boolean = true, clearAtlasses: boolean = true, clearImages: boolean = true, clearText: boolean = true, clearJSON: boolean = true) {
        var type = asset.type,
            url = asset.url,
            required = asset.required;

        if (required) {
            console.log('the ' + type + ' asset: ' + url + ' is required and will not be cleared');
            return;
        }
        switch (type) {
            case AssetManager.AUDIO:
                if (clearAudio) {
                    this.game.sound.removeByKey(url);
                    this.game.cache.removeSound(url);
                }
                break;
            case AssetManager.IMAGE:
                if (clearImages) {
                    this.game.cache.removeImage(url);
                    PIXI.BaseTextureCache[url].destroy();
                }
                break;
            case AssetManager.ATLAS:
                if (clearAtlasses) {
                    this.game.cache.removeImage(url);
                    PIXI.BaseTextureCache[url].destroy();
                    this.game.cache.removeXML(url);
                }
                break;
            case AssetManager.TEXT:
                if (clearText) {
                    this.game.cache.removeText(url);
                }
                break;
            case AssetManager.JSON:
                if (clearJSON) {
                    this.game.cache.removeJSON(url);
                }
                break;
            case AssetManager.PHYSICS:
                if (clearJSON) {
                    this.game.cache.removePhysics(url);
                }
                break;
        }
    }

    /**
    * checks if the assets from this list id are already loaded
    * @param  {String}  id the asset list id to check
    * @return {Boolean}    whether it has been loaded already
    */
    public hasLoadedAssets(id: string) {
        return this._completedLoads[id] === true;
    }

    public sendNotification(notificationName: string, notificationBody?: any): void {
        return this.app.sendNotification(notificationName, notificationBody);
    }

    // getter / setter
    public set baseURL(baseURL: string) {
        // ensure trailing slash
        if (baseURL && baseURL !== undefined && baseURL.charAt(baseURL.length - 1) !== '/')
            baseURL += '/';

        this._baseURL = baseURL;
    }

    public set paths(pathObj: IPathConfig) {
        this._pathObj = pathObj || {};

        this._assetPath = this._baseURL + (this._pathObj.assetPath || 'assets');
        this._dataPath = this._baseURL + (this._pathObj.dataPath || 'assets/data');
        this._spriteSheetPath = this._baseURL + (this._pathObj.spritesheetPath || 'assets/img/spritesheets');
        this._imgPath = this._baseURL + (this._pathObj.imgPath || 'assets/img');
        this._fontPath = this._baseURL + (this._pathObj.fontPath || 'assets/fonts');
        this._bitmapFontPath = this._baseURL + (this._pathObj.bitmapFontPath || 'assets/fonts/bitmap');
        this._audioSpritePath = this._baseURL + (this._pathObj.audioSpritePath || 'assets/audio/sprite');
        this._soundPath = this._baseURL + (this._pathObj.soundPath || 'assets/audio/sound');
        this._physicsPath = this._baseURL + (this._pathObj.physicsPath || 'assets/data/physics');
    }

    public set resolution(res: number) {
        if (res === undefined) {
            res = this.game.resolution;
        }

        this._res = res;
        this._resolution = '';

        if (this._res > 1.5) {
            this._resolution = AssetManager.RESOLUTION_2X;
        }
    }

    public get resolution(): number {
        return this._res;
    }
    /**
    * sets the percentage of the load we should allot to each sound
    * @param {Number} [num = 2] the percentage
    */
    public set soundDecodingModifier(num: number) {
        if (num === undefined) {
            num = 2;
        }
        this._soundDecodingModifier = num;
    }

    public get soundDecodingModifier() {
        return this._soundDecodingModifier;
    }

    public set cacheBustVersion(version: string | number) {
        this._cacheBustVersion = '' + version;
    }
}


/**
 * AudioManager
 * Wrapper for Phaser.SoundManager
 */
export class AudioManager {
    public game: Game;

    private _defaultVolume: number = 1;
    private _sprites: { [sprite: string]: Phaser.AudioSprite } = {};
    private _sounds: { [sound: string]: Phaser.Sound } = {};
    private _markerLookup: { [id: string]: string } = {};

    constructor() {
        this.game = Application.getInstance().game;
    }

    // private methods 
    private _addAudio(key: string, isAudioSprite: boolean = false): Phaser.Sound | Phaser.AudioSprite {
        if (isAudioSprite === true) {
            return this._parseAudioSprite(key, this.game.add.audioSprite(key));
        } else {
            return this._allowMultiple(this.game.add.sound(key));
        }
    }

    private _parseAudioSprite(key: string, audioSprite: Phaser.AudioSprite): Phaser.AudioSprite {
        for (var soundKey in audioSprite.sounds) {
            this._allowMultiple(audioSprite.sounds[soundKey]);
            this._markerLookup[soundKey] = key;
        }
        return audioSprite;
    }

    private _allowMultiple(sound: Phaser.Sound): Phaser.Sound {
        sound.allowMultiple = true;
        return sound;
    }

    private _getKeyFromMarkerName(marker: string): string | boolean {
        if (typeof this._markerLookup[marker] !== 'undefined') {
            return this._markerLookup[marker];
        }
        for (var key in this._sprites) {
            if (typeof this._sprites[key].sounds[marker] !== 'undefined') {
                this._markerLookup[marker] = key;
                return key;
            }
        }
        return false;
    }

    private _playSpriteMarker(key: string, marker: string, volume?: any, loop: boolean = false, forceRestart: boolean = true): Phaser.Sound {
        if (typeof volume !== 'undefined') {
            if (typeof volume === 'string') {
                if (volume.indexOf('+') >= 0 || volume.indexOf('-') >= 0) {
                    volume = this._defaultVolume + parseFloat(volume);
                } else {
                    volume = parseFloat(volume);
                }
            }
        } else {
            volume = this._defaultVolume;
        }

        loop = loop || false;
        forceRestart = forceRestart === false ? false : true;

        return this._sprites[key].play(marker, volume);
    }

    private _stopSpriteMarker(key: string, marker: string): boolean | Phaser.Sound {
        if (typeof this._sprites === 'undefined' || typeof this._sprites[key] === 'undefined') {
            return false;
        }
        return this._sprites[key].stop(marker);
    }

    private _stopSound(sound: Phaser.Sound): void {
        return sound.stop();
    }

    // public methods
    /**
    * adds audio to the lookup (called by AssetManager when any sound is loaded, usually not necessary to call from a game)
    * @param {String} key         the Phaser.Cache key of the audio asset
    * @param {Boolean} isAudioSprite whether the asset is an audio sprite
    */
    public addAudio(key: string, isAudioSprite: boolean = false): Phaser.AudioSprite | Phaser.Sound {
        if (isAudioSprite === true) {
            return this.addAudioSprite(key);
        }
        return this.addSound(key);
    }

    /**
    * adds a single sound to the lookup (usually not necessary to call from a game)
    * @param {String} key the Phaser.Cache key of the asset
    * @return {Phaser.Sound} the added sound
    */
    public addSound(key): Phaser.Sound {
        if (typeof this._sounds[key] !== 'undefined') {
            return this._sounds[key];
        }
        this._sounds[key] = this.game.add.audio(key);
        this._sounds[key].allowMultiple = true;
        return this._sounds[key];
    }

    /**
    * adds an audio sprite to the lookup (usually not necessary to call from a game)
    * @param {String} key the Phaser.Cache key of the asset
    * @return {Phaser.AudioSprite} the added audio sprite
    */
    public addAudioSprite(key: string): Phaser.AudioSprite {
        if (typeof this._sprites[key] !== 'undefined') {
            return this._sprites[key];
        }
        this._sprites[key] = <Phaser.AudioSprite>this._addAudio(key, true);
        return this._sprites[key];
    }

    /**
    * a global method to play a sound - will check audio sprite markers for the provided key first, then single sounds
    * @param  {String} marker       the sound marker (or key) to check for
    * @param  {Number} volume       the volume at which to play the sound
    * @param  {Boolean} loop         whether the sound should loop (won't work if it's a sprite marker, and "loop" hasn't been set in the audio sprite descriptor file)
    * @param  {Boolean} forceRestart whether to restart the sound if it's already playing
    * @return {Phaser.Sound}              the playing sound
    */
    public playAudio(marker: string, volume?: number, loop: boolean = false, forceRestart: boolean = true): Phaser.Sound {
        if (this._getKeyFromMarkerName(marker)) {
            return this.playSpriteMarker(marker, volume, loop, forceRestart);
        }

        return this.playSound(marker, volume, loop, forceRestart);
    }

    /**
    * calls Dijon.AudioManager.playAudio on a delay
    * @param  {int} delay        number of milliseconds to delay the sound
    * @param  {String} marker       the sound marker (or key) to check for
    * @param  {Number} volume       the volume at which to play the sound
    * @param  {Boolean} loop         whether the sound should loop (won't work if it's a sprite marker, and "loop" hasn't been set in the audio sprite descriptor file)
    * @param  {Boolean} forceRestart whether to restart the sound if it's already playing
    */
    public playDelayedAudio(delay: number, marker: string, volume?: number, loop: boolean = false, forceRestart: boolean = true): Phaser.Sound {
        if (this._getKeyFromMarkerName(marker)) {
            return this.playDelayedSpriteMarker(delay, marker, volume, loop, forceRestart);
        }
        return this.playDelayedSound(delay, marker, volume, loop, forceRestart);
    }

    /**
    * plays a single sound
    * @param  {String} key          the Phaser.Cache key for the sound
    * @param  {Number} volume       the volume at which to play the sound
    * @param  {Boolean} loop         whether the sound should loop (won't work if it's a sprite marker, and "loop" hasn't been set in the audio sprite descriptor file)
    * @param  {Boolean} forceRestart whether to restart the sound if it's already playing
    * @return {Phaser.Sound} the playing sound
    */
    public playSound(key: string, volume?: number, loop: boolean = false, forceRestart: boolean = true): Phaser.Sound {
        if (typeof this._sounds[key] === 'undefined') {
            return null;
        }
        volume = typeof volume === 'undefined' ? this._defaultVolume : volume;

        return this._sounds[key].play("", 0, volume, loop, forceRestart);
    }

    /**
    * plays a marker from an audio sprite
    * @param  {String} marker       the marker to check for (will check all audio sprites)
    * @param  {Number} volume       the volume at which to play the sound
    * @param  {Boolean} loop         whether the sound should loop (won't work if it's a sprite marker, and "loop" hasn't been set in the audio sprite descriptor file)
    * @param  {Boolean} forceRestart whether to restart the sound if it's already playing
    * @return {Phaser.Sound} the playing sound
    */
    public playSpriteMarker(marker: string, volume?: number, loop: boolean = false, forceRestart: boolean = true): Phaser.Sound {
        const key = this._getKeyFromMarkerName(marker);

        if (!key) {
            console.log('marker not found', marker);
            return null;
        }

        return this._playSpriteMarker(<string>key, marker, volume, loop, forceRestart);
    }

    public playDelayedSound(delay: number, key: string, volume?: number, loop: boolean = false, forceRestart: boolean = true): Phaser.Sound {
        this.game.time.events.add(delay, this.playSound, this, key, volume, loop, forceRestart);
        return null;
    }

    public playDelayedSpriteMarker(delay: number, marker: string, volume?: number, loop: boolean = false, forceRestart: boolean = true): Phaser.Sound {
        this.game.time.events.add(delay, this.playSpriteMarker, this, marker, volume, loop, forceRestart);
        return null;
    }

    /**
    * stops any playing audio file with the given marker
    * checks audio sprites first, then single sounds
    * @return {Phaser.Sound} the sound that was stopped
    */
    public stopAudio(marker: string): void {
        if (this._getKeyFromMarkerName(marker)) {
            return this.stopSpriteMarker(marker);
        }
        return this.stopSound(marker);
    }

    /**
    * stops a single sound from playing
    * @return {Phaser.Sound} the sound that was stopped
    */
    public stopSound(key: string): void {
        if (typeof this._sounds === 'undefined' || typeof this._sounds[key] === 'undefined') {
            return;
        }
        return this._sounds[key].stop();
    }

    /**
    * stops a single sound from playing
    * @return {Phaser.Sound} the sound that was stopped
    */
    public stopSpriteMarker(marker: string): void {
        var key = this._getKeyFromMarkerName(marker);
        if (!key) {
            console.log('marker not found', marker);
            return;
        }
        this._stopSpriteMarker(<string>key, marker);
    }

    /**
    * stops removes a sound from Dijon.AudioManager's lookup
    * @param  {String} key the key of the sound to be removed
    * @return {void}
    */
    public removeSound(key) {
        if (typeof this._sounds === 'undefined' || typeof this._sounds[key] === 'undefined') {
            return false;
        }
        if (this._sounds[key]) {
            this.stopSound(key);
            this._sounds[key].destroy();
            delete this._sounds[key];
        }
    }

    /**
    * stops removes an audio sprite from Dijon.AudioManager's lookup
    * @param  {String} key the key of the sound to be removed
    * @return {void}
    */
    public removeSprite(key: string): void {
        if (typeof this._sprites === 'undefined' || typeof this._sprites[key] === 'undefined') {
            return;
        }
        this.stopSpriteMarker(key);
        this._sprites[key] = null;
        delete this._sprites[key];
    }

    public fade(sound: Phaser.Sound, volume: number, time: number, stop: boolean = false): Phaser.Tween {
        if (!sound)
            return;

        if (sound.fadeTween && sound.fadeTween)
            this.game.tweens.remove(sound.fadeTween);

        sound.fadeTween = this.game.add.tween(sound).to({
            volume: volume
        }, time || 300, Phaser.Easing.Linear.None);

        if (stop === true)
            sound.fadeTween.onComplete.addOnce(function() { this._stopSound(sound) }, this);

        return sound.fadeTween.start();
    }

    // getter / setter
    /**
    * Sets the default volume for all sounds (used in the case where a volume is not supplied to the playAudio, playSound, or playSpriteMarker methods)
    */
    public set defaultVolume(vol: number) {
        this._defaultVolume = vol;
    }

    public get defaultVolume(): number {
        return this._defaultVolume;
    }
}

/**
 * Game 
 */
export class Game extends Phaser.Game {
    // public variables
    // application
    public app: Application;
    public config: IGameConfig;

    // managers
    public asset: AssetManager;
    public sequence: SequenceManager;
    public transition: TransitionManager;
    public storage: StorageManager;
    public audio: AudioManager;
    public analytics: AnalyticsManager;
    public add: GameObjectFactory;

    // signals
    public onWorldInputDisabled: Phaser.Signal = new Phaser.Signal();
    public onWorldInputEnabled: Phaser.Signal = new Phaser.Signal();

    // display layers
    public backgroundLayer: Group;
    public gameLayer: Group;
    public uiLayer: Group;
    public stageLayer: Group;

    // Phaser.Game overrides
    constructor(config: IGameConfig) {
        super(config);
    }

    public boot() {
        super.boot();

        this.app = Application.getInstance();

        // add managers
        this.asset = new AssetManager();
        this.sequence = new SequenceManager();
        this.transition = new TransitionManager();
        this.storage = new StorageManager();
        this.audio = new AudioManager();
        this.analytics = new AnalyticsManager(this.config.analytics);

        // replace Phaser.GameObjectFactory
        this.add = null;
        this.add = new GameObjectFactory(this);
        this.addLayers();
        this.addMouseCallbacks();
        this.setFactoryDefaultLayer(this.gameLayer);
    }

    public addPlugins(): void {
        if (this.config.plugins && this.config.plugins.length > 0) {
            this.config.plugins.forEach(pluginName => {
                if (typeof Phaser.Plugin[pluginName] === 'function') {
                    this.add.plugin(Phaser.Plugin[pluginName]);
                }
            });
        }
    }

    // Override this.world as the default layer that 
    // .add calls will be created on.
    public setFactoryDefaultLayer(newLayer: Phaser.Group) {
        this.add.setDefaultLayer(newLayer || this.world);
    }
    // private methods
    protected addLayers(): void {
        // adds persistent background layer
        this.backgroundLayer = this.add.dGroup(0, 0, '_background_layer', true);
        this.stage.setChildIndex(this.backgroundLayer, 0);

        // adds game and ui layers
        this.gameLayer = this.add.dGroup(0, 0, '_game_layer');
        // add ui layer and set the "fixedToCamera" property to true
        // if the game's camera moves, anything in this group will stay in place
        this.uiLayer = this.add.dGroup(0, 0, '_ui_layer');
        this.uiLayer.fixedToCamera = true;

        // add a group to the Phaser.Stage (just in case)
        this.stageLayer = this.add.dGroup(0, 0, '_stage_layer', true);
    }

    protected addMouseCallbacks(): void {
        if (this.device.desktop) {
            this.input.mouse.mouseOverCallback = this.mouseOver;
            this.input.mouse.mouseOutCallback = this.mouseOut;
        }
    }

    protected mouseOut(): void {
        Application.getInstance().sendNotification(Notifications.MOUSE_LEAVE_GLOBAL);
    }

    protected mouseOver(): void {
        Application.getInstance().sendNotification(Notifications.MOUSE_ENTER_GLOBAL);
    }

    // public methods
    public disableElementInput(el: any): any {
        if (el.input && el.inputEnabled === true) {
            el.wasEnabled = true;
            el.inputEnabled = false;
        }
        if (el.children.length > 0) {
            for (var i = 0; i < el.children.length; i++) {
                this.disableElementInput(el.children[i]);
            }
        }
    }

    public enableElementInput(el: any): any {
        if (el.input && el.inputEnabled === false && el.wasEnabled) {
            el.wasEnabled = false;
            el.inputEnabled = true;
        }
        if (el.children.length > 0) {
            for (var i = 0; i < el.children.length; i++) {
                this.enableElementInput(el.children[i]);
            }
        }
    }

    public disableInput(group: Phaser.Group): any {
        return group.forEach(function(el) {
            if (el instanceof Phaser.Group) {
                return this.disableInput(el);
            } else {
                return this.disableElementInput(el);
            }
        }, this);
    }

    public enableInput(group: Phaser.Group): any {
        return group.forEach(function(el) {
            if (el instanceof Phaser.Group) {
                return this.enableInput(el);
            } else {
                return this.enableElementInput(el);
            }
        }, this);
    }

    public disableGameInput() {
        this.disableInput(this.gameLayer);
        this.onWorldInputDisabled.dispatch();
    }

    public enableGameInput() {
        this.enableInput(this.gameLayer);
        this.onWorldInputEnabled.dispatch();
    }

    /**
     * removes all items from the game layer
     * but allows the ui layer to persist
     * that way we can overlay the game without adding stuff to the phaser stage (for transitions)
     * @param {String} toState the new state we're changing to
     * @return {void}
     */
    public changeState(toState: string): void {
        this.gameLayer.removeAll(true, true);
        return this.state.start(toState, false, false);
    }

    // getter / setter
    /**
     * sets the target group for the gameObjectFactory to gameLayer before adding 
     * this way if we pass a null group to whatever method we call 
     * ie (this.game.addToGame.image(0, 0, key, frame));
     * it will be added to the appropriate layer
     */
    public get addToGame(): GameObjectFactory {
        this.add.targetGroup = this.gameLayer;
        return this.add;
    }

    /**
     * sets the target group for the gameObjectFactory to uiLayer before adding 
     * this way if we pass a null group to whatever method we call 
     * ie (this.game.addToUI.image(0, 0, key, frame));
     * it will be added to the appropriate layer
     */
    public get addToBackground(): GameObjectFactory {
        this.add.targetGroup = this.backgroundLayer;
        return this.add;
    }


    public get addToUI(): GameObjectFactory {
        // set the target group for the gameObjectFactory before adding
        this.add.targetGroup = this.uiLayer;
        return this.add;
    }

    public get addToStage(): GameObjectFactory {
        // set the target group for the gameObjectFactory before adding
        this.add.targetGroup = this.stageLayer;
        return this.add;
    }

    public get addToWorld(): GameObjectFactory {
        // set the target group for the gameObjectFactory before adding
        this.add.targetGroup = this.world;
        return this.add;
    }
}

/**
 * GameObjectFactory
 */

export class GameObjectFactory extends Phaser.GameObjectFactory {
    // The layer the current object will be added to. This is used by helper functions in Game.ts.
    protected _targetGroup: Phaser.Group = null;

    // This is the layer that standard .add calls will be applied to.
    protected _defaultLayer: Phaser.Group = this.world;

    // overrides
    /**
    * Adds an existing display object to the game world.
    * 
    * @method Phaser.GameObjectFactory#existing
    * @param {any} object - An instance of Phaser.Sprite, Phaser.Button or any other display object.
    * @return {any} The child that was added to the World.
    */
    public existing(object): any {
        let group = this.targetGroup;
        this.targetGroup = null;
        return group.add(object);
    }
    /**
    * Create a new `Image` object.
    * 
    * An Image is a light-weight object you can use to display anything that doesn't need physics or animation.
    * 
    * It can still rotate, scale, crop and receive input events. 
    * This makes it perfect for logos, backgrounds, simple buttons and other non-Sprite graphics.
    *
    * @method Phaser.GameObjectFactory#image
    * @param {number} [x=0] - The x coordinate of the Image. The coordinate is relative to any parent container this Image may be in.
    * @param {number} [y=0] - The y coordinate of the Image. The coordinate is relative to any parent container this Image may be in.
    * @param {string|Phaser.RenderTexture|Phaser.BitmapData|Phaser.Video|PIXI.Texture} [key] - The image used as a texture by this display object during rendering. If a string Phaser will get for an entry in the Image Cache. Or it can be an instance of a RenderTexture, BitmapData, Video or PIXI.Texture.
    * @param {string|number} [frame] - If a Texture Atlas or Sprite Sheet is used this allows you to specify the frame to be used. Use either an integer for a Frame ID or a string for a frame name.
    * @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
    * @returns {Phaser.Image} The newly created Image object.
    */
    public image(x: number = 0, y: number = 0, key?: string | Phaser.RenderTexture | Phaser.BitmapData | PIXI.Texture, frame?: string | number, group?: Phaser.Group): Phaser.Image {
        if (group === undefined) { group = this.targetGroup; }
        this.targetGroup = null;
        return group.add(new Phaser.Image(this.game, x, y, key, frame));
    }

    /**
    * Create a new Sprite with specific position and sprite sheet key.
    *
    * At its most basic a Sprite consists of a set of coordinates and a texture that is used when rendered.
    * They also contain additional properties allowing for physics motion (via Sprite.body), input handling (via Sprite.input),
    * events (via Sprite.events), animation (via Sprite.animations), camera culling and more. Please see the Examples for use cases.
    *
    * @method Phaser.GameObjectFactory#sprite
    * @param {number} [x=0] - The x coordinate of the sprite. The coordinate is relative to any parent container this sprite may be in.
    * @param {number} [y=0] - The y coordinate of the sprite. The coordinate is relative to any parent container this sprite may be in.
    * @param {string|Phaser.RenderTexture|Phaser.BitmapData|Phaser.Video|PIXI.Texture} [key] - The image used as a texture by this display object during rendering. If a string Phaser will get for an entry in the Image Cache. Or it can be an instance of a RenderTexture, BitmapData, Video or PIXI.Texture.
    * @param {string|number} [frame] - If a Texture Atlas or Sprite Sheet is used this allows you to specify the frame to be used. Use either an integer for a Frame ID or a string for a frame name.
    * @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
    * @returns {Phaser.Sprite} The newly created Sprite object.
    */
    public sprite(x: number = 0, y: number = 0, key?: string | PIXI.Texture, frame?: string | number, group?: Phaser.Group): Phaser.Sprite {
        if (group === undefined) { group = this.targetGroup; }
        this.targetGroup = null;

        return group.create(x, y, key, frame);
    }

    /**
    * Create a new Creature Animation object.
    *
    * Creature is a custom Game Object used in conjunction with the Creature Runtime libraries by Kestrel Moon Studios.
    * 
    * It allows you to display animated Game Objects that were created with the [Creature Automated Animation Tool](http://www.kestrelmoon.com/creature/).
    * 
    * Note 1: You can only use Phaser.Creature objects in WebGL enabled games. They do not work in Canvas mode games.
    *
    * Note 2: You must use a build of Phaser that includes the CreatureMeshBone.js runtime and gl-matrix.js, or have them
    * loaded before your Phaser game boots.
    * 
    * See the Phaser custom build process for more details.
    *
    * @method Phaser.GameObjectFactory#creature
    * @param {number} [x=0] - The x coordinate of the creature. The coordinate is relative to any parent container this creature may be in.
    * @param {number} [y=0] - The y coordinate of the creature. The coordinate is relative to any parent container this creature may be in.
    * @param {string|PIXI.Texture} [key] - The image used as a texture by this creature object during rendering. If a string Phaser will get for an entry in the Image Cache. Or it can be an instance of a PIXI.Texture.
    * @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the Default Layer group.
    * @returns {Phaser.Creature} The newly created Sprite object.
    */
    public creature(x: number = 0, y: number = 0, key?: string, mesh?: any, group?: Phaser.Group): any {
        if (group === undefined) { group = this.targetGroup; }
        this.targetGroup = null;

        var obj = new Phaser['Creature'](this.game, x, y, key, mesh);

        group.add(obj);

        return obj;
    }

    /**
    * A Group is a container for display objects that allows for fast pooling, recycling and collision checks.
    *
    * @method Phaser.GameObjectFactory#group
    * @param {any} [parent] - The parent Group or DisplayObjectContainer that will hold this group, if any. If set to null the Group won't be added to the display list. If undefined it will be added to World by default.
    * @param {string} [name='group'] - A name for this Group. Not used internally but useful for debugging.
    * @param {boolean} [addToStage=false] - If set to true this Group will be added directly to the Game.Stage instead of Game.World.
    * @param {boolean} [enableBody=false] - If true all Sprites created with `Group.create` or `Group.createMulitple` will have a physics body created on them. Change the body type with physicsBodyType.
    * @param {number} [physicsBodyType=0] - If enableBody is true this is the type of physics body that is created on new Sprites. Phaser.Physics.ARCADE, Phaser.Physics.P2, Phaser.Physics.NINJA, etc.
    * @return {Phaser.Group} The newly created Group.
    */
    public group(parent?: any, name: string = 'group', addToStage: boolean = false, enableBody: boolean = false, physicsBodyType: number = 0) {
        if (parent === undefined && addToStage !== true) { parent = this.targetGroup; }
        this.targetGroup = null;
        return new Phaser.Group(this.game, parent, name, addToStage, enableBody, physicsBodyType);
    }

    /**
    * A Group is a container for display objects that allows for fast pooling, recycling and collision checks.
    * 
    * A Physics Group is the same as an ordinary Group except that is has enableBody turned on by default, so any Sprites it creates
    * are automatically given a physics body.
    *
    * @method Phaser.GameObjectFactory#physicsGroup
    * @param {number} [physicsBodyType=Phaser.Physics.ARCADE] - If enableBody is true this is the type of physics body that is created on new Sprites. Phaser.Physics.ARCADE, Phaser.Physics.P2, Phaser.Physics.NINJA, etc.
    * @param {any} [parent] - The parent Group or DisplayObjectContainer that will hold this group, if any. If set to null the Group won't be added to the display list. If undefined it will be added to World by default.
    * @param {string} [name='group'] - A name for this Group. Not used internally but useful for debugging.
    * @param {boolean} [addToStage=false] - If set to true this Group will be added directly to the Game.Stage instead of Game.World.
    * @return {Phaser.Group} The newly created Group.
    */
    public physicsGroup(physicsBodyType: number = 0, parent?: any, name: string = 'group', addToStage: boolean = false): Phaser.Group {
        if (parent === undefined) { parent = this.targetGroup; }
        this.targetGroup = null;
        return new Phaser.Group(this.game, parent, name, addToStage, true, physicsBodyType);
    }

    /**
    * A SpriteBatch is a really fast version of a Phaser Group built solely for speed.
    * Use when you need a lot of sprites or particles all sharing the same texture.
    * The speed gains are specifically for WebGL. In Canvas mode you won't see any real difference.
    *
    * @method Phaser.GameObjectFactory#spriteBatch
    * @param {Phaser.Group|null} parent - The parent Group that will hold this Sprite Batch. Set to `undefined` or `null` to add directly to game.world.
    * @param {string} [name='group'] - A name for this Sprite Batch. Not used internally but useful for debugging.
    * @param {boolean} [addToStage=false] - If set to true this Sprite Batch will be added directly to the Game.Stage instead of the parent.
    * @return {Phaser.SpriteBatch} The newly created Sprite Batch.
    */
    public spriteBatch(parent?: any, name: string = "spriteBatch", addToStage: boolean = false): Phaser.SpriteBatch {
        if (parent === undefined) { parent = this.targetGroup }
        this.targetGroup = null;
        return new Phaser.SpriteBatch(this.game, parent, name, addToStage);
    }

    /**
   * Creates a new TileSprite object.
   *
   * @method Phaser.GameObjectFactory#tileSprite
   * @param {number} x - The x coordinate of the TileSprite. The coordinate is relative to any parent container this TileSprite may be in.
   * @param {number} y - The y coordinate of the TileSprite. The coordinate is relative to any parent container this TileSprite may be in.
   * @param {number} width - The width of the TileSprite.
   * @param {number} height - The height of the TileSprite.
   * @param {string|Phaser.RenderTexture|Phaser.BitmapData|Phaser.Video|PIXI.Texture} key - The image used as a texture by this display object during rendering. If a string Phaser will get for an entry in the Image Cache. Or it can be an instance of a RenderTexture, BitmapData, Video or PIXI.Texture.
   * @param {string|number} [frame] - If a Texture Atlas or Sprite Sheet is used this allows you to specify the frame to be used. Use either an integer for a Frame ID or a string for a frame name.
   * @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the Default Layer group.
   * @return {Phaser.TileSprite} The newly created TileSprite object.
   */
    public tileSprite(x: number = 0, y: number = 0, width: number = 0, height: number = 0, key?: string, frame?: string | number, group?: Phaser.Group): Phaser.TileSprite {
        if (group === undefined) { group = this.targetGroup; }
        this.targetGroup = null;
        return group.add(new Phaser.TileSprite(this.game, x, y, width, height, key, frame));
    }

    /**
   * Creates a new Rope object.
   *
   * Example usage: https://github.com/codevinsky/phaser-rope-demo/blob/master/dist/demo.js
   *
   * @method Phaser.GameObjectFactory#rope
   * @param {number} [x=0] - The x coordinate of the Rope. The coordinate is relative to any parent container this rope may be in.
   * @param {number} [y=0] - The y coordinate of the Rope. The coordinate is relative to any parent container this rope may be in.
   * @param {string|Phaser.RenderTexture|Phaser.BitmapData|Phaser.Video|PIXI.Texture} [key] - The image used as a texture by this display object during rendering. If a string Phaser will get for an entry in the Image Cache. Or it can be an instance of a RenderTexture, BitmapData, Video or PIXI.Texture.
   * @param {string|number} [frame] - If a Texture Atlas or Sprite Sheet is used this allows you to specify the frame to be used. Use either an integer for a Frame ID or a string for a frame name.
   * @param {Array} points - An array of {Phaser.Point}.
   * @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the Default Layer group.
   * @return {Phaser.Rope} The newly created Rope object.
   */
    public rope(x: number = 0, y: number = 0, key?: string, frame?: string | number, points?: Phaser.Point[], group?: Phaser.Group): Phaser.Rope {
        if (group === undefined) { group = this.targetGroup; }
        this.targetGroup = null;
        return group.add(new Phaser.Rope(this.game, x, y, key, frame, points));
    }

    /**
    * Creates a new Text object.
    *
    * @method Phaser.GameObjectFactory#text
    * @param {number} [x=0] - The x coordinate of the Text. The coordinate is relative to any parent container this text may be in.
    * @param {number} [y=0] - The y coordinate of the Text. The coordinate is relative to any parent container this text may be in.
    * @param {string} [text=''] - The text string that will be displayed.
    * @param {object} [style] - The style object containing style attributes like font, font size , etc.
    * @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the Default Layer group.
    * @return {Phaser.Text} The newly created text object.
    */
    public text(x: number = 0, y: number = 0, text: string = '', style?: Phaser.PhaserTextStyle, group?: Phaser.Group): Phaser.Text {
        if (group === undefined) { group = this.targetGroup; }
        this.targetGroup = null;
        return group.add(new Phaser.Text(this.game, x, y, text, style));
    }

    /**
    * Creates a new Button object.
    *
    * @method Phaser.GameObjectFactory#button
    * @param {number} [x=0] - The x coordinate of the Button. The coordinate is relative to any parent container this button may be in.
    * @param {number} [y=0] - The y coordinate of the Button. The coordinate is relative to any parent container this button may be in.
    * @param {string} [key] - The image key as defined in the Game.Cache to use as the texture for this button.
    * @param {function} [callback] - The function to call when this button is pressed
    * @param {object} [callbackContext] - The context in which the callback will be called (usually 'this')
    * @param {string|number} [overFrame] - This is the frame or frameName that will be set when this button is in an over state. Give either a number to use a frame ID or a string for a frame name.
    * @param {string|number} [outFrame] - This is the frame or frameName that will be set when this button is in an out state. Give either a number to use a frame ID or a string for a frame name.
    * @param {string|number} [downFrame] - This is the frame or frameName that will be set when this button is in a down state. Give either a number to use a frame ID or a string for a frame name.
    * @param {string|number} [upFrame] - This is the frame or frameName that will be set when this button is in an up state. Give either a number to use a frame ID or a string for a frame name.
    * @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the Default Layer group.
    * @return {Phaser.Button} The newly created Button object.
    */
    public button(x: number = 0, y: number = 0, key?: string, callback?: Function, callbackContext?: Object, overFrame?: string | number, outFrame?: string | number, downFrame?: string | number, upFrame?: string | number, group?: Phaser.Group): Phaser.Button {
        if (group === undefined) { group = this.targetGroup; }
        this.targetGroup = null;
        return group.add(new Phaser.Button(this.game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame));
    }

    /**
    * Creates a new Graphics object.
    *
    * @method Phaser.GameObjectFactory#graphics
    * @param {number} [x=0] - The x coordinate of the Graphic. The coordinate is relative to any parent container this object may be in.
    * @param {number} [y=0] - The y coordinate of the Graphic. The coordinate is relative to any parent container this object may be in.
    * @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
    * @return {Phaser.Graphics} The newly created graphics object.
    */
    public graphics(x: number = 0, y: number = 0, group?: Phaser.Group): Phaser.Graphics {
        if (group === undefined) { group = this.world; }
        /***
         * Commented this out - since graphics are by default added directly on the game.world, we shouldn't reset this.targetGroup
         * It could cause major problems if using dijon/utils Textures instances as an image texture, for instance
         */
        //this.targetGroup = null;
        return group.add(new Phaser.Graphics(this.game, x, y));
    }

    /**
    * Create a new BitmapText object.
    *
    * BitmapText objects work by taking a texture file and an XML file that describes the font structure.
    * It then generates a new Sprite object for each letter of the text, proportionally spaced out and aligned to 
    * match the font structure.
    * 
    * BitmapText objects are less flexible than Text objects, in that they have less features such as shadows, fills and the ability 
    * to use Web Fonts. However you trade this flexibility for pure rendering speed. You can also create visually compelling BitmapTexts by 
    * processing the font texture in an image editor first, applying fills and any other effects required.
    *
    * To create multi-line text insert \r, \n or \r\n escape codes into the text string.
    *
    * To create a BitmapText data files you can use:
    *
    * BMFont (Windows, free): http://www.angelcode.com/products/bmfont/
    * Glyph Designer (OS X, commercial): http://www.71squared.com/en/glyphdesigner
    * Littera (Web-based, free): http://kvazars.com/littera/
    *
    * @method Phaser.GameObjectFactory#bitmapText
    * @param {number} x - X coordinate to display the BitmapText object at.
    * @param {number} y - Y coordinate to display the BitmapText object at.
    * @param {string} font - The key of the BitmapText as stored in Phaser.Cache.
    * @param {string} [text=''] - The text that will be rendered. This can also be set later via BitmapText.text.
    * @param {number} [size=32] - The size the font will be rendered at in pixels.
    * @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
    * @return {Phaser.BitmapText} The newly created bitmapText object.
    */
    public bitmapText(x?: number, y?: number, font?: string, text: string = "", size: number = 32, group?: Phaser.Group): Phaser.BitmapText {
        if (group === undefined) { group = this.targetGroup; }
        this.targetGroup = null;
        return group.add(new Phaser.BitmapText(this.game, x, y, font, text, size));
    }

    // dijon specific display objects
    public dSprite(x?: number, y?: number, key?: string | Phaser.RenderTexture | Phaser.BitmapData | PIXI.Texture, frame?: string | number, name?: string, components?: Component[], group?: Phaser.Group): Sprite {
        if (group === undefined) { group = this.targetGroup; }
        this.targetGroup = null;
        return group.add(new Sprite(x, y, key, frame, name, components));
    }

    public dGroup(x?: number, y?: number, name?: string, addToStage?: boolean, components?: Component[], enableBody?: boolean, physicsBodyType?: number, group?: Phaser.Group): Group {
        if (group === undefined && addToStage !== true) {
            group = this.targetGroup;
            this.targetGroup = null;
            return group.add(new Group(x, y, name, addToStage, components, enableBody, physicsBodyType));
        }

        return new Group(x, y, name, addToStage, components, enableBody, physicsBodyType);
    }

    public dText(x: number, y: number, text?: string, fontName?: string, fontSize?: number, fontColor?: string, fontAlign?: string, wordWrap?: boolean, width?: number, lineSpacing?: number, settings?: Object, group?: Phaser.Group): Text {
        if (group === undefined) { group = this.targetGroup; }
        this.targetGroup = null;
        return group.add(new Text(x, y, text, fontName, fontSize, fontColor, fontAlign, wordWrap, width, lineSpacing, settings));
    }

    public setDefaultLayer(value: Phaser.Group) {
        console.log("CAUTION: Changing the default layer will change the target group for .add");
        this._defaultLayer = value;
    }

    public get defaultLayer() {
        return this._defaultLayer;
    }
    // getter / setter
    public set targetGroup(value: Phaser.Group) {
        this._targetGroup = value;
    }

    public get targetGroup(): Phaser.Group {
        return this._targetGroup || this._defaultLayer;
    }
}

/**
 * SequenceManager
 */
export class SequenceManager {
    public game: Game;

    private _defaultInterval = 20;

    constructor() {
        this.game = Application.getInstance().game;
    }

    // private methods
    private _executeMethod(sequence: Array<Function>, context: Object, callback: Function, callbackContext: Object) {
        var func = sequence.shift();
        if (typeof func !== 'undefined' && typeof context !== 'undefined' && context) {
            func.call(context);
        }

        if (sequence.length === 0 && callback && callbackContext) {
            callback.call(callbackContext);
        }
    }

    // public methods
    public run(sequence: Array<Function>, context: Object, interval: number, completeCallback: Function, completeCallbackContext: Object) {
        if (typeof context === 'undefined') {
            throw new Error('context must be provided for the sequence methods');
        }

        if (typeof interval === 'undefined') {
            interval = this._defaultInterval;
        }

        if (sequence.length === 0 && typeof completeCallback !== 'undefined' && typeof completeCallbackContext !== 'undefined') {
            completeCallback.call(completeCallbackContext);
            return;
        }

        if (interval === 0) {
            while (sequence.length > 0)
                this._executeMethod(sequence, context, typeof completeCallback === 'undefined' ? null : completeCallback, typeof completeCallbackContext === 'undefined' ? null : completeCallbackContext);
            return;
        }

        this.game.time.events.repeat(interval, sequence.length, this._executeMethod, this, sequence, context, typeof completeCallback === 'undefined' ? null : completeCallback, typeof completeCallbackContext === 'undefined' ? null : completeCallbackContext);
    }
}


/**
 * State
 */

export class State extends Phaser.State {
    protected _audio: Phaser.Sound[] = [];
    protected _mediator: Mediator = null;

    constructor() {
        super();
    }
    // Phaser.State overrides
    public init(): void {

    }

    public preload(): void {
        if (this.preloadID)
            this.game.asset.loadAssets(this.preloadID);
    }

    public create(): void {
        if (!this.game.asset.allSoundsDecoded()) {
            this.game.asset.onLoadCompleteAndAudioDecoded.addOnce(this.create, this);
            return;
        }
        this.buildInterface();
        this.afterBuildInterface();
        this.startBuild();
    }

    public shutdown(removeMediator: boolean = true, removeAudio: boolean = true): void {
        if (removeMediator) {
            this.removeMediator();
        }
        if (removeAudio) {
            this.removeAudio();
        }

        super.shutdown();
    }

    // public methods
    public listBuildSequence(): Function[] {
        return [];
    }

    public buildInterface(): void { }

    public afterBuildInterface(): void { }

    public startBuild(): void {
        this.game.sequence.run(this.listBuildSequence(), this, this.buildInterval, this.preAfterBuild, this);
    }

    public preAfterBuild(): void {
        if (typeof this.game.transition === 'undefined' || !this.game.transition.canTransitionOut()) {
            this.afterBuild();
        } else {
            if (this.game.transition.canTransitionOut()) {
                this.game.transition.onTransitionOutComplete.addOnce(this.afterBuild, this);
                this.game.transition.transitionOut();
            }
        }
    }

    public afterBuild(): void { }

    public addAudio(track: Phaser.Sound): Phaser.Sound {
        if (!this._audio) {
            this._audio = [];
        }
        this._audio.push(track);
        return track;
    }

    public removeAudio(): void {
        var sound: Phaser.Sound;
        if (!this._audio) {
            return;
        }

        while (this._audio.length > 0) {
            sound = this._audio.pop();
            if (typeof sound !== 'undefined' && sound != null && typeof sound.stop !== 'undefined') {
                if (typeof sound.onStop !== 'undefined') {
                    sound.onStop.removeAll();
                }
                sound.stop();
            }
        }
    }

    public removeMediator(): void {
        if (!this._mediator)
            return;
        this._mediator.destroy();
        this._mediator = null;
    }

    // getter / setter
    public get preloadID(): string {
        return null;
    }

    public get buildInterval(): number {
        return 10;
    }

    public get add(): GameObjectFactory {
        return this.game.addToGame;
    }

    public get app(): Application {
        return Application.getInstance();
    }

    public get game(): Game {
        return this.app.game;
    }
}

/**
 * StorageManager
 */

export class StorageManager {
    public game: Game;
    private _localStorageAvailable: boolean;

    constructor() {
        this.game = Application.getInstance().game;
        this._init();
    }

    // private methods
    private _init(): void {
        this._localStorageAvailable = this._getIsLocalStorageAvailable();
        console.log('local storage available', this._localStorageAvailable);
    }

    private _getIsLocalStorageAvailable(): boolean {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    }

    private _getString(data: Object | string): string {
        if (typeof data === 'string') {
            return data;
        }

        var jsonData;

        try {
            jsonData = JSON.stringify(data);
        } catch (e) {
            console.log('Could not convert' + data + ' to json');
            return null;
        }

        return jsonData;
    }

    // public methods
    /**
    * gets stored data with the specified key
    * @param  {String}  key    the LocalStorage key where the data is stored
    * @param  {Boolean} isJSON is the stored data just a string or is it stringified json (assumes it's JSON)
    * @return {String | Object} the retrieved data - if it's a JSON string, we parse the data and return the JSON object
    */
    public getFromLocalStorage(key: string, isJSON: boolean = true) {
        var data = localStorage.getItem(key);
        if (typeof data === 'undefined') {
            console.log('no data saved with the key', key);
            return null;
        }

        if (isJSON !== false) {
            data = JSON.parse(data);
        }
        return data;
    }

    /**
    * saves data to localstorage
    * @param  {String} key   the LocalStorage key the data will be saved to
    * @param  {String|Object} value the data to save (if it's an object, will be stringified before saving)
    * @return {void}
    */
    public saveToLocalStorage(key: string, value: string | Object) {
        if (!this._localStorageAvailable) {
            console.log('no local storage');
            return false;
        }
        try {
            localStorage.setItem(key, this._getString(value));
        } catch (e) {
            console.log('your data could not be saved');
        }
    }

    /**
    * clear stored data
    * @param  {String} key the LocalStorage key to clear
    * @return {void}
    */
    public clearFromLocalStorage(key: string) {
        if (!this._localStorageAvailable) {
            console.log('no local storage');
            return false;
        }

        try {
            localStorage.removeItem(key);
        } catch (e) { }
    }
}

/**
 * TransitionManager
 */

export class TransitionManager {
    public game: Game;
    public onTransitionOutComplete: Phaser.Signal = new Phaser.Signal();
    public onTransitionInComplete: Phaser.Signal = new Phaser.Signal();

    private _transition: ITransition = null;
    private _transitions: Object = {};
    private _exceptions: Object = {};

    private _fromState: string = null;
    private _toState: string = null;

    constructor() {
        this.game = Application.getInstance().game;
    }

    private _add(id: string, outHandler: ITransitionHandler, preloadHandler: IPreloadHandler, inHandler: ITransitionHandler): void {
        this._transitions[id] = {
            outHandler: outHandler,
            preloadHandler: preloadHandler,
            inHandler: inHandler
        };
    }

    private _getTransition(inState: string, outState: string) {
        var transition = this._transitions[inState + '/' + outState];
        if (typeof transition === 'undefined')
            transition = this._transitions['all'];

        return typeof transition === 'undefined' ? null : transition;
    }

    private _transitionInComplete() {
        this._transition = this._getTransition(this._fromState, this._toState);
        if (!this._transition)
            return false;

        if (typeof this._transition.preloadHandler.loadStart === 'function')
            this.game.asset.onLoadStart.addOnce(this._transition.preloadHandler.loadStart, this._transition.preloadHandler);

        if (typeof this._transition.preloadHandler.loadProgress === 'function') {
            this.game.asset.onFileComplete.add(this._transition.preloadHandler.loadProgress, this._transition.preloadHandler);
        }

        this.game.asset.onLoadCompleteAndAudioDecoded.addOnce(this._preloadComplete, this);
        this.onTransitionInComplete.dispatch();

        this.game.changeState(this._toState);
    }

    private _transitionOutComplete() {
        this._transition = null;
        this.onTransitionOutComplete.dispatch();
    }

    private _preloadComplete() {
        this._transition = this._getTransition(this._fromState, this._toState);
        if (!this._transition)
            return false;

        this.game.asset.onFileComplete.remove(this._transition.preloadHandler.loadProgress, this._transition.preloadHandler);

        if (typeof this._transition.preloadHandler.loadComplete === 'function')
            this._transition.preloadHandler.loadComplete();
    }

    private _clearTransition() {
        this._transition.outHandler.transitionInComplete.remove(this._transitionOutComplete, this);
        this._transition.inHandler.transitionOutComplete.remove(this._transitionInComplete, this);
        this.game.asset.onLoadCompleteAndAudioDecoded.remove(this._preloadComplete, this);
        this.game.asset.onLoadStart.remove(this._transition.preloadHandler.loadStart, this._transition.preloadHandler);
        this.game.asset.onFileComplete.remove(this._transition.preloadHandler.loadProgress, this._transition.preloadHandler);

        this._transition = null;
    }

    // public methods

    /**
    * Adds a transition handler for a specific from / to state combination
    * pass the from / to states as the first 2 arguments, and additional arguments for which instance will handle the transition
    * if only 3 args are passed, the instance will handle the in / out transition, and the preloading
    * E.G.
    * this.game.transition.add(this.game.constants.STATE_PRELOAD, this.game.constants.STATE_MENU, this.game.preloader);
    *
    * if 5 arguments are passed, a different instance can be used for in transition, preloading, and out transition
    * E.G.
    * this.game.transition.add(this.game.constants.STATE_PRELOAD, this.game.constants.STATE_MENU, this.game.transitionOutHandler, this.game.preloadHandler, this.game.transitionInHandler);
    *
    * transition handlers are expected to behave as follows:
    * an out transition handler should have a transitionIn method and dispatch a transitionComplete signal when done
    * an in transition handler should have a transitionOut method and dispatch a transitionCOmplete signal when done
    * a preload handler should have loadStart, loadProgress, and loadComplete methods
    * the loadProgress method may accept a up to 4 parameters for progress (percent of files loaded), id, fileIndex, and totalFiles
    *
    * @param {string} fromState - the state being transitioned from
    * @param {string} toState - the state being transitioned to
    * @param {outHandler} outHandler - the instance that will handle the transition from the fromState
    * @param {preloadHandler} preloadHandler - the instance that will handle preloading the toState
    * @param {inHandler} inHandler - the instance that will handle the in transition when the toState is completely loaded
    * @return {Object} transition reference that was added to _transitions
    */
    public add(fromState: string, toState: string | IPreloadHandler, outHandler?: ITransitionHandler, preloadHandler?: IPreloadHandler, inHandler?: ITransitionHandler): void {
        var args;
        if (arguments.length < 5) {
            if (fromState === 'all') {
                args = [].slice.call(arguments, 1);
                if (arguments.length === 2)
                    return this._add('all', args[0], args[0], args[0]);
                else
                    return this._add('all', args[0], args[1], args[2]);
            } else {
                args = [].slice.call(arguments, 2);
                return this._add(fromState + '/' + toState, args[0], args[0], args[0]);
            }
        }

        return this._add(fromState + '/' + toState, outHandler, preloadHandler, inHandler);
    }

    public addAll(handler: IPreloadHandler): void {
        return this._add('all', handler, handler, handler);
    }

    /**
    * Adds an exception to the Dijon.TransitionManager in the case where 'all' has been used
    * @param {string} state - the state to add the exception for
    */
    public addException(state: string) {
        this._exceptions[state] = true;
    }

    /**
    * Removes a transition handler for a specific from / to state combination
    */
    public remove(fromState: string, toState?: string) {
        if (arguments.length === 1) {
            this._transitions[fromState] = null;
            delete this._transitions[fromState];
        } else {
            this._transitions[fromState + '/' + toState] = null;
            delete this._transitions[fromState + '/' + toState];
        }
    }

    /**
    * Start the transition to a new state
    * @param {string} state - the state to transition to
    */
    public to(state: string) {
        if (this._transition)
            this._clearTransition();

        if (this._exceptions[state])
            return;

        this._fromState = this.game.state.current;
        this._toState = state;

        this._transition = this._getTransition(this._fromState, this._toState);

        if (!this._transition) {
            console.log('no transition found for:', this.game.state.current + ' to ' + state);
            this.game.changeState(this._toState);
        }

        this.transitionIn();
    }

    public transitionIn() {
        if (!this._transition)
            return;

        if (typeof this._transition.outHandler.transitionIn === 'function') {
            this._transition.outHandler.transitionInComplete.addOnce(this._transitionInComplete, this);
            this._transition.outHandler.transitionIn();
        }
    }

    public canTransitionOut(): boolean {
        return !this._exceptions[this.game.state.current] && this._transition && this._transition.inHandler && typeof this._transition.inHandler.transitionOut === 'function';
    }

    /**
    * After the state is fully loaded and 'built' a call to this is made
    * this is currently made from BaseState in the 'afterBuild' method
    */
    public transitionOut() {
        this._transition.inHandler.transitionOutComplete.addOnce(this._transitionOutComplete, this);
        this._transition.inHandler.transitionOut();
    }
}