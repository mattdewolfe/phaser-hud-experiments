import {IBrowser} from './interfaces';
import {Application} from "./application";
import {Game} from "./core";
import {Text} from "./display";

export class Util {
    public static isNumber(value: string): boolean {
        return (+value === +value);
    }
}


export class Logger {
    public static enabled: boolean = true;
    public static log(instance, ...args) {
        if (!Logger.enabled) { 
            return;
        }
        if (instance && instance.constructor) {
            args.unshift(instance.constructor.toString().match(/\w+/g)[1] + ' ::');
        }
        return console.log.apply(console, args); 
    }
}


export class Device {
    public static IOS: string = 'iOS';
    public static ANDROID: string = 'android';
    public static UNKNOWN: string = 'unknown';

    public static get mobile(): boolean {
        return Device.mobileOS !== Device.UNKNOWN;
    }

    public static get cocoon(): boolean {
        return (typeof navigator['isCocoonJS'] !== "undefined");
    }

    public static get mobileOS() {
        const userAgent = window.navigator.userAgent || window.navigator.vendor || window['opera'];
        if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
            return Device.IOS;
        } else if (userAgent.match(/Android/i)) {
            return Device.ANDROID;
        } else {
            return Device.UNKNOWN;
        }
    }

    public static get browser(): IBrowser {
        const ua: string = navigator.userAgent.toLowerCase();
        return {
            firefox: ua.indexOf('firefox') > -1,
            ie: ua.indexOf('ie') > -1,
            safari: ua.indexOf('safari') > -1,
            chrome: ua.indexOf('chrome') > -1,
        }
    }

    public static get pixelRatio() {
        return typeof window.devicePixelRatio !== undefined ? window.devicePixelRatio : 1;
    }

    public static get customPixelRatio() {
        return Device.pixelRatio >= 1.5 ? 2 : 1;
    }
}

export class Textures {
    private static get game(): Phaser.Game {
        return Application.getInstance().game;
    }

    static rect(width: number = 100, height: number = 100, color: number = 0xffffff, alpha: number = 1, fill: boolean = true, lineColor: number = 0xffffff, lineThickness: number = 1, lineAlpha: number = 1, outline: boolean = false): PIXI.Texture {
        const gfx = Textures.game.add.graphics(0, 0);
        if (fill) {
            gfx.beginFill(color, alpha);
        }
        if (outline) {
            gfx.lineWidth = lineThickness;
            gfx.lineStyle(lineThickness, lineColor, lineAlpha);
        }
        gfx.drawRect(0, 0, width, height);

        const texture = gfx.generateTexture();
        Textures.game.world.remove(gfx);

        return texture;
    }

    static roundedRect(width: number = 100, height: number = 100, radius: number = 10, color: number = 0xffffff, alpha: number = 1, fill: boolean = true, lineColor: number = 0xffffff, lineThickness: number = 1, lineAlpha: number = 1, outline: boolean = false): PIXI.Texture {
        const gfx = Textures.game.add.graphics(0, 0);
        if (fill) {
            gfx.beginFill(color, alpha);
        }
        if (outline) {
            gfx.lineWidth = lineThickness;
            gfx.lineStyle(lineThickness, lineColor, lineAlpha);
        }
        gfx.drawRoundedRect(0, 0, width, height, radius);

        const texture = gfx.generateTexture();
        Textures.game.world.remove(gfx);

        return texture;
    }

    static square(size: number = 100, color: number = 0xffffff, alpha: number = 1, fill: boolean = true, lineColor: number = 0xffffff, lineThickness: number = 1, lineAlpha: number = 1, outline: boolean = false): PIXI.Texture {
        return Textures.rect(size, size, color, alpha, fill, lineColor, lineThickness, lineAlpha, outline);
    }

    static circle(diameter: number = 100, color: number = 0xffffff, alpha: number = 1, fill: boolean = true, lineColor: number = 0xffffff, lineThickness: number = 1, lineAlpha: number = 1, outline: boolean = false): PIXI.Texture {
        const gfx = Textures.game.add.graphics(0, 0);
        if (fill) {
            gfx.beginFill(color, alpha);
        }
        if (outline) {
            gfx.lineWidth = lineThickness;
            gfx.lineStyle(lineThickness, lineColor, lineAlpha);
        }
        gfx.drawCircle(0, 0, diameter);

        const texture = gfx.generateTexture();
        Textures.game.world.remove(gfx);

        return texture;
    }

