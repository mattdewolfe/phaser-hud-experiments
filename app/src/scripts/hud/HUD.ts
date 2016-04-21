import {Group} from 'dijon/display';
import HUDRegions from './HUDRegions';
import {IHUDElementProperties, HUDElement} from './HUDElement';
import HUDStatWithBar from './HUDStatWithBar';
import HUDStatWithText from './HUDStatWithText';

// The structure of the HUD data as loaded in from JSON.
export interface IHUDData {
    margins: { left: number, right: number, top: number, bottom: number },
    elements: IHUDElementData[]
}

// Strucutre of a HUD element as loaded in from JSON data.
export interface IHUDElementData {
    name: string,
    type: string,
    region: string,
    statToShow: string, 
    properties: IHUDElementProperties
}

export default class HUD extends Group {
    private _data: IHUDData;
    private _regions: HUDRegions;
    private _statID: number;
    private _prefabElements: any = {
        "basic_element": HUDElement,
        "stat_with_bar": HUDStatWithBar,
        "stat_with_text": HUDStatWithText
    }
    
    constructor(data: IHUDData) {
        super(0, 0, "HUD");
        this._data = data;
    }

    public init(): void {
        this._statID = 0;
        let camWidth: number, camHeight: number, camCenter: Phaser.Point;
        camWidth = this.game.camera.width;
        camHeight = this.game.camera.height;
        camCenter = new Phaser.Point(camWidth / 2, camHeight / 2);
        
        this._regions = new HUDRegions(this, camWidth, camHeight, camCenter, this._data.margins);
        this._createElements();
    }

    protected _createElements(): void {
        let elementName, elementParems: IHUDElementData, region, newElement;
        // create the HUD elements from the JSON file
        for (elementName in this._data.elements) {
            if (this._data.elements.hasOwnProperty(elementName)) {
                elementParems = this._data.elements[elementName];
                // find the region beginning positions
                region = this._regions[elementParems.region];
                // create the element prefab in the beginning of the region
                newElement = this._createHUDElement(elementParems.type, elementName, elementParems.properties);
                // add the element to its correspondent region
                region.addElement(newElement);
                this._statID++;
            }
        }

        this._regions.updateAllElementPositions();
    }

    protected _createHUDElement(type, name, properties): HUDElement {
        let newElement: HUDElement;
        // create prefab according to its type
        if (this._prefabElements.hasOwnProperty(type)) {
            newElement = new this._prefabElements[type](name, properties);
        }
        else {
            newElement = new this._prefabElements["basic_element"]("empty", {texture: "demon"})
        }

        return newElement;
    }    
}