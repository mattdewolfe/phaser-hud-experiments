var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
System.register("model/GameModel", ['dijon/mvc'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var mvc_1;
    var GameModel;
    return {
        setters:[
            function (mvc_1_1) {
                mvc_1 = mvc_1_1;
            }],
        execute: function() {
            GameModel = (function (_super) {
                __extends(GameModel, _super);
                function GameModel() {
                    _super.apply(this, arguments);
                }
                Object.defineProperty(GameModel.prototype, "name", {
                    get: function () {
                        return GameModel.MODEL_NAME;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(GameModel.prototype, "gameData", {
                    get: function () {
                        return this._data;
                    },
                    enumerable: true,
                    configurable: true
                });
                GameModel.MODEL_NAME = "gameModel";
                return GameModel;
            }(mvc_1.Model));
            exports_1("default", GameModel);
        }
    }
});
System.register("mediator/BaseMediator", ["dijon/mvc", "dijon/application", "model/GameModel"], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var mvc_2, application_1, GameModel_1;
    var BaseMediator;
    return {
        setters:[
            function (mvc_2_1) {
                mvc_2 = mvc_2_1;
            },
            function (application_1_1) {
                application_1 = application_1_1;
            },
            function (GameModel_1_1) {
                GameModel_1 = GameModel_1_1;
            }],
        execute: function() {
            BaseMediator = (function (_super) {
                __extends(BaseMediator, _super);
                function BaseMediator() {
                    _super.apply(this, arguments);
                }
                BaseMediator.prototype.getCopy = function (groupId, textId) {
                    return this.copyModel.getCopy(groupId, textId);
                };
                Object.defineProperty(BaseMediator.prototype, "gameModel", {
                    get: function () {
                        return application_1.Application.getInstance().retrieveModel(GameModel_1.default.MODEL_NAME);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BaseMediator.prototype, "copyModel", {
                    get: function () {
                        return application_1.Application.getInstance().retrieveModel(mvc_2.CopyModel.MODEL_NAME);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BaseMediator.prototype, "name", {
                    get: function () {
                        return "baseMediator_" + this.game.rnd.uuid();
                    },
                    enumerable: true,
                    configurable: true
                });
                return BaseMediator;
            }(mvc_2.Mediator));
            exports_2("default", BaseMediator);
        }
    }
});
System.register("utils/Constants", [], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var Constants;
    return {
        setters:[],
        execute: function() {
            Constants = (function () {
                function Constants() {
                }
                Constants.STATE_BOOT = 'boot';
                Constants.STATE_PRELOAD = 'preload';
                Constants.STATE_MENU = 'menu';
                Constants.FONT_KOMIKAX = 'komikax';
                return Constants;
            }());
            exports_3("default", Constants);
        }
    }
});
System.register("utils/Notifications", [], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var Notifications;
    return {
        setters:[],
        execute: function() {
            Notifications = (function () {
                function Notifications() {
                }
                Notifications.BOOT_INIT = 'bootInit';
                Notifications.BOOT_COMPLETE = 'bootComplete';
                return Notifications;
            }());
            exports_4("default", Notifications);
        }
    }
});
System.register("mediator/ApplicationMediator", ["dijon/utils", "mediator/BaseMediator", "utils/Constants", "utils/Notifications"], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var utils_1, BaseMediator_1, Constants_1, Notifications_1;
    var ApplicationMediator;
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (BaseMediator_1_1) {
                BaseMediator_1 = BaseMediator_1_1;
            },
            function (Constants_1_1) {
                Constants_1 = Constants_1_1;
            },
            function (Notifications_1_1) {
                Notifications_1 = Notifications_1_1;
            }],
        execute: function() {
            ApplicationMediator = (function (_super) {
                __extends(ApplicationMediator, _super);
                function ApplicationMediator() {
                    _super.apply(this, arguments);
                }
                ApplicationMediator.prototype.listNotificationInterests = function () {
                    return [
                        Notifications_1.default.BOOT_INIT,
                        Notifications_1.default.BOOT_COMPLETE
                    ];
                };
                ApplicationMediator.prototype.handleNotification = function (notification) {
                    switch (notification.getName()) {
                        case Notifications_1.default.BOOT_INIT:
                            utils_1.Logger.log(this, 'Notifications.BOOT_INIT');
                            this.viewComponent.adjustScaleSettings();
                            this.viewComponent.adjustRendererSettings();
                            this.viewComponent.addPlugins();
                            break;
                        case Notifications_1.default.BOOT_COMPLETE:
                            utils_1.Logger.log(this, 'Notifications.BOOT_COMPLETE');
                            this.game.asset.setData(this.game.cache.getJSON('assets'));
                            this.viewComponent.registerModels();
                            this.game.transition.to(Constants_1.default.STATE_PRELOAD);
                            break;
                    }
                };
                Object.defineProperty(ApplicationMediator.prototype, "viewComponent", {
                    get: function () {
                        return this._viewComponent;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ApplicationMediator.prototype, "name", {
                    get: function () {
                        return ApplicationMediator.MEDIATOR_NAME;
                    },
                    enumerable: true,
                    configurable: true
                });
                ApplicationMediator.MEDIATOR_NAME = 'ApplicationMediator';
                return ApplicationMediator;
            }(BaseMediator_1.default));
            exports_5("default", ApplicationMediator);
        }
    }
});
System.register("state/BaseState", ["dijon/core"], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var core_1;
    var BaseState;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            BaseState = (function (_super) {
                __extends(BaseState, _super);
                function BaseState() {
                    _super.call(this);
                }
                return BaseState;
            }(core_1.State));
            exports_6("default", BaseState);
        }
    }
});
System.register("mediator/BootMediator", ["mediator/BaseMediator", "utils/Notifications"], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var BaseMediator_2, Notifications_2;
    var BootMediator;
    return {
        setters:[
            function (BaseMediator_2_1) {
                BaseMediator_2 = BaseMediator_2_1;
            },
            function (Notifications_2_1) {
                Notifications_2 = Notifications_2_1;
            }],
        execute: function() {
            BootMediator = (function (_super) {
                __extends(BootMediator, _super);
                function BootMediator() {
                    _super.apply(this, arguments);
                }
                BootMediator.prototype.onRegister = function () {
                    this.sendNotification(Notifications_2.default.BOOT_INIT);
                };
                BootMediator.prototype.bootComplete = function () {
                    this.sendNotification(Notifications_2.default.BOOT_COMPLETE);
                };
                Object.defineProperty(BootMediator.prototype, "name", {
                    get: function () {
                        return BootMediator.MEDIATOR_NAME;
                    },
                    enumerable: true,
                    configurable: true
                });
                BootMediator.MEDIATOR_NAME = 'bootMediator';
                return BootMediator;
            }(BaseMediator_2.default));
            exports_7("default", BootMediator);
        }
    }
});
System.register("state/Boot", ["state/BaseState", "mediator/BootMediator"], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var BaseState_1, BootMediator_1;
    var Boot;
    return {
        setters:[
            function (BaseState_1_1) {
                BaseState_1 = BaseState_1_1;
            },
            function (BootMediator_1_1) {
                BootMediator_1 = BootMediator_1_1;
            }],
        execute: function() {
            Boot = (function (_super) {
                __extends(Boot, _super);
                function Boot() {
                    _super.apply(this, arguments);
                }
                Boot.prototype.init = function () {
                    this._mediator = new BootMediator_1.default(this);
                };
                Boot.prototype.preload = function () {
                    if (window['version'] !== undefined) {
                        this.game.asset.cacheBustVersion = '@@version';
                    }
                    this.game.asset.loadJSON('game_data');
                    this.game.asset.loadJSON('assets');
                    this.game.asset.loadJSON('copy');
                    this.game.asset.loadBitmapFont('komikax');
                };
                Boot.prototype.buildInterface = function () {
                    this.mediator.bootComplete();
                };
                Object.defineProperty(Boot.prototype, "mediator", {
                    get: function () {
                        return this._mediator;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Boot;
            }(BaseState_1.default));
            exports_8("default", Boot);
        }
    }
});
System.register("mediator/PreloadMediator", ["utils/Constants", "mediator/BaseMediator"], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var Constants_2, BaseMediator_3;
    var PreloadMediator;
    return {
        setters:[
            function (Constants_2_1) {
                Constants_2 = Constants_2_1;
            },
            function (BaseMediator_3_1) {
                BaseMediator_3 = BaseMediator_3_1;
            }],
        execute: function() {
            PreloadMediator = (function (_super) {
                __extends(PreloadMediator, _super);
                function PreloadMediator() {
                    _super.apply(this, arguments);
                }
                PreloadMediator.prototype.next = function () {
                    this.game.transition.to(Constants_2.default.STATE_MENU);
                };
                Object.defineProperty(PreloadMediator.prototype, "name", {
                    get: function () {
                        return PreloadMediator.MEDIATOR_NAME;
                    },
                    enumerable: true,
                    configurable: true
                });
                PreloadMediator.MEDIATOR_NAME = 'preloadMediator';
                return PreloadMediator;
            }(BaseMediator_3.default));
            exports_9("default", PreloadMediator);
        }
    }
});
System.register("state/Preload", ["state/BaseState", "utils/Constants", "mediator/PreloadMediator"], function(exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var BaseState_2, Constants_3, PreloadMediator_1;
    var Preload;
    return {
        setters:[
            function (BaseState_2_1) {
                BaseState_2 = BaseState_2_1;
            },
            function (Constants_3_1) {
                Constants_3 = Constants_3_1;
            },
            function (PreloadMediator_1_1) {
                PreloadMediator_1 = PreloadMediator_1_1;
            }],
        execute: function() {
            Preload = (function (_super) {
                __extends(Preload, _super);
                function Preload() {
                    _super.apply(this, arguments);
                }
                Preload.prototype.init = function () {
                    this._mediator = new PreloadMediator_1.default(this);
                };
                Preload.prototype.preload = function () {
                    this.game.asset.loadAssets('required');
                };
                Preload.prototype.listBuildSequence = function () {
                    return [
                        this._addPreloader
                    ];
                };
                Preload.prototype.afterBuild = function () {
                };
                Preload.prototype._addPreloader = function () {
                    var test = this.add.dText(50, 150, this.mediator.getCopy('preload', 'title'), 'Arial', 45, '#ffffff'), bmText = this.add.bitmapText(50, 300, Constants_3.default.FONT_KOMIKAX, 'Bitmap font', 60), button = this.add.button(this.game.width - 250, 20, 'menu', this._next, this, 'next_button/over', 'next_button/up', 'next_button/down');
                };
                Preload.prototype._next = function () {
                    this.game.audio.playAudio('wyoming_roar');
                    this.mediator.next();
                };
                Object.defineProperty(Preload.prototype, "mediator", {
                    get: function () {
                        return this._mediator;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Preload;
            }(BaseState_2.default));
            exports_10("default", Preload);
        }
    }
});
System.register("mediator/MenuMediator", ["mediator/BaseMediator"], function(exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var BaseMediator_4;
    var MenuMediator;
    return {
        setters:[
            function (BaseMediator_4_1) {
                BaseMediator_4 = BaseMediator_4_1;
            }],
        execute: function() {
            MenuMediator = (function (_super) {
                __extends(MenuMediator, _super);
                function MenuMediator() {
                    _super.apply(this, arguments);
                }
                Object.defineProperty(MenuMediator.prototype, "name", {
                    get: function () {
                        return MenuMediator.MEDIATOR_NAME;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MenuMediator.prototype, "hudData", {
                    get: function () {
                        return this.gameModel.gameData.hud;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MenuMediator.prototype, "statData", {
                    get: function () {
                        return this.gameModel.gameData.main.stats;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MenuMediator.prototype, "worldData", {
                    get: function () {
                        return this.gameModel.gameData.main.world;
                    },
                    enumerable: true,
                    configurable: true
                });
                MenuMediator.MEDIATOR_NAME = 'menuMediator';
                return MenuMediator;
            }(BaseMediator_4.default));
            exports_11("default", MenuMediator);
        }
    }
});
System.register("hud/HUDElement", ['dijon/display'], function(exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var display_1;
    var HUDElement;
    return {
        setters:[
            function (display_1_1) {
                display_1 = display_1_1;
            }],
        execute: function() {
            HUDElement = (function (_super) {
                __extends(HUDElement, _super);
                function HUDElement(name, properties) {
                    _super.call(this, 0, 0, properties.texture, null, name);
                    if (properties.scale !== undefined) {
                        this.scale = new Phaser.Point(properties.scale.x, properties.scale.y);
                    }
                    if (properties.anchor !== undefined) {
                        this.anchor = new Phaser.Point(properties.anchor.x, properties.anchor.y);
                    }
                    this._parseProperties(properties);
                    this._currentValue = 0;
                }
                HUDElement.prototype._parseProperties = function (properties) {
                };
                HUDElement.prototype.updateElement = function (newStat) {
                    this._currentValue = newStat.current;
                };
                HUDElement.prototype.reposition = function (x, y) {
                    this.x = x - this.parent.x;
                    this.y = y - this.parent.y;
                };
                return HUDElement;
            }(display_1.Sprite));
            exports_12("HUDElement", HUDElement);
        }
    }
});
System.register("hud/HUDRegions", ['dijon/display'], function(exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var display_2;
    var HUDRegions, SingleRegion;
    return {
        setters:[
            function (display_2_1) {
                display_2 = display_2_1;
            }],
        execute: function() {
            HUDRegions = (function () {
                function HUDRegions(hud, camWidth, camHeight, camCenter, hudMargins) {
                    var horizontalWidth = (camWidth - (hudMargins.right + hudMargins.left)) / 3;
                    var middleWidth = camWidth * 0.1;
                    var middleHeight = camHeight - (hudMargins.bottom + hudMargins.top);
                    this.topLeft = new SingleRegion(hudMargins.left, hudMargins.top, horizontalWidth, 0, "TopLeft");
                    this.topCenter = new SingleRegion(camCenter.x - (horizontalWidth * 0.5), this.topLeft.y, horizontalWidth, 0, "TopCenter");
                    this.topRight = new SingleRegion(camWidth - hudMargins.right - horizontalWidth, this.topCenter.y, horizontalWidth, 0, "TopRight");
                    this.bottomLeft = new SingleRegion(hudMargins.left, camHeight - hudMargins.bottom, horizontalWidth, 0, "BottomLeft");
                    this.bottomCenter = new SingleRegion(this.bottomLeft.endX, this.bottomLeft.y, horizontalWidth, 0, "BottomCenter");
                    this.bottomRight = new SingleRegion(this.bottomCenter.endX, this.bottomCenter.y, horizontalWidth, 0, "BottomRight");
                    this.middleLeft = new SingleRegion(hudMargins.left, this.topLeft.endY, 0, this.bottomLeft.y - this.topLeft.endY, "MiddleLeft");
                    this.middleRight = new SingleRegion(camWidth - hudMargins.right, this.topRight.endY, 0, this.bottomRight.y - this.topRight.endY, "MiddleRight");
                    this.middleCenter = new SingleRegion(hudMargins.left, camCenter.y, camWidth - (hudMargins.right + hudMargins.left), 0, "MiddleCenter");
                    hud.addChild(this.topLeft);
                    hud.addChild(this.topCenter);
                    hud.addChild(this.topRight);
                    hud.addChild(this.middleLeft);
                    hud.addChild(this.middleCenter);
                    hud.addChild(this.middleRight);
                    hud.addChild(this.bottomLeft);
                    hud.addChild(this.bottomCenter);
                    hud.addChild(this.bottomRight);
                }
                HUDRegions.prototype.updateAllElementPositions = function () {
                    this.topLeft.updateAllElementPositions();
                    this.topCenter.updateAllElementPositions();
                    this.topRight.updateAllElementPositions();
                    this.middleLeft.updateAllElementPositions();
                    this.middleCenter.updateAllElementPositions();
                    this.middleRight.updateAllElementPositions();
                    this.bottomLeft.updateAllElementPositions();
                    this.bottomCenter.updateAllElementPositions();
                    this.bottomRight.updateAllElementPositions();
                };
                return HUDRegions;
            }());
            exports_13("default", HUDRegions);
            SingleRegion = (function (_super) {
                __extends(SingleRegion, _super);
                function SingleRegion(x, y, width, height, name) {
                    _super.call(this, x, y, name);
                    this.elements = [];
                    this.regionWidth = width;
                    this.regionHeight = height;
                    this._addDebugBox();
                }
                SingleRegion.prototype._addDebugBox = function () {
                    var gfx = this.game.add.graphics();
                    gfx.beginFill(Phaser.Color.getRandomColor(35, 100), 0.7);
                    gfx.drawRect(0, 0, this.regionWidth > 1 ? this.regionWidth : 2, this.regionHeight > 1 ? this.regionHeight : 2);
                    gfx.endFill();
                    this.addChild(new Phaser.Image(this.game, 0, 0, gfx.generateTexture()));
                    this.game.world.remove(gfx);
                };
                SingleRegion.prototype.updateAllElementPositions = function () {
                    var number_of_elements, step, position;
                    number_of_elements = this.elements.length;
                    if (number_of_elements === 1) {
                        this.elements[0].reposition(this.x + (this.regionWidth / 2), this.y + (this.regionHeight / 2));
                    }
                    else if (number_of_elements === 2) {
                        this.elements[0].reposition(this.x + (this.regionWidth * 0.25), this.y + (this.regionHeight * 0.25));
                        this.elements[1].reposition(this.x + (this.regionWidth * 0.75) - this.elements[1].realWidth, this.y + (this.regionHeight * 0.75));
                    }
                    else if (number_of_elements > 2) {
                        step = new Phaser.Point(this.regionWidth / number_of_elements, this.regionHeight / number_of_elements);
                        position = new Phaser.Point(this.x + (step.x * 0.5), this.y + (step.y * 0.5));
                        this.elements.forEach(function (element) {
                            element.reposition(position.x, position.y);
                            position.x += step.x;
                            position.y += step.y;
                        }, this);
                    }
                    this.elements.forEach(function (element) {
                        element.fixedToCamera = true;
                    }, this);
                };
                SingleRegion.prototype.randomColor = function () {
                    return 0x0f0f + Math.round(Math.random() * 10);
                };
                Object.defineProperty(SingleRegion.prototype, "centerX", {
                    get: function () {
                        return this.x + (this.regionWidth * 0.5);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SingleRegion.prototype, "centerY", {
                    get: function () {
                        return this.y + (this.regionHeight * 0.5);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SingleRegion.prototype, "endX", {
                    get: function () {
                        return this.x + this.regionWidth;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SingleRegion.prototype, "endY", {
                    get: function () {
                        return this.y + this.regionHeight;
                    },
                    enumerable: true,
                    configurable: true
                });
                SingleRegion.prototype.addElement = function (newElement) {
                    this.addChild(newElement);
                    this.elements.push(newElement);
                };
                return SingleRegion;
            }(display_2.Group));
        }
    }
});
System.register("stats/StatManager", ["stats/Stat"], function(exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var Stat_1;
    var StatManager;
    return {
        setters:[
            function (Stat_1_1) {
                Stat_1 = Stat_1_1;
            }],
        execute: function() {
            StatManager = (function () {
                function StatManager(inData) {
                    console.log(inData);
                    this._globalStats = [];
                    this._statData = {};
                    this._statData = inData;
                }
                StatManager.prototype.getNewStat = function (type, objType) {
                    var newStat = new Stat_1.default();
                    if (this._statData.hasOwnProperty(type)) {
                        newStat.initWithData(this._statData[type], type, objType, StatManager._currentID);
                        StatManager._currentID += 1;
                    }
                    return newStat;
                };
                StatManager.prototype.getStatsForCharacter = function (types, objType) {
                    var stats = [];
                    for (var i = 0; i < types.length; i++) {
                        var newStat = this.getNewStat(types[i], objType);
                        if (newStat.type !== "NONE") {
                            stats.push(newStat);
                            this._globalStats.push(newStat);
                        }
                    }
                    return stats;
                };
                StatManager.prototype.logAllStats = function () {
                    console.log(this._globalStats);
                };
                StatManager.prototype.setHUD = function (hud) {
                    Stat_1.default.hud = hud;
                };
                StatManager._currentID = 0;
                return StatManager;
            }());
            exports_14("StatManager", StatManager);
        }
    }
});
System.register("stats/Stat", [], function(exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    var Stat;
    return {
        setters:[],
        execute: function() {
            Stat = (function () {
                function Stat() {
                    this._type = "NONE";
                    this.min = 1;
                    this.max = 255;
                    this.current = 1;
                    this.next = 2;
                }
                Stat.prototype.initWithData = function (data, type, owningObj, id) {
                    this._type = owningObj + type;
                    this._id = id;
                    this.min = data.min;
                    this.max = data.max;
                    this.current = this.min;
                    this.next = this.current + 1;
                };
                Object.defineProperty(Stat.prototype, "id", {
                    get: function () {
                        return this._id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Stat.prototype, "type", {
                    get: function () {
                        return this._type;
                    },
                    enumerable: true,
                    configurable: true
                });
                Stat.prototype.resetStat = function (newVal) {
                    this.current = newVal;
                    this._clampAndNotifyHUD();
                };
                Stat.prototype.alterStat = function (increaseBy) {
                    this.current += increaseBy;
                    this._clampAndNotifyHUD();
                };
                Stat.prototype._clampAndNotifyHUD = function () {
                    if (this.current < this.min) {
                        this.current = this.min;
                    }
                    else if (this.current > this.max) {
                        this.current = this.max;
                    }
                    Stat.hud.notifyStatChange(this);
                };
                return Stat;
            }());
            exports_15("default", Stat);
        }
    }
});
System.register("hud/HUDStatWithBar", ["hud/HUDElement"], function(exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    var HUDElement_1;
    var HUDStatWithBar;
    return {
        setters:[
            function (HUDElement_1_1) {
                HUDElement_1 = HUDElement_1_1;
            }],
        execute: function() {
            HUDStatWithBar = (function (_super) {
                __extends(HUDStatWithBar, _super);
                function HUDStatWithBar(name, properties) {
                    _super.call(this, name, properties);
                    this._maxSize = 50;
                }
                HUDStatWithBar.prototype._parseProperties = function (properties) {
                    if (properties.barScaling !== undefined) {
                        this._scaleVector = new Phaser.Point(properties.barScaling.x, properties.barScaling.y);
                    }
                    if (properties.maxSize !== undefined) {
                        this._maxSize = properties.maxSize;
                    }
                };
                HUDStatWithBar.prototype.updateElement = function (newStat) {
                    var newScale = (newStat.current / newStat.max) * this._maxSize;
                    this.scale.setTo(this._scaleVector.x * newScale, this._scaleVector.y * newScale);
                };
                return HUDStatWithBar;
            }(HUDElement_1.HUDElement));
            exports_16("default", HUDStatWithBar);
        }
    }
});
System.register("hud/HUDStatWithText", ["hud/HUDElement"], function(exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    var HUDElement_2;
    var HUDStatWithText;
    return {
        setters:[
            function (HUDElement_2_1) {
                HUDElement_2 = HUDElement_2_1;
            }],
        execute: function() {
            HUDStatWithText = (function (_super) {
                __extends(HUDStatWithText, _super);
                function HUDStatWithText(name, properties) {
                    _super.call(this, name, properties);
                }
                return HUDStatWithText;
            }(HUDElement_2.HUDElement));
            exports_17("default", HUDStatWithText);
        }
    }
});
System.register("hud/HUD", ['dijon/display', "hud/HUDRegions", "hud/HUDElement", "hud/HUDStatWithBar", "hud/HUDStatWithText"], function(exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    var display_3, HUDRegions_1, HUDElement_3, HUDStatWithBar_1, HUDStatWithText_1;
    var HUD;
    return {
        setters:[
            function (display_3_1) {
                display_3 = display_3_1;
            },
            function (HUDRegions_1_1) {
                HUDRegions_1 = HUDRegions_1_1;
            },
            function (HUDElement_3_1) {
                HUDElement_3 = HUDElement_3_1;
            },
            function (HUDStatWithBar_1_1) {
                HUDStatWithBar_1 = HUDStatWithBar_1_1;
            },
            function (HUDStatWithText_1_1) {
                HUDStatWithText_1 = HUDStatWithText_1_1;
            }],
        execute: function() {
            HUD = (function (_super) {
                __extends(HUD, _super);
                function HUD(data) {
                    _super.call(this, 0, 0, "HUD");
                    this._prefabElements = {
                        "basic_element": HUDElement_3.HUDElement,
                        "stat_with_bar": HUDStatWithBar_1.default,
                        "stat_with_text": HUDStatWithText_1.default
                    };
                    this._data = data;
                    this._trackedStats = [];
                }
                HUD.prototype.init = function () {
                    var camWidth, camHeight, camCenter;
                    camWidth = this.game.camera.width;
                    camHeight = this.game.camera.height;
                    camCenter = new Phaser.Point(camWidth / 2, camHeight / 2);
                    this._regions = new HUDRegions_1.default(this, camWidth, camHeight, camCenter, this._data.margins);
                    this._createElements();
                };
                HUD.prototype._createElements = function () {
                    var elementName, elementParems, region, newElement;
                    for (elementName in this._data.elements) {
                        if (this._data.elements.hasOwnProperty(elementName)) {
                            elementParems = this._data.elements[elementName];
                            region = this._regions[elementParems.region];
                            newElement = this._createHUDElement(elementParems.type, elementName, elementParems.properties);
                            this._trackedStats.push(newElement);
                            region.addElement(newElement);
                        }
                    }
                    this._regions.updateAllElementPositions();
                };
                HUD.prototype._createHUDElement = function (type, name, properties) {
                    var newElement;
                    if (this._prefabElements.hasOwnProperty(type)) {
                        newElement = new this._prefabElements[type](name, properties);
                    }
                    else {
                        newElement = new this._prefabElements["basic_element"]("empty", { texture: "demon" });
                    }
                    return newElement;
                };
                HUD.prototype.notifyStatChange = function (stat) {
                    if (this._trackedStats.length > stat.id)
                        this._trackedStats[stat.id].updateElement(stat);
                };
                return HUD;
            }(display_3.Group));
            exports_18("default", HUD);
        }
    }
});
System.register("objects/BaseObject", ['dijon/display', "stats/Stat"], function(exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    var display_4, Stat_2;
    var BaseObject;
    return {
        setters:[
            function (display_4_1) {
                display_4 = display_4_1;
            },
            function (Stat_2_1) {
                Stat_2 = Stat_2_1;
            }],
        execute: function() {
            BaseObject = (function (_super) {
                __extends(BaseObject, _super);
                function BaseObject(name, x, y, key) {
                    _super.call(this, x, y, key);
                    this._stats = [];
                    this.name = name;
                }
                Object.defineProperty(BaseObject.prototype, "stats", {
                    get: function () {
                        return this._stats;
                    },
                    enumerable: true,
                    configurable: true
                });
                BaseObject.prototype.addStat = function (newStat) {
                    this._stats.push(newStat);
                };
                BaseObject.prototype.addAllStats = function (newStats) {
                    this._stats = newStats;
                };
                BaseObject.prototype.findStat = function (type) {
                    for (var i = 0; i < this._stats.length; i++) {
                        if (this._stats[i].type === type) {
                            return this._stats[i];
                        }
                    }
                    console.error("Specified stat not found, returning an empty Stat");
                    return new Stat_2.default();
                };
                BaseObject.prototype.retrieveCurrentValue = function (type) {
                    return this.findStat(type).current;
                };
                BaseObject.prototype.retrieveMaxValue = function (type) {
                    return this.findStat(type).max;
                };
                BaseObject.prototype.retrieveMinValue = function (type) {
                    return this.findStat(type).min;
                };
                BaseObject.prototype.resetStat = function (type, newValue) {
                    var stat = this.findStat(type);
                    if (stat.type !== "EMPTY") {
                        stat.resetStat(newValue);
                    }
                };
                BaseObject.prototype.alterStat = function (type, increaseBy) {
                    var stat = this.findStat(type);
                    if (stat.type !== "EMPTY") {
                        stat.alterStat(increaseBy);
                    }
                };
                return BaseObject;
            }(display_4.Sprite));
            exports_19("BaseObject", BaseObject);
        }
    }
});
System.register("objects/Character", ["objects/BaseObject"], function(exports_20, context_20) {
    "use strict";
    var __moduleName = context_20 && context_20.id;
    var BaseObject_1;
    var Character;
    return {
        setters:[
            function (BaseObject_1_1) {
                BaseObject_1 = BaseObject_1_1;
            }],
        execute: function() {
            Character = (function (_super) {
                __extends(Character, _super);
                function Character(data) {
                    _super.call(this, data.name, data.x, data.y, data.key);
                }
                return Character;
            }(BaseObject_1.BaseObject));
            exports_20("default", Character);
        }
    }
});
System.register("objects/Hero", ["objects/Character"], function(exports_21, context_21) {
    "use strict";
    var __moduleName = context_21 && context_21.id;
    var Character_1;
    var Hero;
    return {
        setters:[
            function (Character_1_1) {
                Character_1 = Character_1_1;
            }],
        execute: function() {
            Hero = (function (_super) {
                __extends(Hero, _super);
                function Hero(data) {
                    _super.call(this, data);
                    this._upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
                    this._downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
                    this._leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
                    this._rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
                }
                Hero.prototype.update = function () {
                    if (this._upKey.isDown) {
                        this.y -= 2;
                    }
                    if (this._downKey.isDown) {
                        this.y += 2;
                    }
                    if (this._leftKey.isDown) {
                        this.x -= 2;
                    }
                    if (this._rightKey.isDown) {
                        this.x += 2;
                    }
                };
                return Hero;
            }(Character_1.default));
            exports_21("default", Hero);
        }
    }
});
System.register("state/Menu", ["state/BaseState", "mediator/MenuMediator", "hud/HUD", "stats/StatManager", "objects/Character", "objects/Hero"], function(exports_22, context_22) {
    "use strict";
    var __moduleName = context_22 && context_22.id;
    var BaseState_3, MenuMediator_1, HUD_1, StatManager_1, Character_2, Hero_1;
    var Menu;
    return {
        setters:[
            function (BaseState_3_1) {
                BaseState_3 = BaseState_3_1;
            },
            function (MenuMediator_1_1) {
                MenuMediator_1 = MenuMediator_1_1;
            },
            function (HUD_1_1) {
                HUD_1 = HUD_1_1;
            },
            function (StatManager_1_1) {
                StatManager_1 = StatManager_1_1;
            },
            function (Character_2_1) {
                Character_2 = Character_2_1;
            },
            function (Hero_1_1) {
                Hero_1 = Hero_1_1;
            }],
        execute: function() {
            Menu = (function (_super) {
                __extends(Menu, _super);
                function Menu() {
                    _super.apply(this, arguments);
                }
                Menu.prototype.init = function () {
                    this._mediator = new MenuMediator_1.default();
                };
                Menu.prototype.preload = function () {
                };
                Menu.prototype.listBuildSequence = function () {
                    return [
                        this._createSystems,
                        this._createWorld,
                        this._addText
                    ];
                };
                Menu.prototype.afterBuild = function () {
                    _super.prototype.afterBuild.call(this);
                };
                Menu.prototype._createSystems = function () {
                    this.statManager = new StatManager_1.StatManager(this.mediator.statData);
                    this.hud = new HUD_1.default(this.mediator.hudData);
                    this.statManager.setHUD(this.hud);
                    this.hud.init();
                    this.game.addToUI.existing(this.hud);
                    this.input.onDown.add(this.statManager.logAllStats, this.statManager);
                };
                Menu.prototype._createWorld = function () {
                    var worldData = this.mediator.worldData;
                    for (var i = 0; i < worldData.level1.length; i++) {
                        var newData = {};
                        var baseData = worldData.objects[worldData.level1[i].type];
                        newData.stats = baseData.stats;
                        newData.key = baseData.key;
                        newData.name = worldData.level1[i].type;
                        newData.x = worldData.level1[i].x;
                        newData.y = worldData.level1[i].y;
                        var newCharacter = this._spawnObject(newData);
                        this.game.addToGame.existing(newCharacter);
                    }
                };
                Menu.prototype._addText = function () {
                    var text = this.add.dText(200, 200, 'HUD Test', 'Arial', 36, '#ffffff');
                };
                Menu.prototype._updateStats = function () {
                };
                Menu.prototype._spawnObject = function (data) {
                    var newObj = data.name === "hero" ? new Hero_1.default(data) : new Character_2.default(data);
                    console.log("Spawning a " + data.name);
                    newObj.addAllStats(this.statManager.getStatsForCharacter(data.stats, newObj.name));
                    return newObj;
                };
                Object.defineProperty(Menu.prototype, "mediator", {
                    get: function () {
                        return this._mediator;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Menu;
            }(BaseState_3.default));
            exports_22("default", Menu);
        }
    }
});
System.register("HUDApplication", ["dijon/application", "dijon/core", "dijon/utils", "dijon/mvc", "mediator/ApplicationMediator", "utils/Constants", "state/Boot", "state/Preload", "state/Menu", "model/GameModel"], function(exports_23, context_23) {
    "use strict";
    var __moduleName = context_23 && context_23.id;
    var application_2, core_2, utils_2, mvc_3, ApplicationMediator_1, Constants_4, Boot_1, Preload_1, Menu_1, GameModel_2;
    var HUDApplication;
    return {
        setters:[
            function (application_2_1) {
                application_2 = application_2_1;
            },
            function (core_2_1) {
                core_2 = core_2_1;
            },
            function (utils_2_1) {
                utils_2 = utils_2_1;
            },
            function (mvc_3_1) {
                mvc_3 = mvc_3_1;
            },
            function (ApplicationMediator_1_1) {
                ApplicationMediator_1 = ApplicationMediator_1_1;
            },
            function (Constants_4_1) {
                Constants_4 = Constants_4_1;
            },
            function (Boot_1_1) {
                Boot_1 = Boot_1_1;
            },
            function (Preload_1_1) {
                Preload_1 = Preload_1_1;
            },
            function (Menu_1_1) {
                Menu_1 = Menu_1_1;
            },
            function (GameModel_2_1) {
                GameModel_2 = GameModel_2_1;
            }],
        execute: function() {
            HUDApplication = (function (_super) {
                __extends(HUDApplication, _super);
                function HUDApplication() {
                    _super.call(this);
                    this.gameId = null;
                }
                HUDApplication.prototype.createGame = function () {
                    this.game = new core_2.Game({
                        width: this._getGameWidth(),
                        height: this._getGameHeight(),
                        parent: 'game-container',
                        renderer: utils_2.Device.cocoon ? Phaser.CANVAS : this._getRendererByDevice(),
                        transparent: false,
                        resolution: 1,
                        plugins: utils_2.Device.mobile ? [] : ['Debug']
                    });
                    this._mediator = new ApplicationMediator_1.default(this);
                    this._addStates();
                };
                HUDApplication.prototype.startGame = function () {
                    this.game.state.start(Constants_4.default.STATE_BOOT);
                };
                HUDApplication.prototype.bootComplete = function () {
                    this.game.transition.to(Constants_4.default.STATE_PRELOAD);
                };
                HUDApplication.prototype.adjustScaleSettings = function () {
                    if (utils_2.Device.cocoon) {
                        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                        this.game.scale.pageAlignHorizontally = true;
                        this.game.scale.pageAlignVertically = true;
                    }
                    else {
                        if (this.game.device.desktop) {
                            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                            this.game.scale.setMinMax(512, 384, 1024, 768);
                            this.game.scale.pageAlignHorizontally = true;
                        }
                        else {
                            this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
                        }
                        this.game.scale.forceLandscape = true;
                        this.game.scale.refresh();
                    }
                };
                HUDApplication.prototype.adjustRendererSettings = function () {
                    this.game.stage.disableVisibilityChange = true;
                    this.game.forceSingleUpdate = true;
                };
                HUDApplication.prototype.registerModels = function () {
                    var gameModel = new GameModel_2.default('game_data');
                    var copyModel = new mvc_3.CopyModel('copy');
                };
                HUDApplication.prototype._addStates = function () {
                    this.game.state.add(Constants_4.default.STATE_BOOT, Boot_1.default);
                    this.game.state.add(Constants_4.default.STATE_PRELOAD, Preload_1.default);
                    this.game.state.add(Constants_4.default.STATE_MENU, Menu_1.default);
                };
                HUDApplication.prototype._getGameWidth = function () {
                    return utils_2.Device.cocoon ? window.innerWidth : 1024;
                };
                HUDApplication.prototype._getGameHeight = function () {
                    return utils_2.Device.cocoon ? window.innerHeight : 768;
                };
                HUDApplication.prototype._getResolution = function () {
                    if (application_2.Application.queryVar('resolution') && !isNaN(application_2.Application.queryVar('resolution'))) {
                        return application_2.Application.queryVar('resolution');
                    }
                    if (utils_2.Device.cocoon) {
                        return (window.devicePixelRatio > 1 ? 2 : 1);
                    }
                    else {
                        return utils_2.Device.mobile ? 1 : (window.devicePixelRatio > 1 ? 2 : 1);
                    }
                };
                HUDApplication.prototype._getRendererByDevice = function () {
                    return utils_2.Device.mobile && window.devicePixelRatio < 2 ? Phaser.CANVAS : Phaser.AUTO;
                };
                Object.defineProperty(HUDApplication.prototype, "mediator", {
                    get: function () {
                        return this._mediator;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(HUDApplication.prototype, "gameModel", {
                    get: function () {
                        return this.retrieveModel(GameModel_2.default.MODEL_NAME);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(HUDApplication.prototype, "copyModel", {
                    get: function () {
                        return this.retrieveModel(mvc_3.CopyModel.MODEL_NAME);
                    },
                    enumerable: true,
                    configurable: true
                });
                return HUDApplication;
            }(application_2.Application));
            exports_23("default", HUDApplication);
        }
    }
});
System.register("bootstrap", ["HUDApplication"], function(exports_24, context_24) {
    "use strict";
    var __moduleName = context_24 && context_24.id;
    var HUDApplication_1;
    var app;
    return {
        setters:[
            function (HUDApplication_1_1) {
                HUDApplication_1 = HUDApplication_1_1;
            }],
        execute: function() {
            exports_24("app", app = new HUDApplication_1.default());
        }
    }
});
System.register("stats/CharacterStats", ["stats/Stat"], function(exports_25, context_25) {
    "use strict";
    var __moduleName = context_25 && context_25.id;
    var Stat_3;
    var CharacterStats;
    return {
        setters:[
            function (Stat_3_1) {
                Stat_3 = Stat_3_1;
            }],
        execute: function() {
            CharacterStats = (function () {
                function CharacterStats() {
                    this.stats = [];
                }
                CharacterStats.prototype.addStat = function (newStat) {
                    this.stats.push(newStat);
                };
                CharacterStats.prototype.findStat = function (type) {
                    for (var i = 0; i < this.stats.length; i++) {
                        if (this.stats[i].type === type) {
                            return this.stats[i];
                        }
                    }
                    console.error("Specified stat not found, returning an empty Stat");
                    return new Stat_3.default();
                };
                CharacterStats.prototype.retrieveCurrentValue = function (type) {
                    return this.findStat(type).current;
                };
                CharacterStats.prototype.retrieveMaxValue = function (type) {
                    return this.findStat(type).max;
                };
                CharacterStats.prototype.retrieveMinValue = function (type) {
                    return this.findStat(type).min;
                };
                return CharacterStats;
            }());
            exports_25("default", CharacterStats);
        }
    }
});
System.register("ui/Preloader", ['dijon/display'], function(exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
    var display_5;
    var Preloader;
    return {
        setters:[
            function (display_5_1) {
                display_5 = display_5_1;
            }],
        execute: function() {
            Preloader = (function (_super) {
                __extends(Preloader, _super);
                function Preloader(x, y, name) {
                    _super.call(this, x, y, name, true);
                    this.transitionInComplete = new Phaser.Signal();
                    this.transitionOutComplete = new Phaser.Signal();
                    this.init();
                    this.buildInterface();
                }
                Preloader.prototype.buildInterface = function () {
                    this._loadText = this.addInternal.dText(50, 50, 'Loading ... ', 'Arial', 36, '#FFFFFF');
                    var gfx = this.game.add.graphics();
                    gfx.beginFill(0x000000, 1);
                    gfx.drawRect(0, 0, this.game.width, this.game.height);
                    gfx.endFill();
                    this._wiper = this.addInternal.image(0, 0, gfx.generateTexture());
                    this.game.world.remove(gfx, true);
                    this.alpha = 0;
                    this.visible = false;
                    this._inTween = this.game.add.tween(this).to({ alpha: 1 }, 300, Phaser.Easing.Quadratic.Out);
                    this._outTween = this.game.add.tween(this).to({ alpha: 0 }, 200, Phaser.Easing.Quadratic.In);
                    this._inTween.onComplete.add(this._in, this);
                    this._outTween.onComplete.add(this._out, this);
                };
                Preloader.prototype.loadStart = function () {
                };
                Preloader.prototype.loadProgress = function (progress) {
                    var roundedProgress = Math.round(progress).toString();
                    this._loadText.setText('Loading ... ' + roundedProgress + '%');
                };
                Preloader.prototype.loadComplete = function () {
                };
                Preloader.prototype.transitionIn = function () {
                    this.visible = true;
                    this._inTween.start();
                };
                Preloader.prototype.transitionOut = function () {
                    this._outTween.start();
                };
                Preloader.prototype._in = function () {
                    this.transitionInComplete.dispatch();
                };
                Preloader.prototype._out = function () {
                    this.visible = false;
                    this.transitionOutComplete.dispatch();
                };
                Preloader.TEST = 1;
                Preloader.TEST_2 = 2;
                return Preloader;
            }(display_5.Group));
            exports_26("default", Preloader);
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZGVsL0dhbWVNb2RlbC50cyIsIm1lZGlhdG9yL0Jhc2VNZWRpYXRvci50cyIsInV0aWxzL0NvbnN0YW50cy50cyIsInV0aWxzL05vdGlmaWNhdGlvbnMudHMiLCJtZWRpYXRvci9BcHBsaWNhdGlvbk1lZGlhdG9yLnRzIiwic3RhdGUvQmFzZVN0YXRlLnRzIiwibWVkaWF0b3IvQm9vdE1lZGlhdG9yLnRzIiwic3RhdGUvQm9vdC50cyIsIm1lZGlhdG9yL1ByZWxvYWRNZWRpYXRvci50cyIsInN0YXRlL1ByZWxvYWQudHMiLCJtZWRpYXRvci9NZW51TWVkaWF0b3IudHMiLCJodWQvSFVERWxlbWVudC50cyIsImh1ZC9IVURSZWdpb25zLnRzIiwic3RhdHMvU3RhdE1hbmFnZXIudHMiLCJzdGF0cy9TdGF0LnRzIiwiaHVkL0hVRFN0YXRXaXRoQmFyLnRzIiwiaHVkL0hVRFN0YXRXaXRoVGV4dC50cyIsImh1ZC9IVUQudHMiLCJvYmplY3RzL0Jhc2VPYmplY3QudHMiLCJvYmplY3RzL0NoYXJhY3Rlci50cyIsIm9iamVjdHMvSGVyby50cyIsInN0YXRlL01lbnUudHMiLCJIVURBcHBsaWNhdGlvbi50cyIsImJvb3RzdHJhcC50cyIsInN0YXRzL0NoYXJhY3RlclN0YXRzLnRzIiwidWkvUHJlbG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7WUFFQTtnQkFBdUMsNkJBQUs7Z0JBQTVDO29CQUF1Qyw4QkFBSztnQkFVNUMsQ0FBQztnQkFQRyxzQkFBVywyQkFBSTt5QkFBZjt3QkFDSSxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztvQkFDaEMsQ0FBQzs7O21CQUFBO2dCQUVELHNCQUFXLCtCQUFRO3lCQUFuQjt3QkFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztvQkFDdEIsQ0FBQzs7O21CQUFBO2dCQVJhLG9CQUFVLEdBQVcsV0FBVyxDQUFDO2dCQVNuRCxnQkFBQztZQUFELENBVkEsQUFVQyxD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SSxFQUFFLFNBQVMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUM3RSxlQUFlLEVBQUUsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO29CQUN0QyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUN4RSxlQUFlLEVBQUUsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFDO29CQUN4QyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUMzRSxlQUFlLEVBQUUsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO29CQUd2QyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksWUFBWSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQ2pFLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztvQkFDNUQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFDL0UsQ0FBQyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDO29CQUMvRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksWUFBWSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFDN0QsUUFBUSxHQUFHLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFDO29CQUV4RSxHQUFHLENBQUMs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QUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDbkQsQ0FBQztnQkFHTSw2QkFBUyxHQUFoQjtnQkFDQSxDQUFDO2dCQUVNLGdDQUFZLEdBQW5CLFVBQW9CLFFBQWdCO29CQUNoQyxJQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUN4RCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxjQUFjLEdBQUcsZUFBZSxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUNuRSxDQUFDO2dCQUVNLGdDQUFZLEdBQW5CO2dCQUNBLENBQUM7Z0JBRU0sZ0NBQVksR0FBbkI7b0JBQ0ksSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7b0JBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQzFCLENBQUM7Z0JBRU0saUNBQWEsR0FBcEI7b0JBQ0ksSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDM0IsQ0FBQztnQkFHUyx1QkFBRyxHQUFiO29CQUNJLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDekMsQ0FBQztnQkFFUyx3QkFBSSxHQUFkO29CQUNJLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO29CQUNyQixJQUFJLENBQUMscUJBQXFCLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQzFDLENBQUM7Z0JBdEVNLGNBQUksR0FBVyxDQUFDLENBQUM7Z0JBQ2pCLGdCQUFNLEdBQVcsQ0FBQyxDQUFDO2dCQXNFOUIsZ0JBQUM7WUFBRCxDQXhFQSxBQXdFQyxDQXhFc0MsZUFBSyxHQXdFM0M7WUF4RUQsZ0NBd0VDLENBQUEiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtNb2RlbH0gZnJvbSAnZGlqb24vbXZjJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZU1vZGVsIGV4dGVuZHMgTW9kZWwge1xuICAgIHB1YmxpYyBzdGF0aWMgTU9ERUxfTkFNRTogc3RyaW5nID0gXCJnYW1lTW9kZWxcIjtcblxuICAgIHB1YmxpYyBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gR2FtZU1vZGVsLk1PREVMX05BTUU7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBnYW1lRGF0YSgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgICB9ICAgIFxufSIsImltcG9ydCB7TWVkaWF0b3IsIENvcHlNb2RlbH0gZnJvbSBcImRpam9uL212Y1wiO1xuaW1wb3J0IHtBcHBsaWNhdGlvbn0gZnJvbSBcImRpam9uL2FwcGxpY2F0aW9uXCI7XG5cbmltcG9ydCBHYW1lTW9kZWwgZnJvbSBcIi4uL21vZGVsL0dhbWVNb2RlbFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlTWVkaWF0b3IgZXh0ZW5kcyBNZWRpYXRvciB7XG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICAvLyBzbyBhbnkgbWVkaWF0b3IgZXh0ZW5kaW5nIEJhc2VNZWRpYXRvciBjYW4gZ2V0IGNvcHlcbiAgICBwdWJsaWMgZ2V0Q29weShncm91cElkOiBzdHJpbmcsIHRleHRJZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29weU1vZGVsLmdldENvcHkoZ3JvdXBJZCwgdGV4dElkKTtcbiAgICB9XG5cdFx0XG4gICAgLy8gZ2V0dGVyIC8gc2V0dGVyXG4gICAgLy8gb2ZmZXIgYWNjZXNzIHRvIHRoZSBHYW1lTW9kZWwgYW5kIENvcHlNb2RlbCBmcm9tIGFueSBtZWRpYXRvciBleHRlbmRpbmcgQmFzZU1lZGlhdG9yXG4gICAgcHVibGljIGdldCBnYW1lTW9kZWwoKTogR2FtZU1vZGVsIHtcbiAgICAgICAgcmV0dXJuIDxHYW1lTW9kZWw+QXBwbGljYXRpb24uZ2V0SW5zdGFuY2UoKS5yZXRyaWV2ZU1vZGVsKEdhbWVNb2RlbC5NT0RFTF9OQU1FKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGNvcHlNb2RlbCgpOiBDb3B5TW9kZWwge1xuICAgICAgICByZXR1cm4gPENvcHlNb2RlbD5BcHBsaWNhdGlvbi5nZXRJbnN0YW5jZSgpLnJldHJpZXZlTW9kZWwoQ29weU1vZGVsLk1PREVMX05BTUUpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgbmFtZSgpOiBzdHJpbmcgeyBcbiAgICAgICAgcmV0dXJuIFwiYmFzZU1lZGlhdG9yX1wiICsgdGhpcy5nYW1lLnJuZC51dWlkKCk7XG4gICAgfVxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnN0YW50cyB7XG4gICAgc3RhdGljIFNUQVRFX0JPT1Q6IHN0cmluZyA9ICdib290JztcbiAgICBzdGF0aWMgU1RBVEVfUFJFTE9BRDogc3RyaW5nID0gJ3ByZWxvYWQnO1xuICAgIHN0YXRpYyBTVEFURV9NRU5VOiBzdHJpbmcgPSAnbWVudSc7XG4gICAgLy8gZm9udHNcbiAgICBzdGF0aWMgRk9OVF9LT01JS0FYOiBzdHJpbmcgPSAna29taWtheCc7XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm90aWZpY2F0aW9ucyB7XG4gICAgc3RhdGljIEJPT1RfSU5JVDogc3RyaW5nID0gJ2Jvb3RJbml0JztcbiAgICBzdGF0aWMgQk9PVF9DT01QTEVURTogc3RyaW5nID0gJ2Jvb3RDb21wbGV0ZSc7XG59IiwiaW1wb3J0IHtMb2dnZXJ9IGZyb20gXCJkaWpvbi91dGlsc1wiO1xuaW1wb3J0IHtJTm90aWZpY2F0aW9ufSBmcm9tIFwiZGlqb24vaW50ZXJmYWNlc1wiO1xuXG5pbXBvcnQgQmFzZU1lZGlhdG9yIGZyb20gJy4vQmFzZU1lZGlhdG9yJztcbmltcG9ydCBDb25zdGFudHMgZnJvbSAnLi4vdXRpbHMvQ29uc3RhbnRzJztcbmltcG9ydCBOb3RpZmljYXRpb25zIGZyb20gJy4uL3V0aWxzL05vdGlmaWNhdGlvbnMnO1xuaW1wb3J0IEhVREFwcGxpY2F0aW9uIGZyb20gJy4uL0hVREFwcGxpY2F0aW9uJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXBwbGljYXRpb25NZWRpYXRvciBleHRlbmRzIEJhc2VNZWRpYXRvciB7XG4gICAgcHVibGljIHN0YXRpYyBNRURJQVRPUl9OQU1FOiBzdHJpbmcgPSAnQXBwbGljYXRpb25NZWRpYXRvcic7XG5cbiAgICAvLyBkaWpvbi5tdmMuTWVkaWF0b3Igb3ZlcnJpZGVzXG4gICAgcHVibGljIGxpc3ROb3RpZmljYXRpb25JbnRlcmVzdHMoKTogc3RyaW5nW10ge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgTm90aWZpY2F0aW9ucy5CT09UX0lOSVQsXG4gICAgICAgICAgICBOb3RpZmljYXRpb25zLkJPT1RfQ09NUExFVEVcbiAgICAgICAgXVxuICAgIH1cblxuICAgIHB1YmxpYyBoYW5kbGVOb3RpZmljYXRpb24obm90aWZpY2F0aW9uOiBJTm90aWZpY2F0aW9uKSB7XG4gICAgICAgIHN3aXRjaCAobm90aWZpY2F0aW9uLmdldE5hbWUoKSkge1xuICAgICAgICAgICAgY2FzZSBOb3RpZmljYXRpb25zLkJPT1RfSU5JVDpcbiAgICAgICAgICAgICAgICBMb2dnZXIubG9nKHRoaXMsICdOb3RpZmljYXRpb25zLkJPT1RfSU5JVCcpO1xuICAgICAgICAgICAgICAgIHRoaXMudmlld0NvbXBvbmVudC5hZGp1c3RTY2FsZVNldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy52aWV3Q29tcG9uZW50LmFkanVzdFJlbmRlcmVyU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdDb21wb25lbnQuYWRkUGx1Z2lucygpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBOb3RpZmljYXRpb25zLkJPT1RfQ09NUExFVEU6XG4gICAgICAgICAgICAgICAgTG9nZ2VyLmxvZyh0aGlzLCAnTm90aWZpY2F0aW9ucy5CT09UX0NPTVBMRVRFJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmFzc2V0LnNldERhdGEodGhpcy5nYW1lLmNhY2hlLmdldEpTT04oJ2Fzc2V0cycpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdDb21wb25lbnQucmVnaXN0ZXJNb2RlbHMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUudHJhbnNpdGlvbi50byhDb25zdGFudHMuU1RBVEVfUFJFTE9BRCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBnZXR0ZXIgLyBzZXR0ZXJcbiAgICBwdWJsaWMgZ2V0IHZpZXdDb21wb25lbnQoKTogSFVEQXBwbGljYXRpb24ge1xuICAgICAgICByZXR1cm4gPEhVREFwcGxpY2F0aW9uPnRoaXMuX3ZpZXdDb21wb25lbnQ7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBuYW1lKCk6c3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIEFwcGxpY2F0aW9uTWVkaWF0b3IuTUVESUFUT1JfTkFNRTtcbiAgICB9XG59IiwiaW1wb3J0IHtTdGF0ZX0gZnJvbSBcImRpam9uL2NvcmVcIjtcbmltcG9ydCBCYXNlTWVkaWF0b3IgZnJvbSBcIi4uL21lZGlhdG9yL0Jhc2VNZWRpYXRvclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlU3RhdGUgZXh0ZW5kcyBTdGF0ZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxufSIsImltcG9ydCBCYXNlTWVkaWF0b3IgZnJvbSAnLi9CYXNlTWVkaWF0b3InO1xuaW1wb3J0IE5vdGlmaWNhdGlvbnMgZnJvbSAnLi4vdXRpbHMvTm90aWZpY2F0aW9ucyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvb3RNZWRpYXRvciBleHRlbmRzIEJhc2VNZWRpYXRvciB7XG4gICAgcHVibGljIHN0YXRpYyBNRURJQVRPUl9OQU1FOiBzdHJpbmcgPSAnYm9vdE1lZGlhdG9yJztcblx0XHRcbiAgICAvLyBkaWpvbi5tdmMuTWVkaWF0b3Igb3ZlcnJpZGVzXG4gICAgcHVibGljIG9uUmVnaXN0ZXIoKSB7XG4gICAgICAgIHRoaXMuc2VuZE5vdGlmaWNhdGlvbihOb3RpZmljYXRpb25zLkJPT1RfSU5JVCk7XG4gICAgfVxuXHRcdFxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgLy8gY2FsbGVkIGZyb20gdmlld0NvbXBvbmVudFxuICAgIHB1YmxpYyBib290Q29tcGxldGUoKSB7XG4gICAgICAgIHRoaXMuc2VuZE5vdGlmaWNhdGlvbihOb3RpZmljYXRpb25zLkJPT1RfQ09NUExFVEUpO1xuICAgIH1cblx0XHRcbiAgICAvLyBnZXR0ZXIgLyBzZXR0ZXJcbiAgICBwdWJsaWMgZ2V0IG5hbWUoKTpzdHJpbmcge1xuICAgICAgICByZXR1cm4gQm9vdE1lZGlhdG9yLk1FRElBVE9SX05BTUU7XG4gICAgfVxufSIsImltcG9ydCBCYXNlU3RhdGUgZnJvbSBcIi4vQmFzZVN0YXRlXCI7XG5pbXBvcnQgQm9vdE1lZGlhdG9yIGZyb20gXCIuLi9tZWRpYXRvci9Cb290TWVkaWF0b3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm9vdCBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gICAgLy8gUGhhc2VyLlN0YXRlIG92ZXJyaWRlc1xuICAgIHB1YmxpYyBpbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9tZWRpYXRvciA9IG5ldyBCb290TWVkaWF0b3IodGhpcyk7XG4gICAgfVxuXG4gICAgcHVibGljIHByZWxvYWQoKTogdm9pZCB7XG4gICAgICAgIGlmICh3aW5kb3dbJ3ZlcnNpb24nXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYXNzZXQuY2FjaGVCdXN0VmVyc2lvbiA9ICdAQHZlcnNpb24nO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2FtZS5hc3NldC5sb2FkSlNPTignZ2FtZV9kYXRhJyk7XG4gICAgICAgIHRoaXMuZ2FtZS5hc3NldC5sb2FkSlNPTignYXNzZXRzJyk7XG4gICAgICAgIHRoaXMuZ2FtZS5hc3NldC5sb2FkSlNPTignY29weScpO1xuICAgICAgICB0aGlzLmdhbWUuYXNzZXQubG9hZEJpdG1hcEZvbnQoJ2tvbWlrYXgnKTtcbiAgICB9XG5cbiAgICAvLyBkaWpvbi5jb3JlLlN0YXRlIG92ZXJyaWRlc1xuICAgIHB1YmxpYyBidWlsZEludGVyZmFjZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5tZWRpYXRvci5ib290Q29tcGxldGUoKTtcbiAgICB9XG5cbiAgICAvLyBwcml2YXRlIG1ldGhvZHNcblxuICAgIC8vIGdldHRlciAvIHNldHRlclxuICAgIHByb3RlY3RlZCBnZXQgbWVkaWF0b3IoKTogQm9vdE1lZGlhdG9yIHtcbiAgICAgICAgcmV0dXJuIDxCb290TWVkaWF0b3I+dGhpcy5fbWVkaWF0b3I7XG4gICAgfVxufSIsImltcG9ydCB7SU5vdGlmaWNhdGlvbn0gZnJvbSAnZGlqb24vaW50ZXJmYWNlcyc7XG5pbXBvcnQgQ29uc3RhbnRzIGZyb20gXCIuLi91dGlscy9Db25zdGFudHNcIjtcbmltcG9ydCBCYXNlTWVkaWF0b3IgZnJvbSAnLi9CYXNlTWVkaWF0b3InO1xuaW1wb3J0IE5vdGlmaWNhdGlvbnMgZnJvbSAnLi4vdXRpbHMvTm90aWZpY2F0aW9ucyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByZWxvYWRNZWRpYXRvciBleHRlbmRzIEJhc2VNZWRpYXRvciB7XG4gICAgcHVibGljIHN0YXRpYyBNRURJQVRPUl9OQU1FOiBzdHJpbmcgPSAncHJlbG9hZE1lZGlhdG9yJztcblx0XHRcbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xuICAgIC8vIGNhbGxlZCBmcm9tIFByZWxvYWQgc3RhdGVcblxuICAgIHB1YmxpYyBuZXh0KCk6IHZvaWR7XG4gICAgICAgIHRoaXMuZ2FtZS50cmFuc2l0aW9uLnRvKENvbnN0YW50cy5TVEFURV9NRU5VKTtcbiAgICB9XG5cdFx0XG4gICAgLy8gZ2V0dGVyIC8gc2V0dGVyXG4gICAgcHVibGljIGdldCBuYW1lKCkge1xuICAgICAgICByZXR1cm4gUHJlbG9hZE1lZGlhdG9yLk1FRElBVE9SX05BTUU7XG4gICAgfVxufSIsImltcG9ydCBCYXNlU3RhdGUgZnJvbSBcIi4vQmFzZVN0YXRlXCI7XG5pbXBvcnQgQ29uc3RhbnRzIGZyb20gXCIuLi91dGlscy9Db25zdGFudHNcIjtcbmltcG9ydCBQcmVsb2FkTWVkaWF0b3IgZnJvbSBcIi4uL21lZGlhdG9yL1ByZWxvYWRNZWRpYXRvclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcmVsb2FkIGV4dGVuZHMgQmFzZVN0YXRlIHtcbiAgICAvLyBQaGFzZXIuU3RhdGUgb3ZlcnJpZGVzXG4gICAgcHVibGljIGluaXQoKSB7XG4gICAgICAgIHRoaXMuX21lZGlhdG9yID0gbmV3IFByZWxvYWRNZWRpYXRvcih0aGlzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHJlbG9hZCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5nYW1lLmFzc2V0LmxvYWRBc3NldHMoJ3JlcXVpcmVkJyk7XG4gICAgfVxuXHRcdFxuICAgIC8vIGRpam9uLmNvcmUuU3RhdGUgb3ZlcnJpZGVzXG4gICAgcHVibGljIGxpc3RCdWlsZFNlcXVlbmNlKCkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgdGhpcy5fYWRkUHJlbG9hZGVyXG4gICAgICAgIF1cbiAgICB9XG5cbiAgICBwdWJsaWMgYWZ0ZXJCdWlsZCgpIHtcbiAgICAgICAvLyB0aGlzLmdhbWUuYXVkaW8ucGxheUF1ZGlvKCdtZW51X2xvb3AnLCAwLjMsIHRydWUpO1xuICAgIH1cblx0XHRcbiAgICAvLyBwcml2YXRlIG1ldGhvZHNcbiAgICBwcml2YXRlIF9hZGRQcmVsb2FkZXIoKSB7XG4gICAgICAgIGNvbnN0IHRlc3QgPSB0aGlzLmFkZC5kVGV4dCg1MCwgMTUwLCB0aGlzLm1lZGlhdG9yLmdldENvcHkoJ3ByZWxvYWQnLCAndGl0bGUnKSwgJ0FyaWFsJywgNDUsICcjZmZmZmZmJyksXG4gICAgICAgICAgICBibVRleHQgPSB0aGlzLmFkZC5iaXRtYXBUZXh0KDUwLCAzMDAsIENvbnN0YW50cy5GT05UX0tPTUlLQVgsICdCaXRtYXAgZm9udCcsIDYwKSxcbiAgICAgICAgICAgIGJ1dHRvbiA9IHRoaXMuYWRkLmJ1dHRvbih0aGlzLmdhbWUud2lkdGggLSAyNTAsIDIwLCAnbWVudScsIHRoaXMuX25leHQsIHRoaXMsICduZXh0X2J1dHRvbi9vdmVyJywgJ25leHRfYnV0dG9uL3VwJywgJ25leHRfYnV0dG9uL2Rvd24nKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9uZXh0KCkge1xuICAgICAgICB0aGlzLmdhbWUuYXVkaW8ucGxheUF1ZGlvKCd3eW9taW5nX3JvYXInKTtcbiAgICAgICAgLy8gdGVzdCBhZGRpbmcgc29tZXRoaW5nIHRvIHRoZSBcIlN0YWdlXCIgbm90IHRoZSBHYW1lIHdvcmxkXG4gICAgICAgIHRoaXMubWVkaWF0b3IubmV4dCgpO1xuICAgIH1cblx0XHRcbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xuXHRcdFxuICAgIC8vIGdldHRlciAvIHNldHRlclxuICAgIHByb3RlY3RlZCBnZXQgbWVkaWF0b3IoKTogUHJlbG9hZE1lZGlhdG9yIHtcbiAgICAgICAgcmV0dXJuIDxQcmVsb2FkTWVkaWF0b3I+dGhpcy5fbWVkaWF0b3I7XG4gICAgfVxufVxuICIsImltcG9ydCB7SU5vdGlmaWNhdGlvbn0gZnJvbSAnZGlqb24vaW50ZXJmYWNlcyc7XG5pbXBvcnQgQ29uc3RhbnRzIGZyb20gXCIuLi91dGlscy9Db25zdGFudHNcIjtcbmltcG9ydCBCYXNlTWVkaWF0b3IgZnJvbSAnLi9CYXNlTWVkaWF0b3InO1xuaW1wb3J0IE5vdGlmaWNhdGlvbnMgZnJvbSAnLi4vdXRpbHMvTm90aWZpY2F0aW9ucyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lbnVNZWRpYXRvciBleHRlbmRzIEJhc2VNZWRpYXRvciB7XG4gICAgcHVibGljIHN0YXRpYyBNRURJQVRPUl9OQU1FOiBzdHJpbmcgPSAnbWVudU1lZGlhdG9yJztcblx0XHRcbiAgICAvLyBnZXR0ZXIgLyBzZXR0ZXJcbiAgICBwdWJsaWMgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIE1lbnVNZWRpYXRvci5NRURJQVRPUl9OQU1FO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgaHVkRGF0YSgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5nYW1lTW9kZWwuZ2FtZURhdGEuaHVkO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgc3RhdERhdGEoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2FtZU1vZGVsLmdhbWVEYXRhLm1haW4uc3RhdHM7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCB3b3JsZERhdGEoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2FtZU1vZGVsLmdhbWVEYXRhLm1haW4ud29ybGQ7XG4gICAgfVxufSIsImltcG9ydCB7U3ByaXRlfSBmcm9tICdkaWpvbi9kaXNwbGF5JztcblxuLy8gU3RydWN0dXJlIG9mIGEgdGhlIHZpc3VhbCBwcm9wZXJ0aWVzIGZvciBhIHNwZWNpZmljIEhVRCBlbGVtZW50LlxuZXhwb3J0IGludGVyZmFjZSBJSFVERWxlbWVudFByb3BlcnRpZXMge1xuICAgIHNjYWxlOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH07XG4gICAgYW5jaG9yOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH07XG4gICAgdGV4dHVyZTogc3RyaW5nO1xuICAgIGtleTogc3RyaW5nO1xuICAgIHRleHRTdHlsZTogeyBmb250OiBzdHJpbmcsIHNpemU6IG51bWJlciwgY29sb3I6IHN0cmluZyB9O1xuICAgIGJhclNjYWxpbmc6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfTtcbiAgICBtYXhTaXplOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVN0YXQge1xuICAgIG1pbjogbnVtYmVyO1xuICAgIGN1cnJlbnQ6IG51bWJlcjtcbiAgICBuZXh0OiBudW1iZXI7XG4gICAgbWF4OiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBIVURFbGVtZW50IGV4dGVuZHMgU3ByaXRlIHtcbiAgICBwcm90ZWN0ZWQgX2N1cnJlbnRWYWx1ZTogbnVtYmVyO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgcHJvcGVydGllczogYW55KSB7XG4gICAgICAgIHN1cGVyKDAsIDAsIHByb3BlcnRpZXMudGV4dHVyZSwgbnVsbCwgbmFtZSk7XG5cbiAgICAgICAgaWYgKHByb3BlcnRpZXMuc2NhbGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgIHRoaXMuc2NhbGUgPSBuZXcgUGhhc2VyLlBvaW50KHByb3BlcnRpZXMuc2NhbGUueCwgcHJvcGVydGllcy5zY2FsZS55KVxuICAgICAgICB9ICAgICAgICBcbiAgICAgICAgaWYgKHByb3BlcnRpZXMuYW5jaG9yICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYW5jaG9yID0gbmV3IFBoYXNlci5Qb2ludChwcm9wZXJ0aWVzLmFuY2hvci54LCBwcm9wZXJ0aWVzLmFuY2hvci55KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3BhcnNlUHJvcGVydGllcyhwcm9wZXJ0aWVzKTtcbiAgICAgICAgdGhpcy5fY3VycmVudFZhbHVlID0gMDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgX3BhcnNlUHJvcGVydGllcyhwcm9wZXJ0aWVzOiBJSFVERWxlbWVudFByb3BlcnRpZXMpOiB2b2lkIHtcbiAgICAgICAgLy8gT3ZlcnJpZGUgaW4gZXh0ZW5kZWQgY2xhc3NlcyB0byBhY2Nlc3MgYWRkaXRpb25hbCBwcm9wZXJ0aWVzXG4gICAgfVxuXG4gICAgLy8gVGhpcyBzaG91bGQgb25seSBiZSBjYWxsZWQgd2hlbiBhIHN0YXQgY2hhbmdlcy4gICAgXG4gICAgcHVibGljIHVwZGF0ZUVsZW1lbnQobmV3U3RhdDogSVN0YXQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fY3VycmVudFZhbHVlID0gbmV3U3RhdC5jdXJyZW50O1xuICAgIH1cblxuICAgIHB1YmxpYyByZXBvc2l0aW9uKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMueCA9IHggLSB0aGlzLnBhcmVudC54O1xuICAgICAgICB0aGlzLnkgPSB5IC0gdGhpcy5wYXJlbnQueTtcbiAgICB9XG59IiwiaW1wb3J0IHtIVURFbGVtZW50fSBmcm9tICcuL0hVREVsZW1lbnQnO1xuaW1wb3J0IEhVRCBmcm9tICcuL0hVRCc7XG5pbXBvcnQge0dyb3VwfSBmcm9tICdkaWpvbi9kaXNwbGF5JztcblxuZXhwb3J0IGludGVyZmFjZSBJTWFyZ2luRGF0YSB7XG4gICAgbGVmdDogbnVtYmVyO1xuICAgIHJpZ2h0OiBudW1iZXI7XG4gICAgdG9wOiBudW1iZXI7XG4gICAgYm90dG9tOiBudW1iZXI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhVRFJlZ2lvbnMge1xuICAgIHB1YmxpYyB0b3BMZWZ0OiBTaW5nbGVSZWdpb247XG4gICAgcHVibGljIHRvcENlbnRlcjogU2luZ2xlUmVnaW9uO1xuICAgIHB1YmxpYyB0b3BSaWdodDogU2luZ2xlUmVnaW9uO1xuICAgIHB1YmxpYyBtaWRkbGVMZWZ0OiBTaW5nbGVSZWdpb247XG4gICAgcHVibGljIG1pZGRsZUNlbnRlcjogU2luZ2xlUmVnaW9uO1xuICAgIHB1YmxpYyBtaWRkbGVSaWdodDogU2luZ2xlUmVnaW9uO1xuICAgIHB1YmxpYyBib3R0b21MZWZ0OiBTaW5nbGVSZWdpb247XG4gICAgcHVibGljIGJvdHRvbUNlbnRlcjogU2luZ2xlUmVnaW9uO1xuICAgIHB1YmxpYyBib3R0b21SaWdodDogU2luZ2xlUmVnaW9uO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKGh1ZDogSFVELCBjYW1XaWR0aDogbnVtYmVyLCBjYW1IZWlnaHQ6IG51bWJlciwgY2FtQ2VudGVyOiBQaGFzZXIuUG9pbnQsIGh1ZE1hcmdpbnM6IElNYXJnaW5EYXRhKSB7XG4gICAgICAgIC8vIGRlZmluZSB0aGUgSFVEIHJlZ2lvbnMgKGJlZ2luIGFuZCBlbmQgcG9pbnRzKVxuICAgICAgICBsZXQgaG9yaXpvbnRhbFdpZHRoID0gKGNhbVdpZHRoIC0gKGh1ZE1hcmdpbnMucmlnaHQgKyBodWRNYXJnaW5zLmxlZnQpKSAvIDM7XG4gICAgICAgIGxldCBtaWRkbGVXaWR0aCA9IGNhbVdpZHRoICogMC4xO1xuICAgICAgICBsZXQgbWlkZGxlSGVpZ2h0ID0gY2FtSGVpZ2h0IC0gKGh1ZE1hcmdpbnMuYm90dG9tICsgaHVkTWFyZ2lucy50b3ApO1xuICAgICAgICAvLyBUb3AgRWxlbWVudCBSZWdpb25zXG4gICAgICAgIHRoaXMudG9wTGVmdCA9IG5ldyBTaW5nbGVSZWdpb24oaHVkTWFyZ2lucy5sZWZ0LCBodWRNYXJnaW5zLnRvcCxcbiAgICAgICAgICAgIGhvcml6b250YWxXaWR0aCwgMCwgXCJUb3BMZWZ0XCIpO1xuICAgICAgICB0aGlzLnRvcENlbnRlciA9IG5ldyBTaW5nbGVSZWdpb24oY2FtQ2VudGVyLnggLSAoaG9yaXpvbnRhbFdpZHRoICogMC41KSwgdGhpcy50b3BMZWZ0LnksXG4gICAgICAgICAgICBob3Jpem9udGFsV2lkdGgsIDAsIFwiVG9wQ2VudGVyXCIpOyBcbiAgICAgICAgdGhpcy50b3BSaWdodCA9IG5ldyBTaW5nbGVSZWdpb24oY2FtV2lkdGggLSBodWRNYXJnaW5zLnJpZ2h0IC0gaG9yaXpvbnRhbFdpZHRoLCB0aGlzLnRvcENlbnRlci55LFxuICAgICAgICAgICAgaG9yaXpvbnRhbFdpZHRoLCAwLCBcIlRvcFJpZ2h0XCIpO1xuXG4gICAgICAgIC8vIEJvdHRvbSBFbGVtZW50IFJlZ2lvbnNcbiAgICAgICAgdGhpcy5ib3R0b21MZWZ0ID0gbmV3IFNpbmdsZVJlZ2lvbihodWRNYXJnaW5zLmxlZnQsIGNhbUhlaWdodCAtIGh1ZE1hcmdpbnMuYm90dG9tLFxuICAgICAgICAgICAgaG9yaXpvbnRhbFdpZHRoLCAwLCBcIkJvdHRvbUxlZnRcIik7XG4gICAgICAgIHRoaXMuYm90dG9tQ2VudGVyID0gbmV3IFNpbmdsZVJlZ2lvbih0aGlzLmJvdHRvbUxlZnQuZW5kWCwgdGhpcy5ib3R0b21MZWZ0LnksXG4gICAgICAgICAgICBob3Jpem9udGFsV2lkdGgsIDAsIFwiQm90dG9tQ2VudGVyXCIpO1xuICAgICAgICB0aGlzLmJvdHRvbVJpZ2h0ID0gbmV3IFNpbmdsZVJlZ2lvbih0aGlzLmJvdHRvbUNlbnRlci5lbmRYLCB0aGlzLmJvdHRvbUNlbnRlci55LFxuICAgICAgICAgICAgaG9yaXpvbnRhbFdpZHRoLCAwLCBcIkJvdHRvbVJpZ2h0XCIpO1xuXG4gICAgICAgIC8vIE1pZGRsZSBFbGVtZW50IFJlZ2lvbnNcbiAgICAgICAgdGhpcy5taWRkbGVMZWZ0ID0gbmV3IFNpbmdsZVJlZ2lvbihodWRNYXJnaW5zLmxlZnQsIHRoaXMudG9wTGVmdC5lbmRZLFxuICAgICAgICAgICAgMCwgdGhpcy5ib3R0b21MZWZ0LnkgLSB0aGlzLnRvcExlZnQuZW5kWSwgXCJNaWRkbGVMZWZ0XCIpO1xuICAgICAgICB0aGlzLm1pZGRsZVJpZ2h0ID0gbmV3IFNpbmdsZVJlZ2lvbihjYW1XaWR0aCAtIGh1ZE1hcmdpbnMucmlnaHQsIHRoaXMudG9wUmlnaHQuZW5kWSxcbiAgICAgICAgICAgIDAsIHRoaXMuYm90dG9tUmlnaHQueSAtIHRoaXMudG9wUmlnaHQuZW5kWSwgXCJNaWRkbGVSaWdodFwiKTtcbiAgICAgICAgdGhpcy5taWRkbGVDZW50ZXIgPSBuZXcgU2luZ2xlUmVnaW9uKGh1ZE1hcmdpbnMubGVmdCwgY2FtQ2VudGVyLnksIFxuICAgICAgICAgICAgY2FtV2lkdGggLSAoaHVkTWFyZ2lucy5yaWdodCArIGh1ZE1hcmdpbnMubGVmdCksIDAsIFwiTWlkZGxlQ2VudGVyXCIpO1xuICAgICAgICBcbiAgICAgICAgaHVkLmFkZENoaWxkKHRoaXMudG9wTGVmdCk7XG4gICAgICAgIGh1ZC5hZGRDaGlsZCh0aGlzLnRvcENlbnRlcik7XG4gICAgICAgIGh1ZC5hZGRDaGlsZCh0aGlzLnRvcFJpZ2h0KTtcbiAgICAgICAgaHVkLmFkZENoaWxkKHRoaXMubWlkZGxlTGVmdCk7XG4gICAgICAgIGh1ZC5hZGRDaGlsZCh0aGlzLm1pZGRsZUNlbnRlcik7XG4gICAgICAgIGh1ZC5hZGRDaGlsZCh0aGlzLm1pZGRsZVJpZ2h0KTtcbiAgICAgICAgaHVkLmFkZENoaWxkKHRoaXMuYm90dG9tTGVmdCk7XG4gICAgICAgIGh1ZC5hZGRDaGlsZCh0aGlzLmJvdHRvbUNlbnRlcik7XG4gICAgICAgIGh1ZC5hZGRDaGlsZCh0aGlzLmJvdHRvbVJpZ2h0KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlQWxsRWxlbWVudFBvc2l0aW9ucygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy50b3BMZWZ0LnVwZGF0ZUFsbEVsZW1lbnRQb3NpdGlvbnMoKTtcbiAgICAgICAgdGhpcy50b3BDZW50ZXIudXBkYXRlQWxsRWxlbWVudFBvc2l0aW9ucygpO1xuICAgICAgICB0aGlzLnRvcFJpZ2h0LnVwZGF0ZUFsbEVsZW1lbnRQb3NpdGlvbnMoKTtcbiAgICAgICAgdGhpcy5taWRkbGVMZWZ0LnVwZGF0ZUFsbEVsZW1lbnRQb3NpdGlvbnMoKTtcbiAgICAgICAgdGhpcy5taWRkbGVDZW50ZXIudXBkYXRlQWxsRWxlbWVudFBvc2l0aW9ucygpO1xuICAgICAgICB0aGlzLm1pZGRsZVJpZ2h0LnVwZGF0ZUFsbEVsZW1lbnRQb3NpdGlvbnMoKTtcbiAgICAgICAgdGhpcy5ib3R0b21MZWZ0LnVwZGF0ZUFsbEVsZW1lbnRQb3NpdGlvbnMoKTtcbiAgICAgICAgdGhpcy5ib3R0b21DZW50ZXIudXBkYXRlQWxsRWxlbWVudFBvc2l0aW9ucygpO1xuICAgICAgICB0aGlzLmJvdHRvbVJpZ2h0LnVwZGF0ZUFsbEVsZW1lbnRQb3NpdGlvbnMoKTtcbiAgICB9XG4gICAgXG59XG5cbmNsYXNzIFNpbmdsZVJlZ2lvbiBleHRlbmRzIEdyb3VwIHtcbiAgICBwdWJsaWMgZW5kOiBQaGFzZXIuUG9pbnQ7XG4gICAgcHVibGljIGVsZW1lbnRzOiBIVURFbGVtZW50W107XG4gICAgcHVibGljIHJlZ2lvbldpZHRoOiBudW1iZXI7XG4gICAgcHVibGljIHJlZ2lvbkhlaWdodDogbnVtYmVyO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgbmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKHgsIHksIG5hbWUpO1xuICAgICAgICB0aGlzLmVsZW1lbnRzID0gW107XG4gICAgICAgIHRoaXMucmVnaW9uV2lkdGggPSB3aWR0aDtcbiAgICAgICAgdGhpcy5yZWdpb25IZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIHRoaXMuX2FkZERlYnVnQm94KCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIF9hZGREZWJ1Z0JveCgpOiB2b2lkIHtcbiAgICAgICAgbGV0IGdmeCA9IHRoaXMuZ2FtZS5hZGQuZ3JhcGhpY3MoKTtcbiAgICAgICAgZ2Z4LmJlZ2luRmlsbChQaGFzZXIuQ29sb3IuZ2V0UmFuZG9tQ29sb3IoMzUsIDEwMCksIDAuNyk7XG4gICAgICAgIGdmeC5kcmF3UmVjdCgwLCAwLCB0aGlzLnJlZ2lvbldpZHRoID4gMSA/IHRoaXMucmVnaW9uV2lkdGggOiAyLCB0aGlzLnJlZ2lvbkhlaWdodCA+IDEgPyB0aGlzLnJlZ2lvbkhlaWdodCA6IDIpO1xuICAgICAgICBnZnguZW5kRmlsbCgpO1xuICAgICAgICB0aGlzLmFkZENoaWxkKG5ldyBQaGFzZXIuSW1hZ2UodGhpcy5nYW1lLCAwLCAwLCBnZnguZ2VuZXJhdGVUZXh0dXJlKCkpKTtcbiAgICAgICAgdGhpcy5nYW1lLndvcmxkLnJlbW92ZShnZngpO1xuICAgIH0gXG5cbiAgICBwdWJsaWMgdXBkYXRlQWxsRWxlbWVudFBvc2l0aW9ucygpOiB2b2lkIHtcbiAgICAgICAgbGV0IG51bWJlcl9vZl9lbGVtZW50cywgc3RlcCwgcG9zaXRpb247XG4gICAgICAgIG51bWJlcl9vZl9lbGVtZW50cyA9IHRoaXMuZWxlbWVudHMubGVuZ3RoO1xuICAgICAgICBpZiAobnVtYmVyX29mX2VsZW1lbnRzID09PSAxKSB7XG4gICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSBlbGVtZW50LCBpdCBzaG91bGQgYmUgaW4gdGhlIGNlbnRlciBvZiB0aGUgcmVnaW9uXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzWzBdLnJlcG9zaXRpb24odGhpcy54ICsgKHRoaXMucmVnaW9uV2lkdGggLyAyKSwgdGhpcy55ICsgKHRoaXMucmVnaW9uSGVpZ2h0IC8gMikpO1xuICAgICAgICB9IGVsc2UgaWYgKG51bWJlcl9vZl9lbGVtZW50cyA9PT0gMikge1xuICAgICAgICAgICAgLy8gaWYgdGhlcmUgYXJlIHR3byBlbGVtZW50cywgdGhleSB3aWxsIGJlIGluIG9wcG9zaXRlIHNpZGVzIG9mIHRoZSByZWdpb25cbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHNbMF0ucmVwb3NpdGlvbih0aGlzLnggKyAodGhpcy5yZWdpb25XaWR0aCAqIDAuMjUpLCB0aGlzLnkgKyAodGhpcy5yZWdpb25IZWlnaHQgKiAwLjI1KSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzWzFdLnJlcG9zaXRpb24odGhpcy54ICsgKHRoaXMucmVnaW9uV2lkdGggKiAwLjc1KSAtIHRoaXMuZWxlbWVudHNbMV0ucmVhbFdpZHRoLCB0aGlzLnkgKyAodGhpcy5yZWdpb25IZWlnaHQgKiAwLjc1KSk7XG4gICAgICAgIH0gZWxzZSBpZiAobnVtYmVyX29mX2VsZW1lbnRzID4gMikge1xuICAgICAgICAgICAgLy8gaWYgdGhlcmUgYXJlIG1vcmUgdGhhbiB0d28gZWxlbWVudHMsIHRoZXkgd2lsbCBiZSBlcXVhbGx5IHNwYWNlZCBpbiB0aGUgcmVnaW9uXG4gICAgICAgICAgICBzdGVwID0gbmV3IFBoYXNlci5Qb2ludCh0aGlzLnJlZ2lvbldpZHRoIC8gbnVtYmVyX29mX2VsZW1lbnRzLCB0aGlzLnJlZ2lvbkhlaWdodCAvIG51bWJlcl9vZl9lbGVtZW50cyk7XG4gICAgICAgICAgICBwb3NpdGlvbiA9IG5ldyBQaGFzZXIuUG9pbnQodGhpcy54ICsgKHN0ZXAueCAqIDAuNSksIHRoaXMueSArIChzdGVwLnkgKiAwLjUpKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVwb3NpdGlvbihwb3NpdGlvbi54LCBwb3NpdGlvbi55KTtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbi54ICs9IHN0ZXAueDtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbi55ICs9IHN0ZXAueTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBmaXggYWxsIGVsZW1lbnRzIHRvIGNhbWVyYVxuICAgICAgICB0aGlzLmVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuZml4ZWRUb0NhbWVyYSA9IHRydWU7XG4gICAgICAgIH0sIHRoaXMpOyAgICBcbiAgICB9IFxuXG4gICAgcHJvdGVjdGVkIHJhbmRvbUNvbG9yKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiAweDBmMGYgKyBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxMCk7ICAgXG4gICAgfSAgIFxuICAgIFxuICAgIHB1YmxpYyBnZXQgY2VudGVyWCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy54ICsgKHRoaXMucmVnaW9uV2lkdGggKiAwLjUpO1xuICAgIH0gICAgXG5cbiAgICBwdWJsaWMgZ2V0IGNlbnRlclkoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueSArICh0aGlzLnJlZ2lvbkhlaWdodCAqIDAuNSk7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBnZXQgZW5kWCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy54ICsgdGhpcy5yZWdpb25XaWR0aDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGVuZFkoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueSArIHRoaXMucmVnaW9uSGVpZ2h0O1xuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgYWRkRWxlbWVudChuZXdFbGVtZW50OiBIVURFbGVtZW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQobmV3RWxlbWVudCk7XG4gICAgICAgIHRoaXMuZWxlbWVudHMucHVzaChuZXdFbGVtZW50KTtcbiAgICB9XG59IiwiLy8gTG9hZCBpbiBhbGwgc3RhdCBwb3NzaWJpbGl0aWVzIGF0IGxvYWR1cC5cbmltcG9ydCBTdGF0IGZyb20gJy4vU3RhdCc7IFxuaW1wb3J0IEhVRCBmcm9tICcuLi9odWQvSFVEJztcblxuZXhwb3J0IGludGVyZmFjZSBJU3RhdERhdGEge1xuICAgIG1pbjogbnVtYmVyO1xuICAgIG1heDogbnVtYmVyO1xufVxuXG5leHBvcnQgY2xhc3MgU3RhdE1hbmFnZXIge1xuICAgIHByaXZhdGUgX3N0YXREYXRhOiBhbnk7XG4gICAgcHJpdmF0ZSBfZ2xvYmFsU3RhdHM6IFN0YXRbXTtcblxuICAgIHByaXZhdGUgc3RhdGljIF9jdXJyZW50SUQ6IG51bWJlciA9IDA7XG5cbiAgICBjb25zdHJ1Y3RvcihpbkRhdGE6IGFueSkge1xuICAgICAgICBjb25zb2xlLmxvZyhpbkRhdGEpO1xuICAgICAgICB0aGlzLl9nbG9iYWxTdGF0cyA9IFtdO1xuICAgICAgICB0aGlzLl9zdGF0RGF0YSA9IHt9O1xuICAgICAgICB0aGlzLl9zdGF0RGF0YSA9IGluRGF0YTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0TmV3U3RhdCh0eXBlOiBzdHJpbmcsIG9ialR5cGU6IHN0cmluZyk6IFN0YXQge1xuICAgICAgICBsZXQgbmV3U3RhdDogU3RhdCA9IG5ldyBTdGF0KCk7XG4gICAgICAgIGlmICh0aGlzLl9zdGF0RGF0YS5oYXNPd25Qcm9wZXJ0eSh0eXBlKSkge1xuICAgICAgICAgICAgbmV3U3RhdC5pbml0V2l0aERhdGEodGhpcy5fc3RhdERhdGFbdHlwZV0sIHR5cGUsIG9ialR5cGUsIFN0YXRNYW5hZ2VyLl9jdXJyZW50SUQpO1xuICAgICAgICAgICAgU3RhdE1hbmFnZXIuX2N1cnJlbnRJRCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdTdGF0O1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRTdGF0c0ZvckNoYXJhY3Rlcih0eXBlczogc3RyaW5nW10sIG9ialR5cGU6IHN0cmluZyk6IFN0YXRbXSB7XG4gICAgICAgIGxldCBzdGF0czogU3RhdFtdID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHlwZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBuZXdTdGF0ID0gdGhpcy5nZXROZXdTdGF0KHR5cGVzW2ldLCBvYmpUeXBlKTtcbiAgICAgICAgICAgIGlmIChuZXdTdGF0LnR5cGUgIT09IFwiTk9ORVwiKSB7XG4gICAgICAgICAgICAgICAgc3RhdHMucHVzaChuZXdTdGF0KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9nbG9iYWxTdGF0cy5wdXNoKG5ld1N0YXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdGF0cztcbiAgICB9ICAgXG5cbiAgICBwdWJsaWMgbG9nQWxsU3RhdHMoKTogdm9pZCB7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuX2dsb2JhbFN0YXRzKTtcbiAgICB9XG4gICAgXG4gICAgcHVibGljIHNldEhVRChodWQ6IEhVRCk6IHZvaWQge1xuICAgICAgICBTdGF0Lmh1ZCA9IGh1ZDtcbiAgICB9XG59IiwiaW1wb3J0IEhVRCBmcm9tICcuLi9odWQvSFVEJztcbmltcG9ydCB7SVN0YXREYXRhfSBmcm9tICcuL1N0YXRNYW5hZ2VyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RhdCB7XG4gICAgcHJvdGVjdGVkIF90eXBlOiBzdHJpbmcgPSBcIk5PTkVcIjtcbiAgICBwcm90ZWN0ZWQgX2lkOiBudW1iZXI7XG4gICAgcHVibGljIG1pbjogbnVtYmVyID0gMTtcbiAgICBwdWJsaWMgbWF4OiBudW1iZXIgPSAyNTU7XG4gICAgcHVibGljIGN1cnJlbnQ6IG51bWJlciA9IDE7XG4gICAgcHVibGljIG5leHQ6IG51bWJlciA9IDI7XG5cbiAgICBwdWJsaWMgc3RhdGljIGh1ZDogSFVEO1xuXG4gICAgY29uc3RydWN0b3IoKSB7fVxuICAgIFxuICAgIHB1YmxpYyBpbml0V2l0aERhdGEoZGF0YTogSVN0YXREYXRhLCB0eXBlOiBzdHJpbmcsIG93bmluZ09iajogc3RyaW5nLCBpZDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3R5cGUgPSBvd25pbmdPYmogKyB0eXBlO1xuICAgICAgICB0aGlzLl9pZCA9IGlkO1xuICAgICAgICB0aGlzLm1pbiA9IGRhdGEubWluO1xuICAgICAgICB0aGlzLm1heCA9IGRhdGEubWF4O1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLm1pbjtcbiAgICAgICAgdGhpcy5uZXh0ID0gdGhpcy5jdXJyZW50ICsgMTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGlkKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pZDtcbiAgICB9ICAgIFxuXG4gICAgcHVibGljIGdldCB0eXBlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlO1xuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgcmVzZXRTdGF0KG5ld1ZhbDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY3VycmVudCA9IG5ld1ZhbDtcbiAgICAgICAgdGhpcy5fY2xhbXBBbmROb3RpZnlIVUQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWx0ZXJTdGF0KGluY3JlYXNlQnk6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLmN1cnJlbnQgKz0gaW5jcmVhc2VCeTtcbiAgICAgICAgdGhpcy5fY2xhbXBBbmROb3RpZnlIVUQoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgX2NsYW1wQW5kTm90aWZ5SFVEKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50IDwgdGhpcy5taW4pIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IHRoaXMubWluO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuY3VycmVudCA+IHRoaXMubWF4KSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLm1heDtcbiAgICAgICAgfVxuICAgICAgICBTdGF0Lmh1ZC5ub3RpZnlTdGF0Q2hhbmdlKHRoaXMpO1xuICAgIH1cbn0iLCJpbXBvcnQge0lIVURFbGVtZW50UHJvcGVydGllcywgSVN0YXQsIEhVREVsZW1lbnR9IGZyb20gJy4vSFVERWxlbWVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhVRFN0YXRXaXRoQmFyIGV4dGVuZHMgSFVERWxlbWVudCB7XG4gICAgcHJvdGVjdGVkIF9iYXJCYWNrZ3JvdW5kOiBQaGFzZXIuU3ByaXRlO1xuICAgIHByb3RlY3RlZCBfc2NhbGVWZWN0b3I6IFBoYXNlci5Qb2ludDtcbiAgICBwcm90ZWN0ZWQgX21heFNpemU6IG51bWJlciA9IDUwO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgcHJvcGVydGllczogYW55KSB7XG4gICAgICAgIHN1cGVyKG5hbWUsIHByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBfcGFyc2VQcm9wZXJ0aWVzKHByb3BlcnRpZXM6IElIVURFbGVtZW50UHJvcGVydGllcyk6IHZvaWQge1xuICAgICAgICBpZiAocHJvcGVydGllcy5iYXJTY2FsaW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3NjYWxlVmVjdG9yID0gbmV3IFBoYXNlci5Qb2ludChwcm9wZXJ0aWVzLmJhclNjYWxpbmcueCwgcHJvcGVydGllcy5iYXJTY2FsaW5nLnkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLm1heFNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fbWF4U2l6ZSA9IHByb3BlcnRpZXMubWF4U2l6ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGVFbGVtZW50KG5ld1N0YXQ6IElTdGF0KTogdm9pZCB7XG4gICAgICAgIGxldCBuZXdTY2FsZTogbnVtYmVyID0gKG5ld1N0YXQuY3VycmVudCAvIG5ld1N0YXQubWF4KSAqIHRoaXMuX21heFNpemU7XG4gICAgICAgIHRoaXMuc2NhbGUuc2V0VG8odGhpcy5fc2NhbGVWZWN0b3IueCAqIG5ld1NjYWxlLCB0aGlzLl9zY2FsZVZlY3Rvci55ICogbmV3U2NhbGUpO1xuICAgIH1cbn0iLCJpbXBvcnQge0lIVURFbGVtZW50UHJvcGVydGllcywgSVN0YXQsIEhVREVsZW1lbnR9IGZyb20gJy4vSFVERWxlbWVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhVRFN0YXRXaXRoVGV4dCBleHRlbmRzIEhVREVsZW1lbnQge1xuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgcHJvcGVydGllczogYW55KSB7XG4gICAgICAgIHN1cGVyKG5hbWUsIHByb3BlcnRpZXMpO1xuICAgIH1cbn0iLCJpbXBvcnQge0dyb3VwfSBmcm9tICdkaWpvbi9kaXNwbGF5JztcbmltcG9ydCBIVURSZWdpb25zIGZyb20gJy4vSFVEUmVnaW9ucyc7XG5pbXBvcnQge0lIVURFbGVtZW50UHJvcGVydGllcywgSFVERWxlbWVudH0gZnJvbSAnLi9IVURFbGVtZW50JztcbmltcG9ydCBTdGF0IGZyb20gJy4uL3N0YXRzL1N0YXQnO1xuaW1wb3J0IEhVRFN0YXRXaXRoQmFyIGZyb20gJy4vSFVEU3RhdFdpdGhCYXInO1xuaW1wb3J0IEhVRFN0YXRXaXRoVGV4dCBmcm9tICcuL0hVRFN0YXRXaXRoVGV4dCc7XG5cbi8vIFRoZSBzdHJ1Y3R1cmUgb2YgdGhlIEhVRCBkYXRhIGFzIGxvYWRlZCBpbiBmcm9tIEpTT04uXG5leHBvcnQgaW50ZXJmYWNlIElIVUREYXRhIHtcbiAgICBtYXJnaW5zOiB7IGxlZnQ6IG51bWJlciwgcmlnaHQ6IG51bWJlciwgdG9wOiBudW1iZXIsIGJvdHRvbTogbnVtYmVyIH0sXG4gICAgZWxlbWVudHM6IElIVURFbGVtZW50RGF0YVtdXG59XG5cbi8vIFN0cnVjdXRyZSBvZiBhIEhVRCBlbGVtZW50IGFzIGxvYWRlZCBpbiBmcm9tIEpTT04gZGF0YS5cbmV4cG9ydCBpbnRlcmZhY2UgSUhVREVsZW1lbnREYXRhIHtcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgdHlwZTogc3RyaW5nLFxuICAgIHJlZ2lvbjogc3RyaW5nLFxuICAgIHN0YXRUb1Nob3c6IHN0cmluZywgXG4gICAgcHJvcGVydGllczogSUhVREVsZW1lbnRQcm9wZXJ0aWVzXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhVRCBleHRlbmRzIEdyb3VwIHtcbiAgICBwcml2YXRlIF9kYXRhOiBJSFVERGF0YTtcbiAgICBwcml2YXRlIF9yZWdpb25zOiBIVURSZWdpb25zO1xuICAgIHByaXZhdGUgX3RyYWNrZWRTdGF0czogSFVERWxlbWVudFtdO1xuICAgIHByaXZhdGUgX3ByZWZhYkVsZW1lbnRzOiBhbnkgPSB7XG4gICAgICAgIFwiYmFzaWNfZWxlbWVudFwiOiBIVURFbGVtZW50LFxuICAgICAgICBcInN0YXRfd2l0aF9iYXJcIjogSFVEU3RhdFdpdGhCYXIsXG4gICAgICAgIFwic3RhdF93aXRoX3RleHRcIjogSFVEU3RhdFdpdGhUZXh0XG4gICAgfVxuICAgIFxuICAgIGNvbnN0cnVjdG9yKGRhdGE6IElIVUREYXRhKSB7XG4gICAgICAgIHN1cGVyKDAsIDAsIFwiSFVEXCIpO1xuICAgICAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgICAgICAgdGhpcy5fdHJhY2tlZFN0YXRzID0gW107XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBpbml0KCk6IHZvaWQge1xuICAgICAgICBsZXQgY2FtV2lkdGg6IG51bWJlciwgY2FtSGVpZ2h0OiBudW1iZXIsIGNhbUNlbnRlcjogUGhhc2VyLlBvaW50O1xuICAgICAgICBjYW1XaWR0aCA9IHRoaXMuZ2FtZS5jYW1lcmEud2lkdGg7XG4gICAgICAgIGNhbUhlaWdodCA9IHRoaXMuZ2FtZS5jYW1lcmEuaGVpZ2h0O1xuICAgICAgICBjYW1DZW50ZXIgPSBuZXcgUGhhc2VyLlBvaW50KGNhbVdpZHRoIC8gMiwgY2FtSGVpZ2h0IC8gMik7XG4gICAgICAgIFxuICAgICAgICB0aGlzLl9yZWdpb25zID0gbmV3IEhVRFJlZ2lvbnModGhpcywgY2FtV2lkdGgsIGNhbUhlaWdodCwgY2FtQ2VudGVyLCB0aGlzLl9kYXRhLm1hcmdpbnMpO1xuICAgICAgICB0aGlzLl9jcmVhdGVFbGVtZW50cygpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBfY3JlYXRlRWxlbWVudHMoKTogdm9pZCB7XG4gICAgICAgIGxldCBlbGVtZW50TmFtZSwgZWxlbWVudFBhcmVtczogSUhVREVsZW1lbnREYXRhLCByZWdpb24sIG5ld0VsZW1lbnQ7XG4gICAgICAgIC8vIGNyZWF0ZSB0aGUgSFVEIGVsZW1lbnRzIGZyb20gdGhlIEpTT04gZmlsZVxuICAgICAgICBmb3IgKGVsZW1lbnROYW1lIGluIHRoaXMuX2RhdGEuZWxlbWVudHMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9kYXRhLmVsZW1lbnRzLmhhc093blByb3BlcnR5KGVsZW1lbnROYW1lKSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRQYXJlbXMgPSB0aGlzLl9kYXRhLmVsZW1lbnRzW2VsZW1lbnROYW1lXTtcbiAgICAgICAgICAgICAgICAvLyBmaW5kIHRoZSByZWdpb24gYmVnaW5uaW5nIHBvc2l0aW9uc1xuICAgICAgICAgICAgICAgIHJlZ2lvbiA9IHRoaXMuX3JlZ2lvbnNbZWxlbWVudFBhcmVtcy5yZWdpb25dO1xuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgZWxlbWVudCBwcmVmYWIgaW4gdGhlIGJlZ2lubmluZyBvZiB0aGUgcmVnaW9uXG4gICAgICAgICAgICAgICAgbmV3RWxlbWVudCA9IHRoaXMuX2NyZWF0ZUhVREVsZW1lbnQoZWxlbWVudFBhcmVtcy50eXBlLCBlbGVtZW50TmFtZSwgZWxlbWVudFBhcmVtcy5wcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICB0aGlzLl90cmFja2VkU3RhdHMucHVzaChuZXdFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAvLyBhZGQgdGhlIGVsZW1lbnQgdG8gaXRzIGNvcnJlc3BvbmRlbnQgcmVnaW9uXG4gICAgICAgICAgICAgICAgcmVnaW9uLmFkZEVsZW1lbnQobmV3RWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9yZWdpb25zLnVwZGF0ZUFsbEVsZW1lbnRQb3NpdGlvbnMoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgX2NyZWF0ZUhVREVsZW1lbnQodHlwZSwgbmFtZSwgcHJvcGVydGllcyk6IEhVREVsZW1lbnQge1xuICAgICAgICBsZXQgbmV3RWxlbWVudDogSFVERWxlbWVudDtcbiAgICAgICAgLy8gY3JlYXRlIHByZWZhYiBhY2NvcmRpbmcgdG8gaXRzIHR5cGVcbiAgICAgICAgaWYgKHRoaXMuX3ByZWZhYkVsZW1lbnRzLmhhc093blByb3BlcnR5KHR5cGUpKSB7XG4gICAgICAgICAgICBuZXdFbGVtZW50ID0gbmV3IHRoaXMuX3ByZWZhYkVsZW1lbnRzW3R5cGVdKG5hbWUsIHByb3BlcnRpZXMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbmV3RWxlbWVudCA9IG5ldyB0aGlzLl9wcmVmYWJFbGVtZW50c1tcImJhc2ljX2VsZW1lbnRcIl0oXCJlbXB0eVwiLCB7dGV4dHVyZTogXCJkZW1vblwifSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdFbGVtZW50O1xuICAgIH1cblxuICAgIHB1YmxpYyBub3RpZnlTdGF0Q2hhbmdlKHN0YXQ6IFN0YXQpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuX3RyYWNrZWRTdGF0cy5sZW5ndGggPiBzdGF0LmlkKVxuICAgICAgICAgICAgdGhpcy5fdHJhY2tlZFN0YXRzW3N0YXQuaWRdLnVwZGF0ZUVsZW1lbnQoc3RhdCk7XG4gICAgfVxufSIsImltcG9ydCB7U3ByaXRlfSBmcm9tICdkaWpvbi9kaXNwbGF5JztcbmltcG9ydCBTdGF0IGZyb20gJy4uL3N0YXRzL1N0YXQnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElDaGFyYWN0ZXJEYXRhIHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcbiAgICBrZXk6IHN0cmluZztcbiAgICBzdGF0czogc3RyaW5nW107XG59XG5cbmV4cG9ydCBjbGFzcyBCYXNlT2JqZWN0IGV4dGVuZHMgU3ByaXRlIHtcbiAgICBwcm90ZWN0ZWQgX3N0YXRzOiBTdGF0W107XG4gICAgXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCB4OiBudW1iZXIsIHk6IG51bWJlciwga2V5OiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIoeCwgeSwga2V5KTtcbiAgICAgICAgdGhpcy5fc3RhdHMgPSBbXTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHN0YXRzKCk6IFN0YXRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGF0cztcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkU3RhdChuZXdTdGF0OiBTdGF0KTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3N0YXRzLnB1c2gobmV3U3RhdCk7XG4gICAgfVxuXG4gICAgcHVibGljIGFkZEFsbFN0YXRzKG5ld1N0YXRzOiBTdGF0W10pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fc3RhdHMgPSBuZXdTdGF0czsgICAgXG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBmaW5kU3RhdCh0eXBlOiBzdHJpbmcpOiBTdGF0IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9zdGF0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3N0YXRzW2ldLnR5cGUgPT09IHR5cGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5lcnJvcihcIlNwZWNpZmllZCBzdGF0IG5vdCBmb3VuZCwgcmV0dXJuaW5nIGFuIGVtcHR5IFN0YXRcIik7XG4gICAgICAgIHJldHVybiBuZXcgU3RhdCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZXRyaWV2ZUN1cnJlbnRWYWx1ZSh0eXBlOiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5maW5kU3RhdCh0eXBlKS5jdXJyZW50O1xuICAgIH1cblxuICAgIHB1YmxpYyByZXRyaWV2ZU1heFZhbHVlKHR5cGU6IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbmRTdGF0KHR5cGUpLm1heDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmV0cmlldmVNaW5WYWx1ZSh0eXBlOiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5maW5kU3RhdCh0eXBlKS5taW47XG4gICAgfVxuXG4gICAgcHVibGljIHJlc2V0U3RhdCh0eXBlOiBzdHJpbmcsIG5ld1ZhbHVlOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgbGV0IHN0YXQgPSB0aGlzLmZpbmRTdGF0KHR5cGUpO1xuICAgICAgICBpZiAoc3RhdC50eXBlICE9PSBcIkVNUFRZXCIpIHtcbiAgICAgICAgICAgIHN0YXQucmVzZXRTdGF0KG5ld1ZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhbHRlclN0YXQodHlwZTogc3RyaW5nLCBpbmNyZWFzZUJ5OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgbGV0IHN0YXQgPSB0aGlzLmZpbmRTdGF0KHR5cGUpO1xuICAgICAgICBpZiAoc3RhdC50eXBlICE9PSBcIkVNUFRZXCIpIHtcbiAgICAgICAgICAgIHN0YXQuYWx0ZXJTdGF0KGluY3JlYXNlQnkpO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7QmFzZU9iamVjdH0gZnJvbSAnLi9CYXNlT2JqZWN0J1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGFyYWN0ZXIgZXh0ZW5kcyBCYXNlT2JqZWN0IHtcbiAgICBcbiAgICBjb25zdHJ1Y3RvcihkYXRhOiBhbnkpIHtcbiAgICAgICAgc3VwZXIoZGF0YS5uYW1lLCBkYXRhLngsIGRhdGEueSwgZGF0YS5rZXkpO1xuICAgIH0gIFxufSIsImltcG9ydCBDaGFyYWN0ZXIgZnJvbSAnLi9DaGFyYWN0ZXInXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhlcm8gZXh0ZW5kcyBDaGFyYWN0ZXIge1xuXG4gICAgcHJvdGVjdGVkIF91cEtleTogUGhhc2VyLktleTtcbiAgICBwcm90ZWN0ZWQgX2Rvd25LZXk6IFBoYXNlci5LZXk7XG4gICAgcHJvdGVjdGVkIF9sZWZ0S2V5OiBQaGFzZXIuS2V5O1xuICAgIHByb3RlY3RlZCBfcmlnaHRLZXk6IFBoYXNlci5LZXk7XG4gICAgY29uc3RydWN0b3IoZGF0YTogYW55KSB7XG4gICAgICAgIHN1cGVyKGRhdGEpO1xuXG4gICAgICAgIHRoaXMuX3VwS2V5ID0gdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuVVApO1xuICAgICAgICB0aGlzLl9kb3duS2V5ID0gdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuRE9XTik7XG4gICAgICAgIHRoaXMuX2xlZnRLZXkgPSB0aGlzLmdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5MRUZUKTtcbiAgICAgICAgdGhpcy5fcmlnaHRLZXkgPSB0aGlzLmdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5SSUdIVCk7XG4gICAgfVxuXG4gICAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuX3VwS2V5LmlzRG93bikge1xuICAgICAgICAgICAgdGhpcy55IC09IDI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2Rvd25LZXkuaXNEb3duKSB7XG4gICAgICAgICAgICB0aGlzLnkgKz0gMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fbGVmdEtleS5pc0Rvd24pIHtcbiAgICAgICAgICAgIHRoaXMueCAtPSAyO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9yaWdodEtleS5pc0Rvd24pIHtcbiAgICAgICAgICAgIHRoaXMueCArPSAyO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBCYXNlU3RhdGUgZnJvbSBcIi4vQmFzZVN0YXRlXCI7XG5pbXBvcnQgTWVudU1lZGlhdG9yIGZyb20gJy4uL21lZGlhdG9yL01lbnVNZWRpYXRvcic7XG5pbXBvcnQgSFVEIGZyb20gJy4uL2h1ZC9IVUQnO1xuaW1wb3J0IHtTdGF0TWFuYWdlcn0gZnJvbSAnLi4vc3RhdHMvU3RhdE1hbmFnZXInO1xuaW1wb3J0IHtCYXNlT2JqZWN0LCBJQ2hhcmFjdGVyRGF0YX0gZnJvbSAnLi4vb2JqZWN0cy9CYXNlT2JqZWN0JztcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSAnLi4vb2JqZWN0cy9DaGFyYWN0ZXInO1xuaW1wb3J0IEhlcm8gZnJvbSAnLi4vb2JqZWN0cy9IZXJvJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVudSBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gICAgcHVibGljIGh1ZDogSFVEO1xuICAgIHB1YmxpYyBzdGF0TWFuYWdlcjogU3RhdE1hbmFnZXI7XG4gICAgXG4gICAgLy8gUGhhc2VyLlN0YXRlIG92ZXJyaWRlc1xuICAgIHB1YmxpYyBpbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9tZWRpYXRvciA9IG5ldyBNZW51TWVkaWF0b3IoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHJlbG9hZCgpOiB2b2lkIHtcbiAgICB9XG5cdFx0XG4gICAgLy8gZGlqb24uY29yZS5TdGF0ZSBvdmVycmlkZXNcbiAgICBwdWJsaWMgbGlzdEJ1aWxkU2VxdWVuY2UoKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB0aGlzLl9jcmVhdGVTeXN0ZW1zLFxuICAgICAgICAgICAgdGhpcy5fY3JlYXRlV29ybGQsXG4gICAgICAgICAgICB0aGlzLl9hZGRUZXh0XG4gICAgICAgIF1cbiAgICB9XG5cbiAgICBwdWJsaWMgYWZ0ZXJCdWlsZCgpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIuYWZ0ZXJCdWlsZCgpXG4gICAgfVxuXG4gICAgcHVibGljIF9jcmVhdGVTeXN0ZW1zKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnN0YXRNYW5hZ2VyID0gbmV3IFN0YXRNYW5hZ2VyKHRoaXMubWVkaWF0b3Iuc3RhdERhdGEpO1xuICAgICAgICB0aGlzLmh1ZCA9IG5ldyBIVUQodGhpcy5tZWRpYXRvci5odWREYXRhKTtcbiAgICAgICAgdGhpcy5zdGF0TWFuYWdlci5zZXRIVUQodGhpcy5odWQpO1xuICAgICAgICB0aGlzLmh1ZC5pbml0KCk7XG4gICAgICAgIHRoaXMuZ2FtZS5hZGRUb1VJLmV4aXN0aW5nKHRoaXMuaHVkKTtcbiAgICAgICAgdGhpcy5pbnB1dC5vbkRvd24uYWRkKHRoaXMuc3RhdE1hbmFnZXIubG9nQWxsU3RhdHMsIHRoaXMuc3RhdE1hbmFnZXIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBfY3JlYXRlV29ybGQoKTogdm9pZCB7XG4gICAgICAgIGxldCB3b3JsZERhdGEgPSB0aGlzLm1lZGlhdG9yLndvcmxkRGF0YTtcbiAgICAgICAgLy8gSGFyZCBzZXQgbGV2ZWwgdG8gbG9hZC5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3b3JsZERhdGEubGV2ZWwxLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbmV3RGF0YTogSUNoYXJhY3RlckRhdGEgPSA8SUNoYXJhY3RlckRhdGE+e307XG4gICAgICAgICAgICBsZXQgYmFzZURhdGE6IGFueSA9IHdvcmxkRGF0YS5vYmplY3RzW3dvcmxkRGF0YS5sZXZlbDFbaV0udHlwZV07XG4gICAgICAgICAgICBuZXdEYXRhLnN0YXRzID0gYmFzZURhdGEuc3RhdHM7XG4gICAgICAgICAgICBuZXdEYXRhLmtleSA9IGJhc2VEYXRhLmtleTtcbiAgICAgICAgICAgIG5ld0RhdGEubmFtZSA9IHdvcmxkRGF0YS5sZXZlbDFbaV0udHlwZTtcbiAgICAgICAgICAgIG5ld0RhdGEueCA9IHdvcmxkRGF0YS5sZXZlbDFbaV0ueDtcbiAgICAgICAgICAgIG5ld0RhdGEueSA9IHdvcmxkRGF0YS5sZXZlbDFbaV0ueTtcblxuICAgICAgICAgICAgbGV0IG5ld0NoYXJhY3RlciA9IHRoaXMuX3NwYXduT2JqZWN0KG5ld0RhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLmFkZFRvR2FtZS5leGlzdGluZyhuZXdDaGFyYWN0ZXIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIHByaXZhdGUgbWV0aG9kc1xuICAgIHByaXZhdGUgX2FkZFRleHQoKTogdm9pZCB7XG4gICAgICAgIGxldCB0ZXh0ID0gdGhpcy5hZGQuZFRleHQoMjAwLCAyMDAsICdIVUQgVGVzdCcsICdBcmlhbCcsIDM2LCAnI2ZmZmZmZicpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3VwZGF0ZVN0YXRzKCk6IHZvaWQge1xuICAgICAgICBcbiAgICB9XG5cbiAgICBwcml2YXRlIF9zcGF3bk9iamVjdChkYXRhOiBhbnkpOiBCYXNlT2JqZWN0IHtcbiAgICAgICAgbGV0IG5ld09iaiA9IGRhdGEubmFtZSA9PT0gXCJoZXJvXCIgPyBuZXcgSGVybyhkYXRhKSA6IG5ldyBDaGFyYWN0ZXIoZGF0YSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU3Bhd25pbmcgYSBcIiArIGRhdGEubmFtZSk7XG4gICAgICAgIG5ld09iai5hZGRBbGxTdGF0cyh0aGlzLnN0YXRNYW5hZ2VyLmdldFN0YXRzRm9yQ2hhcmFjdGVyKGRhdGEuc3RhdHMsIG5ld09iai5uYW1lKSk7XG4gICAgICAgIHJldHVybiBuZXdPYmo7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBnZXQgbWVkaWF0b3IoKTogTWVudU1lZGlhdG9yIHtcbiAgICAgICAgcmV0dXJuIDxNZW51TWVkaWF0b3I+dGhpcy5fbWVkaWF0b3I7XG4gICAgfVxufVxuICAiLCJpbXBvcnQge0FwcGxpY2F0aW9ufSBmcm9tIFwiZGlqb24vYXBwbGljYXRpb25cIjtcbmltcG9ydCB7R2FtZX0gZnJvbSBcImRpam9uL2NvcmVcIjtcbmltcG9ydCB7RGV2aWNlfSBmcm9tIFwiZGlqb24vdXRpbHNcIjtcbmltcG9ydCB7Q29weU1vZGVsfSBmcm9tIFwiZGlqb24vbXZjXCI7XG5cbmltcG9ydCBBcHBsaWNhdGlvbk1lZGlhdG9yIGZyb20gXCIuL21lZGlhdG9yL0FwcGxpY2F0aW9uTWVkaWF0b3JcIjtcbmltcG9ydCBDb25zdGFudHMgZnJvbSBcIi4vdXRpbHMvQ29uc3RhbnRzXCI7XG5pbXBvcnQgTm90aWZpY2F0aW9ucyBmcm9tIFwiLi91dGlscy9Ob3RpZmljYXRpb25zXCI7XG5pbXBvcnQgQm9vdCBmcm9tIFwiLi9zdGF0ZS9Cb290XCI7XG5pbXBvcnQgUHJlbG9hZCBmcm9tIFwiLi9zdGF0ZS9QcmVsb2FkXCI7XG5pbXBvcnQgTWVudSBmcm9tIFwiLi9zdGF0ZS9NZW51XCI7XG5pbXBvcnQgR2FtZU1vZGVsIGZyb20gXCIuL21vZGVsL0dhbWVNb2RlbFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIVURBcHBsaWNhdGlvbiBleHRlbmRzIEFwcGxpY2F0aW9uIHtcbiAgICBwdWJsaWMgZ2FtZUlkOiBzdHJpbmcgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgLy8gb3ZlcnJpZGVzXG4gICAgcHVibGljIGNyZWF0ZUdhbWUoKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IG5ldyBHYW1lKHtcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLl9nZXRHYW1lV2lkdGgoKSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5fZ2V0R2FtZUhlaWdodCgpLFxuICAgICAgICAgICAgcGFyZW50OiAnZ2FtZS1jb250YWluZXInLFxuICAgICAgICAgICAgLy9yZW5kZXJlcjogUGhhc2VyLkNBTlZBUyxcbiAgICAgICAgICAgIHJlbmRlcmVyOiBEZXZpY2UuY29jb29uID8gUGhhc2VyLkNBTlZBUyA6IHRoaXMuX2dldFJlbmRlcmVyQnlEZXZpY2UoKSxcbiAgICAgICAgICAgIHRyYW5zcGFyZW50OiBmYWxzZSxcbiAgICAgICAgICAgIC8vIHVzZSB0aGlzIGlmIHlvdSB3YW50IHRvIHN3aXRjaCBiZXR3ZWVuIEAyeCBhbmQgQDF4IGdyYXBoaWNzXG4gICAgICAgICAgICAvL3Jlc29sdXRpb246IHRoaXMuX2dldFJlc29sdXRpb24oKSxcbiAgICAgICAgICAgIHJlc29sdXRpb246IDEsXG4gICAgICAgICAgICBwbHVnaW5zOiBEZXZpY2UubW9iaWxlID8gW10gOiBbJ0RlYnVnJ11cblxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9tZWRpYXRvciA9IG5ldyBBcHBsaWNhdGlvbk1lZGlhdG9yKHRoaXMpO1xuICAgICAgICB0aGlzLl9hZGRTdGF0ZXMoKTtcbiAgICB9XG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICBwdWJsaWMgc3RhcnRHYW1lKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoQ29uc3RhbnRzLlNUQVRFX0JPT1QpO1xuICAgIH1cblxuICAgIHB1YmxpYyBib290Q29tcGxldGUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZ2FtZS50cmFuc2l0aW9uLnRvKENvbnN0YW50cy5TVEFURV9QUkVMT0FEKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRqdXN0U2NhbGVTZXR0aW5ncygpOiB2b2lkIHtcbiAgICAgICAgaWYgKERldmljZS5jb2Nvb24pIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmdhbWUuc2NhbGUucGFnZUFsaWduVmVydGljYWxseSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5nYW1lLmRldmljZS5kZXNrdG9wKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuU0hPV19BTEw7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnNldE1pbk1heCg1MTIsIDM4NCwgMTAyNCwgNzY4KTtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuc2NhbGUucGFnZUFsaWduSG9yaXpvbnRhbGx5ID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuUkVTSVpFO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5nYW1lLnNjYWxlLmZvcmNlTGFuZHNjYXBlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5yZWZyZXNoKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYWRqdXN0UmVuZGVyZXJTZXR0aW5ncygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5nYW1lLnN0YWdlLmRpc2FibGVWaXNpYmlsaXR5Q2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5nYW1lLmZvcmNlU2luZ2xlVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgLy90aGlzLmdhbWUuY2FtZXJhLnJvdW5kUHggPSBmYWxzZTtcbiAgICAgICAgLy90aGlzLmdhbWUucmVuZGVyZXIucmVuZGVyU2Vzc2lvbi5yb3VuZFBpeGVscyA9IGZhbHNlO1xuICAgICAgICAvL3RoaXMuZ2FtZS5hbnRpYWxpYXMgPSB0cnVlO1xuICAgICAgICAvL3RoaXMuZ2FtZS5yZW5kZXJlci5jbGVhckJlZm9yZVJlbmRlciA9IHRoaXMuZ2FtZS5yZW5kZXJUeXBlID09PSBQaGFzZXIuQ0FOVkFTO1xuICAgIH1cblxuICAgIC8vIGNhbGxlZCBmcm9tIHRoZSBib290IHN0YXRlIGFzIHdlIGNhbid0IGluaXRpYWxpemUgcGx1Z2lucyB1bnRpbCB0aGUgZ2FtZSBpcyBib290ZWRcbiAgICBwdWJsaWMgcmVnaXN0ZXJNb2RlbHMoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGdhbWVNb2RlbCA9IG5ldyBHYW1lTW9kZWwoJ2dhbWVfZGF0YScpO1xuICAgICAgICBjb25zdCBjb3B5TW9kZWwgPSBuZXcgQ29weU1vZGVsKCdjb3B5Jyk7XG4gICAgfVxuXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RzXG4gICAgLy8gYWRkcyBzdGF0ZXNcbiAgICBwcml2YXRlIF9hZGRTdGF0ZXMoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5hZGQoQ29uc3RhbnRzLlNUQVRFX0JPT1QsIEJvb3QpO1xuICAgICAgICB0aGlzLmdhbWUuc3RhdGUuYWRkKENvbnN0YW50cy5TVEFURV9QUkVMT0FELCBQcmVsb2FkKTtcbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlLmFkZChDb25zdGFudHMuU1RBVEVfTUVOVSwgTWVudSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZ2V0R2FtZVdpZHRoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBEZXZpY2UuY29jb29uID8gd2luZG93LmlubmVyV2lkdGggOiAxMDI0O1xuICAgIH1cblxuICAgIHByaXZhdGUgX2dldEdhbWVIZWlnaHQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIERldmljZS5jb2Nvb24gPyB3aW5kb3cuaW5uZXJIZWlnaHQgOiA3Njg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZ2V0UmVzb2x1dGlvbigpOiBudW1iZXIge1xuICAgICAgICBpZiAoQXBwbGljYXRpb24ucXVlcnlWYXIoJ3Jlc29sdXRpb24nKSAmJiAhaXNOYU4oQXBwbGljYXRpb24ucXVlcnlWYXIoJ3Jlc29sdXRpb24nKSkpIHtcbiAgICAgICAgICAgIHJldHVybiBBcHBsaWNhdGlvbi5xdWVyeVZhcigncmVzb2x1dGlvbicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChEZXZpY2UuY29jb29uKSB7XG4gICAgICAgICAgICByZXR1cm4gKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvID4gMSA/IDIgOiAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBEZXZpY2UubW9iaWxlID8gMSA6ICh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyA+IDEgPyAyIDogMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIF9nZXRSZW5kZXJlckJ5RGV2aWNlKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBEZXZpY2UubW9iaWxlICYmIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIDwgMiA/IFBoYXNlci5DQU5WQVMgOiBQaGFzZXIuQVVUTztcbiAgICB9XG4gICAgXG4gICAgLy8gZ2V0dGVyIC8gc2V0dGVyXG4gICAgcHVibGljIGdldCBtZWRpYXRvcigpOiBBcHBsaWNhdGlvbk1lZGlhdG9yIHtcbiAgICAgICAgcmV0dXJuIDxBcHBsaWNhdGlvbk1lZGlhdG9yPnRoaXMuX21lZGlhdG9yO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgZ2FtZU1vZGVsKCk6IEdhbWVNb2RlbCB7XG4gICAgICAgIHJldHVybiA8R2FtZU1vZGVsPnRoaXMucmV0cmlldmVNb2RlbChHYW1lTW9kZWwuTU9ERUxfTkFNRSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBjb3B5TW9kZWwoKTogQ29weU1vZGVsIHtcbiAgICAgICAgcmV0dXJuIDxDb3B5TW9kZWw+dGhpcy5yZXRyaWV2ZU1vZGVsKENvcHlNb2RlbC5NT0RFTF9OQU1FKTtcbiAgICB9XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3N1Ym1vZHVsZXMvZGlqb24vZGlqb24uZC50c1wiLz4gIFxuaW1wb3J0IEhVREFwcGxpY2F0aW9uIGZyb20gJy4vSFVEQXBwbGljYXRpb24nO1xuXG4vLyBib290c3RyYXAgdGhlIGFwcFxuZXhwb3J0IGNvbnN0IGFwcCA9IG5ldyBIVURBcHBsaWNhdGlvbigpOyIsImltcG9ydCBTdGF0IGZyb20gJy4vU3RhdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoYXJhY3RlclN0YXRzIHtcbiAgICBwdWJsaWMgc3RhdHM6IGFueTtcbiAgICBjb25zdHJ1Y3RvcigpIHsgXG4gICAgICAgIHRoaXMuc3RhdHMgPSBbXTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkU3RhdChuZXdTdGF0OiBTdGF0KTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3RhdHMucHVzaChuZXdTdGF0KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZmluZFN0YXQodHlwZTogc3RyaW5nKTogU3RhdCB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zdGF0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHNbaV0udHlwZSA9PT0gdHlwZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YXRzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJTcGVjaWZpZWQgc3RhdCBub3QgZm91bmQsIHJldHVybmluZyBhbiBlbXB0eSBTdGF0XCIpO1xuICAgICAgICByZXR1cm4gbmV3IFN0YXQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmV0cmlldmVDdXJyZW50VmFsdWUodHlwZTogc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluZFN0YXQodHlwZSkuY3VycmVudDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmV0cmlldmVNYXhWYWx1ZSh0eXBlOiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5maW5kU3RhdCh0eXBlKS5tYXg7XG4gICAgfVxuXG4gICAgcHVibGljIHJldHJpZXZlTWluVmFsdWUodHlwZTogc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluZFN0YXQodHlwZSkubWluO1xuICAgIH1cbn0iLCJpbXBvcnQge0dyb3VwLCBUZXh0fSBmcm9tICdkaWpvbi9kaXNwbGF5JztcbmltcG9ydCB7SVByZWxvYWRIYW5kbGVyfSBmcm9tICdkaWpvbi9pbnRlcmZhY2VzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJlbG9hZGVyIGV4dGVuZHMgR3JvdXAgaW1wbGVtZW50cyBJUHJlbG9hZEhhbmRsZXIge1xuICAgIHN0YXRpYyBURVNUOiBudW1iZXIgPSAxO1xuICAgIHN0YXRpYyBURVNUXzI6IG51bWJlciA9IDI7XG5cbiAgICBwcml2YXRlIF93aXBlcjogUGhhc2VyLkltYWdlO1xuICAgIHByaXZhdGUgX2xvYWRUZXh0OiBUZXh0O1xuXG4gICAgcHVibGljIHRyYW5zaXRpb25JbkNvbXBsZXRlOiBQaGFzZXIuU2lnbmFsID0gbmV3IFBoYXNlci5TaWduYWwoKTtcbiAgICBwdWJsaWMgdHJhbnNpdGlvbk91dENvbXBsZXRlOiBQaGFzZXIuU2lnbmFsID0gbmV3IFBoYXNlci5TaWduYWwoKTtcblxuICAgIHByaXZhdGUgX2luVHdlZW46IFBoYXNlci5Ud2VlbjtcbiAgICBwcml2YXRlIF9vdXRUd2VlbjogUGhhc2VyLlR3ZWVuO1xuXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIsIG5hbWU6IHN0cmluZykge1xuICAgICAgICBzdXBlcih4LCB5LCBuYW1lLCB0cnVlKTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIHRoaXMuYnVpbGRJbnRlcmZhY2UoKTtcbiAgICB9XG5cbiAgICAvLyBHcm91cCBvdmVycmlkZXNcbiAgICBwcm90ZWN0ZWQgYnVpbGRJbnRlcmZhY2UoKSB7XG4gICAgICAgIHRoaXMuX2xvYWRUZXh0ID0gdGhpcy5hZGRJbnRlcm5hbC5kVGV4dCg1MCwgNTAsICdMb2FkaW5nIC4uLiAnLCAnQXJpYWwnLCAzNiwgJyNGRkZGRkYnKTtcblxuICAgICAgICBsZXQgZ2Z4ID0gdGhpcy5nYW1lLmFkZC5ncmFwaGljcygpO1xuICAgICAgICBnZnguYmVnaW5GaWxsKDB4MDAwMDAwLCAxKTtcbiAgICAgICAgZ2Z4LmRyYXdSZWN0KDAsIDAsIHRoaXMuZ2FtZS53aWR0aCwgdGhpcy5nYW1lLmhlaWdodCk7XG4gICAgICAgIGdmeC5lbmRGaWxsKCk7XG5cbiAgICAgICAgdGhpcy5fd2lwZXIgPSB0aGlzLmFkZEludGVybmFsLmltYWdlKDAsIDAsIGdmeC5nZW5lcmF0ZVRleHR1cmUoKSk7XG5cbiAgICAgICAgdGhpcy5nYW1lLndvcmxkLnJlbW92ZShnZngsIHRydWUpO1xuXG4gICAgICAgIHRoaXMuYWxwaGEgPSAwO1xuICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLl9pblR3ZWVuID0gdGhpcy5nYW1lLmFkZC50d2Vlbih0aGlzKS50byh7IGFscGhhOiAxIH0sIDMwMCwgUGhhc2VyLkVhc2luZy5RdWFkcmF0aWMuT3V0KTtcbiAgICAgICAgdGhpcy5fb3V0VHdlZW4gPSB0aGlzLmdhbWUuYWRkLnR3ZWVuKHRoaXMpLnRvKHsgYWxwaGE6IDAgfSwgMjAwLCBQaGFzZXIuRWFzaW5nLlF1YWRyYXRpYy5Jbik7XG5cbiAgICAgICAgdGhpcy5faW5Ud2Vlbi5vbkNvbXBsZXRlLmFkZCh0aGlzLl9pbiwgdGhpcyk7XG4gICAgICAgIHRoaXMuX291dFR3ZWVuLm9uQ29tcGxldGUuYWRkKHRoaXMuX291dCwgdGhpcyk7XG4gICAgfVxuXG4gICAgLy8gaVByZWxvYWRIYW5kbGVyIGltcGxlbWVudGF0aW9uc1xuICAgIHB1YmxpYyBsb2FkU3RhcnQoKSB7XG4gICAgfVxuXG4gICAgcHVibGljIGxvYWRQcm9ncmVzcyhwcm9ncmVzczogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHJvdW5kZWRQcm9ncmVzcyA9IE1hdGgucm91bmQocHJvZ3Jlc3MpLnRvU3RyaW5nKCk7XG4gICAgICAgIHRoaXMuX2xvYWRUZXh0LnNldFRleHQoJ0xvYWRpbmcgLi4uICcgKyByb3VuZGVkUHJvZ3Jlc3MgKyAnJScpO1xuICAgIH1cblxuICAgIHB1YmxpYyBsb2FkQ29tcGxldGUoKSB7XG4gICAgfVxuXG4gICAgcHVibGljIHRyYW5zaXRpb25JbigpIHtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5faW5Ud2Vlbi5zdGFydCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0cmFuc2l0aW9uT3V0KCkge1xuICAgICAgICB0aGlzLl9vdXRUd2Vlbi5zdGFydCgpO1xuICAgIH1cblxuICAgIC8vIHByaXZhdGUgbWV0aG9kc1xuICAgIHByb3RlY3RlZCBfaW4oKSB7XG4gICAgICAgIHRoaXMudHJhbnNpdGlvbkluQ29tcGxldGUuZGlzcGF0Y2goKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgX291dCgpIHtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMudHJhbnNpdGlvbk91dENvbXBsZXRlLmRpc3BhdGNoKCk7XG4gICAgfVxufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