    static ellipse(width: number = 50, height: number = 100, color: number = 0xffffff, alpha: number = 1, fill: boolean = true, lineColor: number = 0xffffff, lineThickness: number = 1, lineAlpha: number = 1, outline: boolean = false): PIXI.Texture {
        const gfx = Textures.game.add.graphics(0, 0);
        if (fill) {
            gfx.beginFill(color, alpha);
        }
        if (outline) {
            gfx.lineWidth = lineThickness;
            gfx.lineStyle(lineThickness, lineColor, lineAlpha);
        }
        gfx.drawEllipse(0, 0, width * 0.5, height * 0.5);

        const texture = gfx.generateTexture();
        Textures.game.world.remove(gfx);

        return texture;
    }
}

export class Placeholders {
    private static get game(): Phaser.Game {
        return Application.getInstance().game;
    }

    static image(x: number = 0, y: number = 0, texture: any, name: string = ""): Phaser.Image {
        const imageInstance = new Phaser.Image(Placeholders.game, x, y, texture);
        imageInstance.name = name;
        return imageInstance;
    }

    static button(x: number = 0, y: number = 0, width: number = 100, height: number = 50, autoSize: boolean = false, text: string = 'button', callback: Function = null, callbackContext: any = null, defaultColor: number = 0xffffff, overColor: number = 0xff0000, downColor: number = 0x00ff00): Phaser.Sprite {
        const sprite: Phaser.Sprite = new Phaser.Sprite(Placeholders.game, x, y);

        // Create the text instance with an auto size of 25 or 60% of the height passed in.
        const textInstance: Text = new Text(width * 0.5, height * 0.55, " " + text + " ", 'Arial', autoSize ? 25 : height * 0.6, '#000000');
        textInstance.centerPivot();
        textInstance.name = "Label";

        if (autoSize) {
            // Use a padding of 10
            width = textInstance.width + 10;
            height = textInstance.height + 10;
            // Update the text position
            textInstance.position.set(width * 0.5, height * 0.55);
        }

        const upImage: Phaser.Image = Placeholders.image(0, 0, Textures.roundedRect(width, height, 10, defaultColor), "Up");
        const overImage: Phaser.Image = Placeholders.image(0, 0, Textures.roundedRect(width, height, 10, overColor), "Over");
        const downImage: Phaser.Image = Placeholders.image(0, 0, Textures.roundedRect(width, height, 10, downColor), "Down");


        overImage.visible = false;
        downImage.visible = false;

        sprite.addChild(upImage);
        sprite.addChild(overImage);
        sprite.addChild(downImage);
        sprite.addChild(textInstance);

        sprite.inputEnabled = true;
        sprite.input.useHandCursor = true;

        sprite.events.onInputUp.add(() => {
            downImage.visible = false;
            overImage.visible = false;
            upImage.visible = true;

            if (callback) {
                callback.call(callbackContext);
            }
        });

        sprite.events.onInputDown.add(() => {
            downImage.visible = true;
            overImage.visible = false;
            upImage.visible = false;
        });

        sprite.events.onInputOver.add(() => {
            downImage.visible = false;
            overImage.visible = true;
            upImage.visible = false;
        });

        sprite.events.onInputOut.add(() => {
            downImage.visible = false;
            overImage.visible = false;
            upImage.visible = true;
        });

        sprite.getBounds = function(): PIXI.Rectangle {
            return new PIXI.Rectangle(0, 0, upImage.width, upImage.height);
        }
        return sprite;
    }
}

export class Notifications {
    public static ASSET_MANAGER_DATA_SET: string = 'dijonAssetManagerDataSet';
    public static ASSET_MANAGER_ASSETS_CLEARED: string = 'dijonAssetManagerAssetsCleared';

    public static MOUSE_LEAVE_GLOBAL: string = 'mouseOutGlobal';
    public static MOUSE_ENTER_GLOBAL: string = 'mouseEnterGlobal';
}