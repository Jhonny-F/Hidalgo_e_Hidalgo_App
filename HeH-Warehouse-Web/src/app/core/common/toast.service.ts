import { Notyf } from 'notyf';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private notifier = new Notyf();

  private displayAlert(message: string, config: { icon: string; background: string }) {
    const alertConfig = { duration: 8000, dismissible: true, ...config, };
    this.notifier.open({ message, ...alertConfig, });
  }

  error(msg: string) {
    const config = {
      icon: '<i class="fa-solid fa-circle-exclamation"></i>',
      background: 'var(--color-danger)',
    };
    this.displayAlert(msg, config);
  }

  success(msg: string) {
    const config = {
      icon: '<i class="fa-solid fa-circle-check"></i>',
      background: 'var(--color-primary)',
    };
    this.displayAlert(msg, config);
  }

}
