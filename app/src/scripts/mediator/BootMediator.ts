import BaseMediator from './BaseMediator';
import Notifications from '../utils/Notifications';

export default class BootMediator extends BaseMediator {
    public static MEDIATOR_NAME: string = 'bootMediator';
		
    // dijon.mvc.Mediator overrides
    public onRegister() {
        this.sendNotification(Notifications.BOOT_INIT);
    }
		
    // public methods
    // called from viewComponent
    public bootComplete() {
        this.sendNotification(Notifications.BOOT_COMPLETE);
    }
		
    // getter / setter
    public get name():string {
        return BootMediator.MEDIATOR_NAME;
    }
}