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
                Object.defineProperty(GameModel.prototype, "hudData", {
                    get: function () {
                        return this._data.hud;
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
                        return this.gameModel.hudData;
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
                }
                HUDElement.prototype._parseProperties = function (properties) {
                };
                HUDElement.prototype.updateElement = function (newStat) {
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
System.register("hud/HUDStatWithBar", ["hud/HUDElement"], function(exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
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
            exports_14("default", HUDStatWithBar);
        }
    }
});
System.register("hud/HUDStatWithText", ["hud/HUDElement"], function(exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
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
            exports_15("default", HUDStatWithText);
        }
    }
});
System.register("hud/HUD", ['dijon/display', "hud/HUDRegions", "hud/HUDElement", "hud/HUDStatWithBar", "hud/HUDStatWithText"], function(exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
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
                }
                HUD.prototype.init = function () {
                    this._statID = 0;
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
                            region.addElement(newElement);
                            this._statID++;
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
                return HUD;
            }(display_3.Group));
            exports_16("default", HUD);
        }
    }
});
System.register("state/Menu", ["state/BaseState", "mediator/MenuMediator", "hud/HUD"], function(exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    var BaseState_3, MenuMediator_1, HUD_1;
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
            }],
        execute: function() {
            Menu = (function (_super) {
                __extends(Menu, _super);
                function Menu() {
                    _super.apply(this, arguments);
                }
                Menu.prototype.init = function () {
                    this._mediator = new MenuMediator_1.default();
                    this.input.onDown.add(this._updateStats, this);
                };
                Menu.prototype.preload = function () {
                };
                Menu.prototype.listBuildSequence = function () {
                    return [
                        this._addText,
                        this._addHUD
                    ];
                };
                Menu.prototype.afterBuild = function () {
                    _super.prototype.afterBuild.call(this);
                };
                Menu.prototype._addText = function () {
                    var text = this.add.dText(200, 200, 'HUD Test', 'Arial', 36, '#ffffff');
                };
                Menu.prototype._addHUD = function () {
                    this.hud = new HUD_1.default(this.mediator.hudData);
                    this.hud.init();
                    this.game.addToUI.existing(this.hud);
                };
                Menu.prototype._updateStats = function () {
                    this.hud.update();
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
            exports_17("default", Menu);
        }
    }
});
System.register("HUDApplication", ["dijon/application", "dijon/core", "dijon/utils", "dijon/mvc", "mediator/ApplicationMediator", "utils/Constants", "state/Boot", "state/Preload", "state/Menu", "model/GameModel"], function(exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
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
            exports_18("default", HUDApplication);
        }
    }
});
System.register("bootstrap", ["HUDApplication"], function(exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    var HUDApplication_1;
    var app;
    return {
        setters:[
            function (HUDApplication_1_1) {
                HUDApplication_1 = HUDApplication_1_1;
            }],
        execute: function() {
            exports_19("app", app = new HUDApplication_1.default());
        }
    }
});
System.register("ui/Preloader", ['dijon/display'], function(exports_20, context_20) {
    "use strict";
    var __moduleName = context_20 && context_20.id;
    var display_4;
    var Preloader;
    return {
        setters:[
            function (display_4_1) {
                display_4 = display_4_1;
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
            }(display_4.Group));
            exports_20("default", Preloader);
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZGVsL0dhbWVNb2RlbC50cyIsIm1lZGlhdG9yL0Jhc2VNZWRpYXRvci50cyIsInV0aWxzL0NvbnN0YW50cy50cyIsInV0aWxzL05vdGlmaWNhdGlvbnMudHMiLCJtZWRpYXRvci9BcHBsaWNhdGlvbk1lZGlhdG9yLnRzIiwic3RhdGUvQmFzZVN0YXRlLnRzIiwibWVkaWF0b3IvQm9vdE1lZGlhdG9yLnRzIiwic3RhdGUvQm9vdC50cyIsIm1lZGlhdG9yL1ByZWxvYWRNZWRpYXRvci50cyIsInN0YXRlL1ByZWxvYWQudHMiLCJtZWRpYXRvci9NZW51TWVkaWF0b3IudHMiLCJodWQvSFVERWxlbWVudC50cyIsImh1ZC9IVURSZWdpb25zLnRzIiwiaHVkL0hVRFN0YXRXaXRoQmFyLnRzIiwiaHVkL0hVRFN0YXRXaXRoVGV4dC50cyIsImh1ZC9IVUQudHMiLCJzdGF0ZS9NZW51LnRzIiwiSFVEQXBwbGljYXRpb24udHMiLCJib290c3RyYXAudHMiLCJ1aS9QcmVsb2FkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztZQUVBO2dCQUF1Qyw2QkFBSztnQkFBNUM7b0JBQXVDLDhCQUFLO2dCQVU1QyxDQUFDO2dCQVBHLHNCQUFXLDJCQUFJO3lCQUFmO3dCQUNJLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO29CQUNoQyxDQUFDOzs7bUJBQUE7Z0JBRUQsc0JBQVcsOEJBQU87eUJBQWxCO3dCQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztvQkFDMUIsQ0FBQzs7O21CQUFBO2dCQVJhLG9CQUFVLEdBQVcsV0FBVyxDQUFDO2dCQVNuRCxnQkFBQztZQUFELENBVkEsQUFVQyxDQVZzQyxXQUFLLEdBVTNDO1lBVkQsK0JBVUMsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lDUEQ7Z0JBQTBDLGdDQUFRO2dCQUFsRDtvQkFBMEMsOEJBQVE7Z0JBb0JsRCxDQUFDO2dCQWpCVSw4QkFBTyxHQUFk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QUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUNyRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUN0SSxDQUFDO29CQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUVoQyxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLFlBQVksR0FBRyxrQkFBa0IsQ0FBQyxDQUFDO3dCQUN2RyxRQUFRLEdBQUcsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQzlFLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQVUsT0FBTzs0QkFDbkMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDM0MsUUFBUSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDOzRCQUNy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QVksR0FBbkI7Z0JBQ0EsQ0FBQztnQkFFTSxnQ0FBWSxHQUFuQjtvQkFDSSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztvQkFDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDMUIsQ0FBQztnQkFFTSxpQ0FBYSxHQUFwQjtvQkFDSSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUMzQixDQUFDO2dCQUdTLHVCQUFHLEdBQWI7b0JBQ0ksSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUN6QyxDQUFDO2dCQUVTLHdCQUFJLEdBQWQ7b0JBQ0ksSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7b0JBQ3JCLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDMUMsQ0FBQztnQkF0RU0sY0FBSSxHQUFXLENBQUMsQ0FBQztnQkFDakIsZ0JBQU0sR0FBVyxDQUFDLENBQUM7Z0JBc0U5QixnQkFBQztZQUFELENBeEVBLEFBd0VDLENBeEVzQyxlQUFLLEdBd0UzQztZQXhFRCxnQ0F3RUMsQ0FBQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge01vZGVsfSBmcm9tICdkaWpvbi9tdmMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lTW9kZWwgZXh0ZW5kcyBNb2RlbCB7XG4gICAgcHVibGljIHN0YXRpYyBNT0RFTF9OQU1FOiBzdHJpbmcgPSBcImdhbWVNb2RlbFwiO1xuXG4gICAgcHVibGljIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBHYW1lTW9kZWwuTU9ERUxfTkFNRTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGh1ZERhdGEoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGEuaHVkO1xuICAgIH1cbn0iLCJpbXBvcnQge01lZGlhdG9yLCBDb3B5TW9kZWx9IGZyb20gXCJkaWpvbi9tdmNcIjtcbmltcG9ydCB7QXBwbGljYXRpb259IGZyb20gXCJkaWpvbi9hcHBsaWNhdGlvblwiO1xuXG5pbXBvcnQgR2FtZU1vZGVsIGZyb20gXCIuLi9tb2RlbC9HYW1lTW9kZWxcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZU1lZGlhdG9yIGV4dGVuZHMgTWVkaWF0b3Ige1xuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgLy8gc28gYW55IG1lZGlhdG9yIGV4dGVuZGluZyBCYXNlTWVkaWF0b3IgY2FuIGdldCBjb3B5XG4gICAgcHVibGljIGdldENvcHkoZ3JvdXBJZDogc3RyaW5nLCB0ZXh0SWQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvcHlNb2RlbC5nZXRDb3B5KGdyb3VwSWQsIHRleHRJZCk7XG4gICAgfVxuXHRcdFxuICAgIC8vIGdldHRlciAvIHNldHRlclxuICAgIC8vIG9mZmVyIGFjY2VzcyB0byB0aGUgR2FtZU1vZGVsIGFuZCBDb3B5TW9kZWwgZnJvbSBhbnkgbWVkaWF0b3IgZXh0ZW5kaW5nIEJhc2VNZWRpYXRvclxuICAgIHB1YmxpYyBnZXQgZ2FtZU1vZGVsKCk6IEdhbWVNb2RlbCB7XG4gICAgICAgIHJldHVybiA8R2FtZU1vZGVsPkFwcGxpY2F0aW9uLmdldEluc3RhbmNlKCkucmV0cmlldmVNb2RlbChHYW1lTW9kZWwuTU9ERUxfTkFNRSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBjb3B5TW9kZWwoKTogQ29weU1vZGVsIHtcbiAgICAgICAgcmV0dXJuIDxDb3B5TW9kZWw+QXBwbGljYXRpb24uZ2V0SW5zdGFuY2UoKS5yZXRyaWV2ZU1vZGVsKENvcHlNb2RlbC5NT0RFTF9OQU1FKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IG5hbWUoKTogc3RyaW5nIHsgXG4gICAgICAgIHJldHVybiBcImJhc2VNZWRpYXRvcl9cIiArIHRoaXMuZ2FtZS5ybmQudXVpZCgpO1xuICAgIH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb25zdGFudHMge1xuICAgIHN0YXRpYyBTVEFURV9CT09UOiBzdHJpbmcgPSAnYm9vdCc7XG4gICAgc3RhdGljIFNUQVRFX1BSRUxPQUQ6IHN0cmluZyA9ICdwcmVsb2FkJztcbiAgICBzdGF0aWMgU1RBVEVfTUVOVTogc3RyaW5nID0gJ21lbnUnO1xuICAgIC8vIGZvbnRzXG4gICAgc3RhdGljIEZPTlRfS09NSUtBWDogc3RyaW5nID0gJ2tvbWlrYXgnO1xufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vdGlmaWNhdGlvbnMge1xuICAgIHN0YXRpYyBCT09UX0lOSVQ6IHN0cmluZyA9ICdib290SW5pdCc7XG4gICAgc3RhdGljIEJPT1RfQ09NUExFVEU6IHN0cmluZyA9ICdib290Q29tcGxldGUnO1xufSIsImltcG9ydCB7TG9nZ2VyfSBmcm9tIFwiZGlqb24vdXRpbHNcIjtcbmltcG9ydCB7SU5vdGlmaWNhdGlvbn0gZnJvbSBcImRpam9uL2ludGVyZmFjZXNcIjtcblxuaW1wb3J0IEJhc2VNZWRpYXRvciBmcm9tICcuL0Jhc2VNZWRpYXRvcic7XG5pbXBvcnQgQ29uc3RhbnRzIGZyb20gJy4uL3V0aWxzL0NvbnN0YW50cyc7XG5pbXBvcnQgTm90aWZpY2F0aW9ucyBmcm9tICcuLi91dGlscy9Ob3RpZmljYXRpb25zJztcbmltcG9ydCBIVURBcHBsaWNhdGlvbiBmcm9tICcuLi9IVURBcHBsaWNhdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFwcGxpY2F0aW9uTWVkaWF0b3IgZXh0ZW5kcyBCYXNlTWVkaWF0b3Ige1xuICAgIHB1YmxpYyBzdGF0aWMgTUVESUFUT1JfTkFNRTogc3RyaW5nID0gJ0FwcGxpY2F0aW9uTWVkaWF0b3InO1xuXG4gICAgLy8gZGlqb24ubXZjLk1lZGlhdG9yIG92ZXJyaWRlc1xuICAgIHB1YmxpYyBsaXN0Tm90aWZpY2F0aW9uSW50ZXJlc3RzKCk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIE5vdGlmaWNhdGlvbnMuQk9PVF9JTklULFxuICAgICAgICAgICAgTm90aWZpY2F0aW9ucy5CT09UX0NPTVBMRVRFXG4gICAgICAgIF1cbiAgICB9XG5cbiAgICBwdWJsaWMgaGFuZGxlTm90aWZpY2F0aW9uKG5vdGlmaWNhdGlvbjogSU5vdGlmaWNhdGlvbikge1xuICAgICAgICBzd2l0Y2ggKG5vdGlmaWNhdGlvbi5nZXROYW1lKCkpIHtcbiAgICAgICAgICAgIGNhc2UgTm90aWZpY2F0aW9ucy5CT09UX0lOSVQ6XG4gICAgICAgICAgICAgICAgTG9nZ2VyLmxvZyh0aGlzLCAnTm90aWZpY2F0aW9ucy5CT09UX0lOSVQnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdDb21wb25lbnQuYWRqdXN0U2NhbGVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgIHRoaXMudmlld0NvbXBvbmVudC5hZGp1c3RSZW5kZXJlclNldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy52aWV3Q29tcG9uZW50LmFkZFBsdWdpbnMoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgTm90aWZpY2F0aW9ucy5CT09UX0NPTVBMRVRFOlxuICAgICAgICAgICAgICAgIExvZ2dlci5sb2codGhpcywgJ05vdGlmaWNhdGlvbnMuQk9PVF9DT01QTEVURScpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5hc3NldC5zZXREYXRhKHRoaXMuZ2FtZS5jYWNoZS5nZXRKU09OKCdhc3NldHMnKSk7XG4gICAgICAgICAgICAgICAgdGhpcy52aWV3Q29tcG9uZW50LnJlZ2lzdGVyTW9kZWxzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnRyYW5zaXRpb24udG8oQ29uc3RhbnRzLlNUQVRFX1BSRUxPQUQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gZ2V0dGVyIC8gc2V0dGVyXG4gICAgcHVibGljIGdldCB2aWV3Q29tcG9uZW50KCk6IEhVREFwcGxpY2F0aW9uIHtcbiAgICAgICAgcmV0dXJuIDxIVURBcHBsaWNhdGlvbj50aGlzLl92aWV3Q29tcG9uZW50O1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgbmFtZSgpOnN0cmluZyB7XG4gICAgICAgIHJldHVybiBBcHBsaWNhdGlvbk1lZGlhdG9yLk1FRElBVE9SX05BTUU7XG4gICAgfVxufSIsImltcG9ydCB7U3RhdGV9IGZyb20gXCJkaWpvbi9jb3JlXCI7XG5pbXBvcnQgQmFzZU1lZGlhdG9yIGZyb20gXCIuLi9tZWRpYXRvci9CYXNlTWVkaWF0b3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZVN0YXRlIGV4dGVuZHMgU3RhdGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbn0iLCJpbXBvcnQgQmFzZU1lZGlhdG9yIGZyb20gJy4vQmFzZU1lZGlhdG9yJztcbmltcG9ydCBOb3RpZmljYXRpb25zIGZyb20gJy4uL3V0aWxzL05vdGlmaWNhdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb290TWVkaWF0b3IgZXh0ZW5kcyBCYXNlTWVkaWF0b3Ige1xuICAgIHB1YmxpYyBzdGF0aWMgTUVESUFUT1JfTkFNRTogc3RyaW5nID0gJ2Jvb3RNZWRpYXRvcic7XG5cdFx0XG4gICAgLy8gZGlqb24ubXZjLk1lZGlhdG9yIG92ZXJyaWRlc1xuICAgIHB1YmxpYyBvblJlZ2lzdGVyKCkge1xuICAgICAgICB0aGlzLnNlbmROb3RpZmljYXRpb24oTm90aWZpY2F0aW9ucy5CT09UX0lOSVQpO1xuICAgIH1cblx0XHRcbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xuICAgIC8vIGNhbGxlZCBmcm9tIHZpZXdDb21wb25lbnRcbiAgICBwdWJsaWMgYm9vdENvbXBsZXRlKCkge1xuICAgICAgICB0aGlzLnNlbmROb3RpZmljYXRpb24oTm90aWZpY2F0aW9ucy5CT09UX0NPTVBMRVRFKTtcbiAgICB9XG5cdFx0XG4gICAgLy8gZ2V0dGVyIC8gc2V0dGVyXG4gICAgcHVibGljIGdldCBuYW1lKCk6c3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIEJvb3RNZWRpYXRvci5NRURJQVRPUl9OQU1FO1xuICAgIH1cbn0iLCJpbXBvcnQgQmFzZVN0YXRlIGZyb20gXCIuL0Jhc2VTdGF0ZVwiO1xuaW1wb3J0IEJvb3RNZWRpYXRvciBmcm9tIFwiLi4vbWVkaWF0b3IvQm9vdE1lZGlhdG9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvb3QgZXh0ZW5kcyBCYXNlU3RhdGUge1xuICAgIC8vIFBoYXNlci5TdGF0ZSBvdmVycmlkZXNcbiAgICBwdWJsaWMgaW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fbWVkaWF0b3IgPSBuZXcgQm9vdE1lZGlhdG9yKHRoaXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBwcmVsb2FkKCk6IHZvaWQge1xuICAgICAgICBpZiAod2luZG93Wyd2ZXJzaW9uJ10gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5nYW1lLmFzc2V0LmNhY2hlQnVzdFZlcnNpb24gPSAnQEB2ZXJzaW9uJztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdhbWUuYXNzZXQubG9hZEpTT04oJ2dhbWVfZGF0YScpO1xuICAgICAgICB0aGlzLmdhbWUuYXNzZXQubG9hZEpTT04oJ2Fzc2V0cycpO1xuICAgICAgICB0aGlzLmdhbWUuYXNzZXQubG9hZEpTT04oJ2NvcHknKTtcbiAgICAgICAgdGhpcy5nYW1lLmFzc2V0LmxvYWRCaXRtYXBGb250KCdrb21pa2F4Jyk7XG4gICAgfVxuXG4gICAgLy8gZGlqb24uY29yZS5TdGF0ZSBvdmVycmlkZXNcbiAgICBwdWJsaWMgYnVpbGRJbnRlcmZhY2UoKTogdm9pZCB7XG4gICAgICAgIHRoaXMubWVkaWF0b3IuYm9vdENvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RzXG5cbiAgICAvLyBnZXR0ZXIgLyBzZXR0ZXJcbiAgICBwcm90ZWN0ZWQgZ2V0IG1lZGlhdG9yKCk6IEJvb3RNZWRpYXRvciB7XG4gICAgICAgIHJldHVybiA8Qm9vdE1lZGlhdG9yPnRoaXMuX21lZGlhdG9yO1xuICAgIH1cbn0iLCJpbXBvcnQge0lOb3RpZmljYXRpb259IGZyb20gJ2Rpam9uL2ludGVyZmFjZXMnO1xuaW1wb3J0IENvbnN0YW50cyBmcm9tIFwiLi4vdXRpbHMvQ29uc3RhbnRzXCI7XG5pbXBvcnQgQmFzZU1lZGlhdG9yIGZyb20gJy4vQmFzZU1lZGlhdG9yJztcbmltcG9ydCBOb3RpZmljYXRpb25zIGZyb20gJy4uL3V0aWxzL05vdGlmaWNhdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcmVsb2FkTWVkaWF0b3IgZXh0ZW5kcyBCYXNlTWVkaWF0b3Ige1xuICAgIHB1YmxpYyBzdGF0aWMgTUVESUFUT1JfTkFNRTogc3RyaW5nID0gJ3ByZWxvYWRNZWRpYXRvcic7XG5cdFx0XG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICAvLyBjYWxsZWQgZnJvbSBQcmVsb2FkIHN0YXRlXG5cbiAgICBwdWJsaWMgbmV4dCgpOiB2b2lke1xuICAgICAgICB0aGlzLmdhbWUudHJhbnNpdGlvbi50byhDb25zdGFudHMuU1RBVEVfTUVOVSk7XG4gICAgfVxuXHRcdFxuICAgIC8vIGdldHRlciAvIHNldHRlclxuICAgIHB1YmxpYyBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIFByZWxvYWRNZWRpYXRvci5NRURJQVRPUl9OQU1FO1xuICAgIH1cbn0iLCJpbXBvcnQgQmFzZVN0YXRlIGZyb20gXCIuL0Jhc2VTdGF0ZVwiO1xuaW1wb3J0IENvbnN0YW50cyBmcm9tIFwiLi4vdXRpbHMvQ29uc3RhbnRzXCI7XG5pbXBvcnQgUHJlbG9hZE1lZGlhdG9yIGZyb20gXCIuLi9tZWRpYXRvci9QcmVsb2FkTWVkaWF0b3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJlbG9hZCBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gICAgLy8gUGhhc2VyLlN0YXRlIG92ZXJyaWRlc1xuICAgIHB1YmxpYyBpbml0KCkge1xuICAgICAgICB0aGlzLl9tZWRpYXRvciA9IG5ldyBQcmVsb2FkTWVkaWF0b3IodGhpcyk7XG4gICAgfVxuXG4gICAgcHVibGljIHByZWxvYWQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZ2FtZS5hc3NldC5sb2FkQXNzZXRzKCdyZXF1aXJlZCcpO1xuICAgIH1cblx0XHRcbiAgICAvLyBkaWpvbi5jb3JlLlN0YXRlIG92ZXJyaWRlc1xuICAgIHB1YmxpYyBsaXN0QnVpbGRTZXF1ZW5jZSgpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHRoaXMuX2FkZFByZWxvYWRlclxuICAgICAgICBdXG4gICAgfVxuXG4gICAgcHVibGljIGFmdGVyQnVpbGQoKSB7XG4gICAgICAgLy8gdGhpcy5nYW1lLmF1ZGlvLnBsYXlBdWRpbygnbWVudV9sb29wJywgMC4zLCB0cnVlKTtcbiAgICB9XG5cdFx0XG4gICAgLy8gcHJpdmF0ZSBtZXRob2RzXG4gICAgcHJpdmF0ZSBfYWRkUHJlbG9hZGVyKCkge1xuICAgICAgICBjb25zdCB0ZXN0ID0gdGhpcy5hZGQuZFRleHQoNTAsIDE1MCwgdGhpcy5tZWRpYXRvci5nZXRDb3B5KCdwcmVsb2FkJywgJ3RpdGxlJyksICdBcmlhbCcsIDQ1LCAnI2ZmZmZmZicpLFxuICAgICAgICAgICAgYm1UZXh0ID0gdGhpcy5hZGQuYml0bWFwVGV4dCg1MCwgMzAwLCBDb25zdGFudHMuRk9OVF9LT01JS0FYLCAnQml0bWFwIGZvbnQnLCA2MCksXG4gICAgICAgICAgICBidXR0b24gPSB0aGlzLmFkZC5idXR0b24odGhpcy5nYW1lLndpZHRoIC0gMjUwLCAyMCwgJ21lbnUnLCB0aGlzLl9uZXh0LCB0aGlzLCAnbmV4dF9idXR0b24vb3ZlcicsICduZXh0X2J1dHRvbi91cCcsICduZXh0X2J1dHRvbi9kb3duJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfbmV4dCgpIHtcbiAgICAgICAgdGhpcy5nYW1lLmF1ZGlvLnBsYXlBdWRpbygnd3lvbWluZ19yb2FyJyk7XG4gICAgICAgIC8vIHRlc3QgYWRkaW5nIHNvbWV0aGluZyB0byB0aGUgXCJTdGFnZVwiIG5vdCB0aGUgR2FtZSB3b3JsZFxuICAgICAgICB0aGlzLm1lZGlhdG9yLm5leHQoKTtcbiAgICB9XG5cdFx0XG4gICAgLy8gcHVibGljIG1ldGhvZHNcblx0XHRcbiAgICAvLyBnZXR0ZXIgLyBzZXR0ZXJcbiAgICBwcm90ZWN0ZWQgZ2V0IG1lZGlhdG9yKCk6IFByZWxvYWRNZWRpYXRvciB7XG4gICAgICAgIHJldHVybiA8UHJlbG9hZE1lZGlhdG9yPnRoaXMuX21lZGlhdG9yO1xuICAgIH1cbn1cbiAiLCJpbXBvcnQge0lOb3RpZmljYXRpb259IGZyb20gJ2Rpam9uL2ludGVyZmFjZXMnO1xuaW1wb3J0IENvbnN0YW50cyBmcm9tIFwiLi4vdXRpbHMvQ29uc3RhbnRzXCI7XG5pbXBvcnQgQmFzZU1lZGlhdG9yIGZyb20gJy4vQmFzZU1lZGlhdG9yJztcbmltcG9ydCBOb3RpZmljYXRpb25zIGZyb20gJy4uL3V0aWxzL05vdGlmaWNhdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZW51TWVkaWF0b3IgZXh0ZW5kcyBCYXNlTWVkaWF0b3Ige1xuICAgIHB1YmxpYyBzdGF0aWMgTUVESUFUT1JfTkFNRTogc3RyaW5nID0gJ21lbnVNZWRpYXRvcic7XG5cdFx0XG4gICAgLy8gZ2V0dGVyIC8gc2V0dGVyXG4gICAgcHVibGljIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBNZW51TWVkaWF0b3IuTUVESUFUT1JfTkFNRTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGh1ZERhdGEoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2FtZU1vZGVsLmh1ZERhdGE7XG4gICAgfVxufSIsImltcG9ydCB7U3ByaXRlfSBmcm9tICdkaWpvbi9kaXNwbGF5JztcblxuLy8gU3RydWN0dXJlIG9mIGEgdGhlIHZpc3VhbCBwcm9wZXJ0aWVzIGZvciBhIHNwZWNpZmljIEhVRCBlbGVtZW50LlxuZXhwb3J0IGludGVyZmFjZSBJSFVERWxlbWVudFByb3BlcnRpZXMge1xuICAgIHNjYWxlOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH07XG4gICAgYW5jaG9yOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH07XG4gICAgdGV4dHVyZTogc3RyaW5nO1xuICAgIGtleTogc3RyaW5nO1xuICAgIHRleHRTdHlsZTogeyBmb250OiBzdHJpbmcsIHNpemU6IG51bWJlciwgY29sb3I6IHN0cmluZyB9O1xuICAgIGJhclNjYWxpbmc6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfTtcbiAgICBtYXhTaXplOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVN0YXQge1xuICAgIG1pbjogbnVtYmVyO1xuICAgIGN1cnJlbnQ6IG51bWJlcjtcbiAgICBuZXh0OiBudW1iZXI7XG4gICAgbWF4OiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBIVURFbGVtZW50IGV4dGVuZHMgU3ByaXRlIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHByb3BlcnRpZXM6IGFueSkge1xuICAgICAgICBzdXBlcigwLCAwLCBwcm9wZXJ0aWVzLnRleHR1cmUsIG51bGwsIG5hbWUpO1xuXG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLnNjYWxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICB0aGlzLnNjYWxlID0gbmV3IFBoYXNlci5Qb2ludChwcm9wZXJ0aWVzLnNjYWxlLngsIHByb3BlcnRpZXMuc2NhbGUueSlcbiAgICAgICAgfSAgICAgICAgXG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLmFuY2hvciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmFuY2hvciA9IG5ldyBQaGFzZXIuUG9pbnQocHJvcGVydGllcy5hbmNob3IueCwgcHJvcGVydGllcy5hbmNob3IueSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9wYXJzZVByb3BlcnRpZXMocHJvcGVydGllcyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIF9wYXJzZVByb3BlcnRpZXMocHJvcGVydGllczogSUhVREVsZW1lbnRQcm9wZXJ0aWVzKTogdm9pZCB7XG4gICAgICAgIC8vIE92ZXJyaWRlIGluIGV4dGVuZGVkIGNsYXNzZXMgdG8gYWNjZXNzIGFkZGl0aW9uYWwgcHJvcGVydGllc1xuICAgIH1cblxuICAgIC8vIFRoaXMgc2hvdWxkIG9ubHkgYmUgY2FsbGVkIHdoZW4gYSBzdGF0IGNoYW5nZXMuICAgIFxuICAgIHB1YmxpYyB1cGRhdGVFbGVtZW50KG5ld1N0YXQ6IElTdGF0KTogdm9pZCB7XG4gICAgICAgIC8vIFVwZGF0ZSB0aGlzIGVsZW1lbnQgYmFzZWQgb24gbmV3IHZhbHVlXG4gICAgfVxuXG4gICAgcHVibGljIHJlcG9zaXRpb24oeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy54ID0geCAtIHRoaXMucGFyZW50Lng7XG4gICAgICAgIHRoaXMueSA9IHkgLSB0aGlzLnBhcmVudC55O1xuICAgIH1cbn0iLCJpbXBvcnQge0hVREVsZW1lbnR9IGZyb20gJy4vSFVERWxlbWVudCc7XG5pbXBvcnQgSFVEIGZyb20gJy4vSFVEJztcbmltcG9ydCB7R3JvdXB9IGZyb20gJ2Rpam9uL2Rpc3BsYXknO1xuXG5leHBvcnQgaW50ZXJmYWNlIElNYXJnaW5EYXRhIHtcbiAgICBsZWZ0OiBudW1iZXI7XG4gICAgcmlnaHQ6IG51bWJlcjtcbiAgICB0b3A6IG51bWJlcjtcbiAgICBib3R0b206IG51bWJlcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSFVEUmVnaW9ucyB7XG4gICAgcHVibGljIHRvcExlZnQ6IFNpbmdsZVJlZ2lvbjtcbiAgICBwdWJsaWMgdG9wQ2VudGVyOiBTaW5nbGVSZWdpb247XG4gICAgcHVibGljIHRvcFJpZ2h0OiBTaW5nbGVSZWdpb247XG4gICAgcHVibGljIG1pZGRsZUxlZnQ6IFNpbmdsZVJlZ2lvbjtcbiAgICBwdWJsaWMgbWlkZGxlQ2VudGVyOiBTaW5nbGVSZWdpb247XG4gICAgcHVibGljIG1pZGRsZVJpZ2h0OiBTaW5nbGVSZWdpb247XG4gICAgcHVibGljIGJvdHRvbUxlZnQ6IFNpbmdsZVJlZ2lvbjtcbiAgICBwdWJsaWMgYm90dG9tQ2VudGVyOiBTaW5nbGVSZWdpb247XG4gICAgcHVibGljIGJvdHRvbVJpZ2h0OiBTaW5nbGVSZWdpb247XG4gICAgXG4gICAgY29uc3RydWN0b3IoaHVkOiBIVUQsIGNhbVdpZHRoOiBudW1iZXIsIGNhbUhlaWdodDogbnVtYmVyLCBjYW1DZW50ZXI6IFBoYXNlci5Qb2ludCwgaHVkTWFyZ2luczogSU1hcmdpbkRhdGEpIHtcbiAgICAgICAgLy8gZGVmaW5lIHRoZSBIVUQgcmVnaW9ucyAoYmVnaW4gYW5kIGVuZCBwb2ludHMpXG4gICAgICAgIGxldCBob3Jpem9udGFsV2lkdGggPSAoY2FtV2lkdGggLSAoaHVkTWFyZ2lucy5yaWdodCArIGh1ZE1hcmdpbnMubGVmdCkpIC8gMztcbiAgICAgICAgbGV0IG1pZGRsZVdpZHRoID0gY2FtV2lkdGggKiAwLjE7XG4gICAgICAgIGxldCBtaWRkbGVIZWlnaHQgPSBjYW1IZWlnaHQgLSAoaHVkTWFyZ2lucy5ib3R0b20gKyBodWRNYXJnaW5zLnRvcCk7XG4gICAgICAgIC8vIFRvcCBFbGVtZW50IFJlZ2lvbnNcbiAgICAgICAgdGhpcy50b3BMZWZ0ID0gbmV3IFNpbmdsZVJlZ2lvbihodWRNYXJnaW5zLmxlZnQsIGh1ZE1hcmdpbnMudG9wLFxuICAgICAgICAgICAgaG9yaXpvbnRhbFdpZHRoLCAwLCBcIlRvcExlZnRcIik7XG4gICAgICAgIHRoaXMudG9wQ2VudGVyID0gbmV3IFNpbmdsZVJlZ2lvbihjYW1DZW50ZXIueCAtIChob3Jpem9udGFsV2lkdGggKiAwLjUpLCB0aGlzLnRvcExlZnQueSxcbiAgICAgICAgICAgIGhvcml6b250YWxXaWR0aCwgMCwgXCJUb3BDZW50ZXJcIik7IFxuICAgICAgICB0aGlzLnRvcFJpZ2h0ID0gbmV3IFNpbmdsZVJlZ2lvbihjYW1XaWR0aCAtIGh1ZE1hcmdpbnMucmlnaHQgLSBob3Jpem9udGFsV2lkdGgsIHRoaXMudG9wQ2VudGVyLnksXG4gICAgICAgICAgICBob3Jpem9udGFsV2lkdGgsIDAsIFwiVG9wUmlnaHRcIik7XG5cbiAgICAgICAgLy8gQm90dG9tIEVsZW1lbnQgUmVnaW9uc1xuICAgICAgICB0aGlzLmJvdHRvbUxlZnQgPSBuZXcgU2luZ2xlUmVnaW9uKGh1ZE1hcmdpbnMubGVmdCwgY2FtSGVpZ2h0IC0gaHVkTWFyZ2lucy5ib3R0b20sXG4gICAgICAgICAgICBob3Jpem9udGFsV2lkdGgsIDAsIFwiQm90dG9tTGVmdFwiKTtcbiAgICAgICAgdGhpcy5ib3R0b21DZW50ZXIgPSBuZXcgU2luZ2xlUmVnaW9uKHRoaXMuYm90dG9tTGVmdC5lbmRYLCB0aGlzLmJvdHRvbUxlZnQueSxcbiAgICAgICAgICAgIGhvcml6b250YWxXaWR0aCwgMCwgXCJCb3R0b21DZW50ZXJcIik7XG4gICAgICAgIHRoaXMuYm90dG9tUmlnaHQgPSBuZXcgU2luZ2xlUmVnaW9uKHRoaXMuYm90dG9tQ2VudGVyLmVuZFgsIHRoaXMuYm90dG9tQ2VudGVyLnksXG4gICAgICAgICAgICBob3Jpem9udGFsV2lkdGgsIDAsIFwiQm90dG9tUmlnaHRcIik7XG5cbiAgICAgICAgLy8gTWlkZGxlIEVsZW1lbnQgUmVnaW9uc1xuICAgICAgICB0aGlzLm1pZGRsZUxlZnQgPSBuZXcgU2luZ2xlUmVnaW9uKGh1ZE1hcmdpbnMubGVmdCwgdGhpcy50b3BMZWZ0LmVuZFksXG4gICAgICAgICAgICAwLCB0aGlzLmJvdHRvbUxlZnQueSAtIHRoaXMudG9wTGVmdC5lbmRZLCBcIk1pZGRsZUxlZnRcIik7XG4gICAgICAgIHRoaXMubWlkZGxlUmlnaHQgPSBuZXcgU2luZ2xlUmVnaW9uKGNhbVdpZHRoIC0gaHVkTWFyZ2lucy5yaWdodCwgdGhpcy50b3BSaWdodC5lbmRZLFxuICAgICAgICAgICAgMCwgdGhpcy5ib3R0b21SaWdodC55IC0gdGhpcy50b3BSaWdodC5lbmRZLCBcIk1pZGRsZVJpZ2h0XCIpO1xuICAgICAgICB0aGlzLm1pZGRsZUNlbnRlciA9IG5ldyBTaW5nbGVSZWdpb24oaHVkTWFyZ2lucy5sZWZ0LCBjYW1DZW50ZXIueSwgXG4gICAgICAgICAgICBjYW1XaWR0aCAtIChodWRNYXJnaW5zLnJpZ2h0ICsgaHVkTWFyZ2lucy5sZWZ0KSwgMCwgXCJNaWRkbGVDZW50ZXJcIik7XG4gICAgICAgIFxuICAgICAgICBodWQuYWRkQ2hpbGQodGhpcy50b3BMZWZ0KTtcbiAgICAgICAgaHVkLmFkZENoaWxkKHRoaXMudG9wQ2VudGVyKTtcbiAgICAgICAgaHVkLmFkZENoaWxkKHRoaXMudG9wUmlnaHQpO1xuICAgICAgICBodWQuYWRkQ2hpbGQodGhpcy5taWRkbGVMZWZ0KTtcbiAgICAgICAgaHVkLmFkZENoaWxkKHRoaXMubWlkZGxlQ2VudGVyKTtcbiAgICAgICAgaHVkLmFkZENoaWxkKHRoaXMubWlkZGxlUmlnaHQpO1xuICAgICAgICBodWQuYWRkQ2hpbGQodGhpcy5ib3R0b21MZWZ0KTtcbiAgICAgICAgaHVkLmFkZENoaWxkKHRoaXMuYm90dG9tQ2VudGVyKTtcbiAgICAgICAgaHVkLmFkZENoaWxkKHRoaXMuYm90dG9tUmlnaHQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGVBbGxFbGVtZW50UG9zaXRpb25zKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnRvcExlZnQudXBkYXRlQWxsRWxlbWVudFBvc2l0aW9ucygpO1xuICAgICAgICB0aGlzLnRvcENlbnRlci51cGRhdGVBbGxFbGVtZW50UG9zaXRpb25zKCk7XG4gICAgICAgIHRoaXMudG9wUmlnaHQudXBkYXRlQWxsRWxlbWVudFBvc2l0aW9ucygpO1xuICAgICAgICB0aGlzLm1pZGRsZUxlZnQudXBkYXRlQWxsRWxlbWVudFBvc2l0aW9ucygpO1xuICAgICAgICB0aGlzLm1pZGRsZUNlbnRlci51cGRhdGVBbGxFbGVtZW50UG9zaXRpb25zKCk7XG4gICAgICAgIHRoaXMubWlkZGxlUmlnaHQudXBkYXRlQWxsRWxlbWVudFBvc2l0aW9ucygpO1xuICAgICAgICB0aGlzLmJvdHRvbUxlZnQudXBkYXRlQWxsRWxlbWVudFBvc2l0aW9ucygpO1xuICAgICAgICB0aGlzLmJvdHRvbUNlbnRlci51cGRhdGVBbGxFbGVtZW50UG9zaXRpb25zKCk7XG4gICAgICAgIHRoaXMuYm90dG9tUmlnaHQudXBkYXRlQWxsRWxlbWVudFBvc2l0aW9ucygpO1xuICAgIH1cbiAgICBcbn1cblxuY2xhc3MgU2luZ2xlUmVnaW9uIGV4dGVuZHMgR3JvdXAge1xuICAgIHB1YmxpYyBlbmQ6IFBoYXNlci5Qb2ludDtcbiAgICBwdWJsaWMgZWxlbWVudHM6IEhVREVsZW1lbnRbXTtcbiAgICBwdWJsaWMgcmVnaW9uV2lkdGg6IG51bWJlcjtcbiAgICBwdWJsaWMgcmVnaW9uSGVpZ2h0OiBudW1iZXI7XG4gICAgXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIoeCwgeSwgbmFtZSk7XG4gICAgICAgIHRoaXMuZWxlbWVudHMgPSBbXTtcbiAgICAgICAgdGhpcy5yZWdpb25XaWR0aCA9IHdpZHRoO1xuICAgICAgICB0aGlzLnJlZ2lvbkhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgdGhpcy5fYWRkRGVidWdCb3goKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgX2FkZERlYnVnQm94KCk6IHZvaWQge1xuICAgICAgICBsZXQgZ2Z4ID0gdGhpcy5nYW1lLmFkZC5ncmFwaGljcygpO1xuICAgICAgICBnZnguYmVnaW5GaWxsKFBoYXNlci5Db2xvci5nZXRSYW5kb21Db2xvcigzNSwgMTAwKSwgMC43KTtcbiAgICAgICAgZ2Z4LmRyYXdSZWN0KDAsIDAsIHRoaXMucmVnaW9uV2lkdGggPiAxID8gdGhpcy5yZWdpb25XaWR0aCA6IDIsIHRoaXMucmVnaW9uSGVpZ2h0ID4gMSA/IHRoaXMucmVnaW9uSGVpZ2h0IDogMik7XG4gICAgICAgIGdmeC5lbmRGaWxsKCk7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQobmV3IFBoYXNlci5JbWFnZSh0aGlzLmdhbWUsIDAsIDAsIGdmeC5nZW5lcmF0ZVRleHR1cmUoKSkpO1xuICAgICAgICB0aGlzLmdhbWUud29ybGQucmVtb3ZlKGdmeCk7XG4gICAgfSBcblxuICAgIHB1YmxpYyB1cGRhdGVBbGxFbGVtZW50UG9zaXRpb25zKCk6IHZvaWQge1xuICAgICAgICBsZXQgbnVtYmVyX29mX2VsZW1lbnRzLCBzdGVwLCBwb3NpdGlvbjtcbiAgICAgICAgbnVtYmVyX29mX2VsZW1lbnRzID0gdGhpcy5lbGVtZW50cy5sZW5ndGg7XG4gICAgICAgIGlmIChudW1iZXJfb2ZfZWxlbWVudHMgPT09IDEpIHtcbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lIGVsZW1lbnQsIGl0IHNob3VsZCBiZSBpbiB0aGUgY2VudGVyIG9mIHRoZSByZWdpb25cbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHNbMF0ucmVwb3NpdGlvbih0aGlzLnggKyAodGhpcy5yZWdpb25XaWR0aCAvIDIpLCB0aGlzLnkgKyAodGhpcy5yZWdpb25IZWlnaHQgLyAyKSk7XG4gICAgICAgIH0gZWxzZSBpZiAobnVtYmVyX29mX2VsZW1lbnRzID09PSAyKSB7XG4gICAgICAgICAgICAvLyBpZiB0aGVyZSBhcmUgdHdvIGVsZW1lbnRzLCB0aGV5IHdpbGwgYmUgaW4gb3Bwb3NpdGUgc2lkZXMgb2YgdGhlIHJlZ2lvblxuICAgICAgICAgICAgdGhpcy5lbGVtZW50c1swXS5yZXBvc2l0aW9uKHRoaXMueCArICh0aGlzLnJlZ2lvbldpZHRoICogMC4yNSksIHRoaXMueSArICh0aGlzLnJlZ2lvbkhlaWdodCAqIDAuMjUpKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHNbMV0ucmVwb3NpdGlvbih0aGlzLnggKyAodGhpcy5yZWdpb25XaWR0aCAqIDAuNzUpIC0gdGhpcy5lbGVtZW50c1sxXS5yZWFsV2lkdGgsIHRoaXMueSArICh0aGlzLnJlZ2lvbkhlaWdodCAqIDAuNzUpKTtcbiAgICAgICAgfSBlbHNlIGlmIChudW1iZXJfb2ZfZWxlbWVudHMgPiAyKSB7XG4gICAgICAgICAgICAvLyBpZiB0aGVyZSBhcmUgbW9yZSB0aGFuIHR3byBlbGVtZW50cywgdGhleSB3aWxsIGJlIGVxdWFsbHkgc3BhY2VkIGluIHRoZSByZWdpb25cbiAgICAgICAgICAgIHN0ZXAgPSBuZXcgUGhhc2VyLlBvaW50KHRoaXMucmVnaW9uV2lkdGggLyBudW1iZXJfb2ZfZWxlbWVudHMsIHRoaXMucmVnaW9uSGVpZ2h0IC8gbnVtYmVyX29mX2VsZW1lbnRzKTtcbiAgICAgICAgICAgIHBvc2l0aW9uID0gbmV3IFBoYXNlci5Qb2ludCh0aGlzLnggKyAoc3RlcC54ICogMC41KSwgdGhpcy55ICsgKHN0ZXAueSAqIDAuNSkpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZXBvc2l0aW9uKHBvc2l0aW9uLngsIHBvc2l0aW9uLnkpO1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uLnggKz0gc3RlcC54O1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uLnkgKz0gc3RlcC55O1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIGZpeCBhbGwgZWxlbWVudHMgdG8gY2FtZXJhXG4gICAgICAgIHRoaXMuZWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAgICAgZWxlbWVudC5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcbiAgICAgICAgfSwgdGhpcyk7ICAgIFxuICAgIH0gXG5cbiAgICBwcm90ZWN0ZWQgcmFuZG9tQ29sb3IoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIDB4MGYwZiArIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDEwKTsgICBcbiAgICB9ICAgXG4gICAgXG4gICAgcHVibGljIGdldCBjZW50ZXJYKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKyAodGhpcy5yZWdpb25XaWR0aCAqIDAuNSk7XG4gICAgfSAgICBcblxuICAgIHB1YmxpYyBnZXQgY2VudGVyWSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy55ICsgKHRoaXMucmVnaW9uSGVpZ2h0ICogMC41KTtcbiAgICB9XG4gICAgXG4gICAgcHVibGljIGdldCBlbmRYKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKyB0aGlzLnJlZ2lvbldpZHRoO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgZW5kWSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy55ICsgdGhpcy5yZWdpb25IZWlnaHQ7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBhZGRFbGVtZW50KG5ld0VsZW1lbnQ6IEhVREVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hZGRDaGlsZChuZXdFbGVtZW50KTtcbiAgICAgICAgdGhpcy5lbGVtZW50cy5wdXNoKG5ld0VsZW1lbnQpO1xuICAgIH1cbn0iLCJpbXBvcnQge0lIVURFbGVtZW50UHJvcGVydGllcywgSVN0YXQsIEhVREVsZW1lbnR9IGZyb20gJy4vSFVERWxlbWVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhVRFN0YXRXaXRoQmFyIGV4dGVuZHMgSFVERWxlbWVudCB7XG4gICAgcHJvdGVjdGVkIF9iYXJCYWNrZ3JvdW5kOiBQaGFzZXIuU3ByaXRlO1xuICAgIHByb3RlY3RlZCBfc2NhbGVWZWN0b3I6IFBoYXNlci5Qb2ludDtcbiAgICBwcm90ZWN0ZWQgX21heFNpemU6IG51bWJlciA9IDUwO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgcHJvcGVydGllczogYW55KSB7XG4gICAgICAgIHN1cGVyKG5hbWUsIHByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBfcGFyc2VQcm9wZXJ0aWVzKHByb3BlcnRpZXM6IElIVURFbGVtZW50UHJvcGVydGllcyk6IHZvaWQge1xuICAgICAgICBpZiAocHJvcGVydGllcy5iYXJTY2FsaW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3NjYWxlVmVjdG9yID0gbmV3IFBoYXNlci5Qb2ludChwcm9wZXJ0aWVzLmJhclNjYWxpbmcueCwgcHJvcGVydGllcy5iYXJTY2FsaW5nLnkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLm1heFNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fbWF4U2l6ZSA9IHByb3BlcnRpZXMubWF4U2l6ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGVFbGVtZW50KG5ld1N0YXQ6IElTdGF0KTogdm9pZCB7XG4gICAgICAgIGxldCBuZXdTY2FsZTogbnVtYmVyID0gKG5ld1N0YXQuY3VycmVudCAvIG5ld1N0YXQubWF4KSAqIHRoaXMuX21heFNpemU7XG4gICAgICAgIHRoaXMuc2NhbGUuc2V0VG8odGhpcy5fc2NhbGVWZWN0b3IueCAqIG5ld1NjYWxlLCB0aGlzLl9zY2FsZVZlY3Rvci55ICogbmV3U2NhbGUpO1xuICAgIH1cbn0iLCJpbXBvcnQge0lIVURFbGVtZW50UHJvcGVydGllcywgSVN0YXQsIEhVREVsZW1lbnR9IGZyb20gJy4vSFVERWxlbWVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhVRFN0YXRXaXRoVGV4dCBleHRlbmRzIEhVREVsZW1lbnQge1xuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgcHJvcGVydGllczogYW55KSB7XG4gICAgICAgIHN1cGVyKG5hbWUsIHByb3BlcnRpZXMpO1xuICAgIH1cbn0iLCJpbXBvcnQge0dyb3VwfSBmcm9tICdkaWpvbi9kaXNwbGF5JztcbmltcG9ydCBIVURSZWdpb25zIGZyb20gJy4vSFVEUmVnaW9ucyc7XG5pbXBvcnQge0lIVURFbGVtZW50UHJvcGVydGllcywgSFVERWxlbWVudH0gZnJvbSAnLi9IVURFbGVtZW50JztcbmltcG9ydCBIVURTdGF0V2l0aEJhciBmcm9tICcuL0hVRFN0YXRXaXRoQmFyJztcbmltcG9ydCBIVURTdGF0V2l0aFRleHQgZnJvbSAnLi9IVURTdGF0V2l0aFRleHQnO1xuXG4vLyBUaGUgc3RydWN0dXJlIG9mIHRoZSBIVUQgZGF0YSBhcyBsb2FkZWQgaW4gZnJvbSBKU09OLlxuZXhwb3J0IGludGVyZmFjZSBJSFVERGF0YSB7XG4gICAgbWFyZ2luczogeyBsZWZ0OiBudW1iZXIsIHJpZ2h0OiBudW1iZXIsIHRvcDogbnVtYmVyLCBib3R0b206IG51bWJlciB9LFxuICAgIGVsZW1lbnRzOiBJSFVERWxlbWVudERhdGFbXVxufVxuXG4vLyBTdHJ1Y3V0cmUgb2YgYSBIVUQgZWxlbWVudCBhcyBsb2FkZWQgaW4gZnJvbSBKU09OIGRhdGEuXG5leHBvcnQgaW50ZXJmYWNlIElIVURFbGVtZW50RGF0YSB7XG4gICAgbmFtZTogc3RyaW5nLFxuICAgIHR5cGU6IHN0cmluZyxcbiAgICByZWdpb246IHN0cmluZyxcbiAgICBzdGF0VG9TaG93OiBzdHJpbmcsIFxuICAgIHByb3BlcnRpZXM6IElIVURFbGVtZW50UHJvcGVydGllc1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIVUQgZXh0ZW5kcyBHcm91cCB7XG4gICAgcHJpdmF0ZSBfZGF0YTogSUhVRERhdGE7XG4gICAgcHJpdmF0ZSBfcmVnaW9uczogSFVEUmVnaW9ucztcbiAgICBwcml2YXRlIF9zdGF0SUQ6IG51bWJlcjtcbiAgICBwcml2YXRlIF9wcmVmYWJFbGVtZW50czogYW55ID0ge1xuICAgICAgICBcImJhc2ljX2VsZW1lbnRcIjogSFVERWxlbWVudCxcbiAgICAgICAgXCJzdGF0X3dpdGhfYmFyXCI6IEhVRFN0YXRXaXRoQmFyLFxuICAgICAgICBcInN0YXRfd2l0aF90ZXh0XCI6IEhVRFN0YXRXaXRoVGV4dFxuICAgIH1cbiAgICBcbiAgICBjb25zdHJ1Y3RvcihkYXRhOiBJSFVERGF0YSkge1xuICAgICAgICBzdXBlcigwLCAwLCBcIkhVRFwiKTtcbiAgICAgICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gICAgfVxuXG4gICAgcHVibGljIGluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3N0YXRJRCA9IDA7XG4gICAgICAgIGxldCBjYW1XaWR0aDogbnVtYmVyLCBjYW1IZWlnaHQ6IG51bWJlciwgY2FtQ2VudGVyOiBQaGFzZXIuUG9pbnQ7XG4gICAgICAgIGNhbVdpZHRoID0gdGhpcy5nYW1lLmNhbWVyYS53aWR0aDtcbiAgICAgICAgY2FtSGVpZ2h0ID0gdGhpcy5nYW1lLmNhbWVyYS5oZWlnaHQ7XG4gICAgICAgIGNhbUNlbnRlciA9IG5ldyBQaGFzZXIuUG9pbnQoY2FtV2lkdGggLyAyLCBjYW1IZWlnaHQgLyAyKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuX3JlZ2lvbnMgPSBuZXcgSFVEUmVnaW9ucyh0aGlzLCBjYW1XaWR0aCwgY2FtSGVpZ2h0LCBjYW1DZW50ZXIsIHRoaXMuX2RhdGEubWFyZ2lucyk7XG4gICAgICAgIHRoaXMuX2NyZWF0ZUVsZW1lbnRzKCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIF9jcmVhdGVFbGVtZW50cygpOiB2b2lkIHtcbiAgICAgICAgbGV0IGVsZW1lbnROYW1lLCBlbGVtZW50UGFyZW1zOiBJSFVERWxlbWVudERhdGEsIHJlZ2lvbiwgbmV3RWxlbWVudDtcbiAgICAgICAgLy8gY3JlYXRlIHRoZSBIVUQgZWxlbWVudHMgZnJvbSB0aGUgSlNPTiBmaWxlXG4gICAgICAgIGZvciAoZWxlbWVudE5hbWUgaW4gdGhpcy5fZGF0YS5lbGVtZW50cykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2RhdGEuZWxlbWVudHMuaGFzT3duUHJvcGVydHkoZWxlbWVudE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudFBhcmVtcyA9IHRoaXMuX2RhdGEuZWxlbWVudHNbZWxlbWVudE5hbWVdO1xuICAgICAgICAgICAgICAgIC8vIGZpbmQgdGhlIHJlZ2lvbiBiZWdpbm5pbmcgcG9zaXRpb25zXG4gICAgICAgICAgICAgICAgcmVnaW9uID0gdGhpcy5fcmVnaW9uc1tlbGVtZW50UGFyZW1zLnJlZ2lvbl07XG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIHRoZSBlbGVtZW50IHByZWZhYiBpbiB0aGUgYmVnaW5uaW5nIG9mIHRoZSByZWdpb25cbiAgICAgICAgICAgICAgICBuZXdFbGVtZW50ID0gdGhpcy5fY3JlYXRlSFVERWxlbWVudChlbGVtZW50UGFyZW1zLnR5cGUsIGVsZW1lbnROYW1lLCBlbGVtZW50UGFyZW1zLnByb3BlcnRpZXMpO1xuICAgICAgICAgICAgICAgIC8vIGFkZCB0aGUgZWxlbWVudCB0byBpdHMgY29ycmVzcG9uZGVudCByZWdpb25cbiAgICAgICAgICAgICAgICByZWdpb24uYWRkRWxlbWVudChuZXdFbGVtZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0SUQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3JlZ2lvbnMudXBkYXRlQWxsRWxlbWVudFBvc2l0aW9ucygpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBfY3JlYXRlSFVERWxlbWVudCh0eXBlLCBuYW1lLCBwcm9wZXJ0aWVzKTogSFVERWxlbWVudCB7XG4gICAgICAgIGxldCBuZXdFbGVtZW50OiBIVURFbGVtZW50O1xuICAgICAgICAvLyBjcmVhdGUgcHJlZmFiIGFjY29yZGluZyB0byBpdHMgdHlwZVxuICAgICAgICBpZiAodGhpcy5fcHJlZmFiRWxlbWVudHMuaGFzT3duUHJvcGVydHkodHlwZSkpIHtcbiAgICAgICAgICAgIG5ld0VsZW1lbnQgPSBuZXcgdGhpcy5fcHJlZmFiRWxlbWVudHNbdHlwZV0obmFtZSwgcHJvcGVydGllcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBuZXdFbGVtZW50ID0gbmV3IHRoaXMuX3ByZWZhYkVsZW1lbnRzW1wiYmFzaWNfZWxlbWVudFwiXShcImVtcHR5XCIsIHt0ZXh0dXJlOiBcImRlbW9uXCJ9KVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld0VsZW1lbnQ7XG4gICAgfSAgICBcbn0iLCJpbXBvcnQgQmFzZVN0YXRlIGZyb20gXCIuL0Jhc2VTdGF0ZVwiO1xuaW1wb3J0IE1lbnVNZWRpYXRvciBmcm9tICcuLi9tZWRpYXRvci9NZW51TWVkaWF0b3InO1xuaW1wb3J0IEhVRCBmcm9tICcuLi9odWQvSFVEJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVudSBleHRlbmRzIEJhc2VTdGF0ZSB7XG4gICAgcHVibGljIGh1ZDogSFVEO1xuICAgIC8vIFBoYXNlci5TdGF0ZSBvdmVycmlkZXNcbiAgICBwdWJsaWMgaW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fbWVkaWF0b3IgPSBuZXcgTWVudU1lZGlhdG9yKCk7XG4gICAgICAgIHRoaXMuaW5wdXQub25Eb3duLmFkZCh0aGlzLl91cGRhdGVTdGF0cywgdGhpcyk7XG4gICAgfVxuXG4gICAgcHVibGljIHByZWxvYWQoKTogdm9pZCB7XG4gICAgfVxuXHRcdFxuICAgIC8vIGRpam9uLmNvcmUuU3RhdGUgb3ZlcnJpZGVzXG4gICAgcHVibGljIGxpc3RCdWlsZFNlcXVlbmNlKCkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgdGhpcy5fYWRkVGV4dCxcbiAgICAgICAgICAgIHRoaXMuX2FkZEhVRFxuICAgICAgICBdXG4gICAgfVxuXG4gICAgcHVibGljIGFmdGVyQnVpbGQoKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLmFmdGVyQnVpbGQoKVxuICAgIH1cblx0XHRcbiAgICAvLyBwcml2YXRlIG1ldGhvZHNcbiAgICBwcml2YXRlIF9hZGRUZXh0KCk6IHZvaWQge1xuICAgICAgICBsZXQgdGV4dCA9IHRoaXMuYWRkLmRUZXh0KDIwMCwgMjAwLCAnSFVEIFRlc3QnLCAnQXJpYWwnLCAzNiwgJyNmZmZmZmYnKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9hZGRIVUQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaHVkID0gbmV3IEhVRCh0aGlzLm1lZGlhdG9yLmh1ZERhdGEpO1xuICAgICAgICB0aGlzLmh1ZC5pbml0KCk7XG4gICAgICAgIHRoaXMuZ2FtZS5hZGRUb1VJLmV4aXN0aW5nKHRoaXMuaHVkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF91cGRhdGVTdGF0cygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5odWQudXBkYXRlKCkgICAgXG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBnZXQgbWVkaWF0b3IoKTogTWVudU1lZGlhdG9yIHtcbiAgICAgICAgcmV0dXJuIDxNZW51TWVkaWF0b3I+dGhpcy5fbWVkaWF0b3I7XG4gICAgfVxufVxuICAiLCJpbXBvcnQge0FwcGxpY2F0aW9ufSBmcm9tIFwiZGlqb24vYXBwbGljYXRpb25cIjtcbmltcG9ydCB7R2FtZX0gZnJvbSBcImRpam9uL2NvcmVcIjtcbmltcG9ydCB7RGV2aWNlfSBmcm9tIFwiZGlqb24vdXRpbHNcIjtcbmltcG9ydCB7Q29weU1vZGVsfSBmcm9tIFwiZGlqb24vbXZjXCI7XG5cbmltcG9ydCBBcHBsaWNhdGlvbk1lZGlhdG9yIGZyb20gXCIuL21lZGlhdG9yL0FwcGxpY2F0aW9uTWVkaWF0b3JcIjtcbmltcG9ydCBDb25zdGFudHMgZnJvbSBcIi4vdXRpbHMvQ29uc3RhbnRzXCI7XG5pbXBvcnQgTm90aWZpY2F0aW9ucyBmcm9tIFwiLi91dGlscy9Ob3RpZmljYXRpb25zXCI7XG5pbXBvcnQgQm9vdCBmcm9tIFwiLi9zdGF0ZS9Cb290XCI7XG5pbXBvcnQgUHJlbG9hZCBmcm9tIFwiLi9zdGF0ZS9QcmVsb2FkXCI7XG5pbXBvcnQgTWVudSBmcm9tIFwiLi9zdGF0ZS9NZW51XCI7XG5pbXBvcnQgR2FtZU1vZGVsIGZyb20gXCIuL21vZGVsL0dhbWVNb2RlbFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIVURBcHBsaWNhdGlvbiBleHRlbmRzIEFwcGxpY2F0aW9uIHtcbiAgICBwdWJsaWMgZ2FtZUlkOiBzdHJpbmcgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgLy8gb3ZlcnJpZGVzXG4gICAgcHVibGljIGNyZWF0ZUdhbWUoKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IG5ldyBHYW1lKHtcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLl9nZXRHYW1lV2lkdGgoKSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5fZ2V0R2FtZUhlaWdodCgpLFxuICAgICAgICAgICAgcGFyZW50OiAnZ2FtZS1jb250YWluZXInLFxuICAgICAgICAgICAgLy9yZW5kZXJlcjogUGhhc2VyLkNBTlZBUyxcbiAgICAgICAgICAgIHJlbmRlcmVyOiBEZXZpY2UuY29jb29uID8gUGhhc2VyLkNBTlZBUyA6IHRoaXMuX2dldFJlbmRlcmVyQnlEZXZpY2UoKSxcbiAgICAgICAgICAgIHRyYW5zcGFyZW50OiBmYWxzZSxcbiAgICAgICAgICAgIC8vIHVzZSB0aGlzIGlmIHlvdSB3YW50IHRvIHN3aXRjaCBiZXR3ZWVuIEAyeCBhbmQgQDF4IGdyYXBoaWNzXG4gICAgICAgICAgICAvL3Jlc29sdXRpb246IHRoaXMuX2dldFJlc29sdXRpb24oKSxcbiAgICAgICAgICAgIHJlc29sdXRpb246IDEsXG4gICAgICAgICAgICBwbHVnaW5zOiBEZXZpY2UubW9iaWxlID8gW10gOiBbJ0RlYnVnJ11cblxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9tZWRpYXRvciA9IG5ldyBBcHBsaWNhdGlvbk1lZGlhdG9yKHRoaXMpO1xuICAgICAgICB0aGlzLl9hZGRTdGF0ZXMoKTtcbiAgICB9XG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICBwdWJsaWMgc3RhcnRHYW1lKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoQ29uc3RhbnRzLlNUQVRFX0JPT1QpO1xuICAgIH1cblxuICAgIHB1YmxpYyBib290Q29tcGxldGUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZ2FtZS50cmFuc2l0aW9uLnRvKENvbnN0YW50cy5TVEFURV9QUkVMT0FEKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRqdXN0U2NhbGVTZXR0aW5ncygpOiB2b2lkIHtcbiAgICAgICAgaWYgKERldmljZS5jb2Nvb24pIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmdhbWUuc2NhbGUucGFnZUFsaWduVmVydGljYWxseSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5nYW1lLmRldmljZS5kZXNrdG9wKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuU0hPV19BTEw7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnNldE1pbk1heCg1MTIsIDM4NCwgMTAyNCwgNzY4KTtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuc2NhbGUucGFnZUFsaWduSG9yaXpvbnRhbGx5ID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuUkVTSVpFO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5nYW1lLnNjYWxlLmZvcmNlTGFuZHNjYXBlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5yZWZyZXNoKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYWRqdXN0UmVuZGVyZXJTZXR0aW5ncygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5nYW1lLnN0YWdlLmRpc2FibGVWaXNpYmlsaXR5Q2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5nYW1lLmZvcmNlU2luZ2xlVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgLy90aGlzLmdhbWUuY2FtZXJhLnJvdW5kUHggPSBmYWxzZTtcbiAgICAgICAgLy90aGlzLmdhbWUucmVuZGVyZXIucmVuZGVyU2Vzc2lvbi5yb3VuZFBpeGVscyA9IGZhbHNlO1xuICAgICAgICAvL3RoaXMuZ2FtZS5hbnRpYWxpYXMgPSB0cnVlO1xuICAgICAgICAvL3RoaXMuZ2FtZS5yZW5kZXJlci5jbGVhckJlZm9yZVJlbmRlciA9IHRoaXMuZ2FtZS5yZW5kZXJUeXBlID09PSBQaGFzZXIuQ0FOVkFTO1xuICAgIH1cblxuICAgIC8vIGNhbGxlZCBmcm9tIHRoZSBib290IHN0YXRlIGFzIHdlIGNhbid0IGluaXRpYWxpemUgcGx1Z2lucyB1bnRpbCB0aGUgZ2FtZSBpcyBib290ZWRcbiAgICBwdWJsaWMgcmVnaXN0ZXJNb2RlbHMoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGdhbWVNb2RlbCA9IG5ldyBHYW1lTW9kZWwoJ2dhbWVfZGF0YScpO1xuICAgICAgICBjb25zdCBjb3B5TW9kZWwgPSBuZXcgQ29weU1vZGVsKCdjb3B5Jyk7XG4gICAgfVxuXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RzXG4gICAgLy8gYWRkcyBzdGF0ZXNcbiAgICBwcml2YXRlIF9hZGRTdGF0ZXMoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5hZGQoQ29uc3RhbnRzLlNUQVRFX0JPT1QsIEJvb3QpO1xuICAgICAgICB0aGlzLmdhbWUuc3RhdGUuYWRkKENvbnN0YW50cy5TVEFURV9QUkVMT0FELCBQcmVsb2FkKTtcbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlLmFkZChDb25zdGFudHMuU1RBVEVfTUVOVSwgTWVudSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZ2V0R2FtZVdpZHRoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBEZXZpY2UuY29jb29uID8gd2luZG93LmlubmVyV2lkdGggOiAxMDI0O1xuICAgIH1cblxuICAgIHByaXZhdGUgX2dldEdhbWVIZWlnaHQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIERldmljZS5jb2Nvb24gPyB3aW5kb3cuaW5uZXJIZWlnaHQgOiA3Njg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZ2V0UmVzb2x1dGlvbigpOiBudW1iZXIge1xuICAgICAgICBpZiAoQXBwbGljYXRpb24ucXVlcnlWYXIoJ3Jlc29sdXRpb24nKSAmJiAhaXNOYU4oQXBwbGljYXRpb24ucXVlcnlWYXIoJ3Jlc29sdXRpb24nKSkpIHtcbiAgICAgICAgICAgIHJldHVybiBBcHBsaWNhdGlvbi5xdWVyeVZhcigncmVzb2x1dGlvbicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChEZXZpY2UuY29jb29uKSB7XG4gICAgICAgICAgICByZXR1cm4gKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvID4gMSA/IDIgOiAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBEZXZpY2UubW9iaWxlID8gMSA6ICh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyA+IDEgPyAyIDogMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIF9nZXRSZW5kZXJlckJ5RGV2aWNlKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBEZXZpY2UubW9iaWxlICYmIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIDwgMiA/IFBoYXNlci5DQU5WQVMgOiBQaGFzZXIuQVVUTztcbiAgICB9XG4gICAgXG4gICAgLy8gZ2V0dGVyIC8gc2V0dGVyXG4gICAgcHVibGljIGdldCBtZWRpYXRvcigpOiBBcHBsaWNhdGlvbk1lZGlhdG9yIHtcbiAgICAgICAgcmV0dXJuIDxBcHBsaWNhdGlvbk1lZGlhdG9yPnRoaXMuX21lZGlhdG9yO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgZ2FtZU1vZGVsKCk6IEdhbWVNb2RlbCB7XG4gICAgICAgIHJldHVybiA8R2FtZU1vZGVsPnRoaXMucmV0cmlldmVNb2RlbChHYW1lTW9kZWwuTU9ERUxfTkFNRSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBjb3B5TW9kZWwoKTogQ29weU1vZGVsIHtcbiAgICAgICAgcmV0dXJuIDxDb3B5TW9kZWw+dGhpcy5yZXRyaWV2ZU1vZGVsKENvcHlNb2RlbC5NT0RFTF9OQU1FKTtcbiAgICB9XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3N1Ym1vZHVsZXMvZGlqb24vZGlqb24uZC50c1wiLz4gIFxuaW1wb3J0IEhVREFwcGxpY2F0aW9uIGZyb20gJy4vSFVEQXBwbGljYXRpb24nO1xuXG4vLyBib290c3RyYXAgdGhlIGFwcFxuZXhwb3J0IGNvbnN0IGFwcCA9IG5ldyBIVURBcHBsaWNhdGlvbigpOyIsImltcG9ydCB7R3JvdXAsIFRleHR9IGZyb20gJ2Rpam9uL2Rpc3BsYXknO1xuaW1wb3J0IHtJUHJlbG9hZEhhbmRsZXJ9IGZyb20gJ2Rpam9uL2ludGVyZmFjZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcmVsb2FkZXIgZXh0ZW5kcyBHcm91cCBpbXBsZW1lbnRzIElQcmVsb2FkSGFuZGxlciB7XG4gICAgc3RhdGljIFRFU1Q6IG51bWJlciA9IDE7XG4gICAgc3RhdGljIFRFU1RfMjogbnVtYmVyID0gMjtcblxuICAgIHByaXZhdGUgX3dpcGVyOiBQaGFzZXIuSW1hZ2U7XG4gICAgcHJpdmF0ZSBfbG9hZFRleHQ6IFRleHQ7XG5cbiAgICBwdWJsaWMgdHJhbnNpdGlvbkluQ29tcGxldGU6IFBoYXNlci5TaWduYWwgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgIHB1YmxpYyB0cmFuc2l0aW9uT3V0Q29tcGxldGU6IFBoYXNlci5TaWduYWwgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuXG4gICAgcHJpdmF0ZSBfaW5Ud2VlbjogUGhhc2VyLlR3ZWVuO1xuICAgIHByaXZhdGUgX291dFR3ZWVuOiBQaGFzZXIuVHdlZW47XG5cbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlciwgbmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKHgsIHksIG5hbWUsIHRydWUpO1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgdGhpcy5idWlsZEludGVyZmFjZSgpO1xuICAgIH1cblxuICAgIC8vIEdyb3VwIG92ZXJyaWRlc1xuICAgIHByb3RlY3RlZCBidWlsZEludGVyZmFjZSgpIHtcbiAgICAgICAgdGhpcy5fbG9hZFRleHQgPSB0aGlzLmFkZEludGVybmFsLmRUZXh0KDUwLCA1MCwgJ0xvYWRpbmcgLi4uICcsICdBcmlhbCcsIDM2LCAnI0ZGRkZGRicpO1xuXG4gICAgICAgIGxldCBnZnggPSB0aGlzLmdhbWUuYWRkLmdyYXBoaWNzKCk7XG4gICAgICAgIGdmeC5iZWdpbkZpbGwoMHgwMDAwMDAsIDEpO1xuICAgICAgICBnZnguZHJhd1JlY3QoMCwgMCwgdGhpcy5nYW1lLndpZHRoLCB0aGlzLmdhbWUuaGVpZ2h0KTtcbiAgICAgICAgZ2Z4LmVuZEZpbGwoKTtcblxuICAgICAgICB0aGlzLl93aXBlciA9IHRoaXMuYWRkSW50ZXJuYWwuaW1hZ2UoMCwgMCwgZ2Z4LmdlbmVyYXRlVGV4dHVyZSgpKTtcblxuICAgICAgICB0aGlzLmdhbWUud29ybGQucmVtb3ZlKGdmeCwgdHJ1ZSk7XG5cbiAgICAgICAgdGhpcy5hbHBoYSA9IDA7XG4gICAgICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuX2luVHdlZW4gPSB0aGlzLmdhbWUuYWRkLnR3ZWVuKHRoaXMpLnRvKHsgYWxwaGE6IDEgfSwgMzAwLCBQaGFzZXIuRWFzaW5nLlF1YWRyYXRpYy5PdXQpO1xuICAgICAgICB0aGlzLl9vdXRUd2VlbiA9IHRoaXMuZ2FtZS5hZGQudHdlZW4odGhpcykudG8oeyBhbHBoYTogMCB9LCAyMDAsIFBoYXNlci5FYXNpbmcuUXVhZHJhdGljLkluKTtcblxuICAgICAgICB0aGlzLl9pblR3ZWVuLm9uQ29tcGxldGUuYWRkKHRoaXMuX2luLCB0aGlzKTtcbiAgICAgICAgdGhpcy5fb3V0VHdlZW4ub25Db21wbGV0ZS5hZGQodGhpcy5fb3V0LCB0aGlzKTtcbiAgICB9XG5cbiAgICAvLyBpUHJlbG9hZEhhbmRsZXIgaW1wbGVtZW50YXRpb25zXG4gICAgcHVibGljIGxvYWRTdGFydCgpIHtcbiAgICB9XG5cbiAgICBwdWJsaWMgbG9hZFByb2dyZXNzKHByb2dyZXNzOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3Qgcm91bmRlZFByb2dyZXNzID0gTWF0aC5yb3VuZChwcm9ncmVzcykudG9TdHJpbmcoKTtcbiAgICAgICAgdGhpcy5fbG9hZFRleHQuc2V0VGV4dCgnTG9hZGluZyAuLi4gJyArIHJvdW5kZWRQcm9ncmVzcyArICclJyk7XG4gICAgfVxuXG4gICAgcHVibGljIGxvYWRDb21wbGV0ZSgpIHtcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJhbnNpdGlvbkluKCkge1xuICAgICAgICB0aGlzLnZpc2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLl9pblR3ZWVuLnN0YXJ0KCk7XG4gICAgfVxuXG4gICAgcHVibGljIHRyYW5zaXRpb25PdXQoKSB7XG4gICAgICAgIHRoaXMuX291dFR3ZWVuLnN0YXJ0KCk7XG4gICAgfVxuXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RzXG4gICAgcHJvdGVjdGVkIF9pbigpIHtcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uSW5Db21wbGV0ZS5kaXNwYXRjaCgpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBfb3V0KCkge1xuICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uT3V0Q29tcGxldGUuZGlzcGF0Y2goKTtcbiAgICB9XG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
