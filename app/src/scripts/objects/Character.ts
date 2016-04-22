import {BaseObject} from './BaseObject'

export default class Character extends BaseObject {
    
    constructor(data: any) {
        super(data.name, data.x, data.y, data.key);
    }  
}