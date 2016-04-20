import {IHUDElementProperties, IStat, HUDElement} from './HUDElement';

export default class HUDStatWithText extends HUDElement {
    constructor(name: string, x: number, y: number, properties: any) {
        super(name, x, y, properties);
    }
}