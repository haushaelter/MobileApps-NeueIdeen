import { Injectable } from '@angular/core';

import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AesService {

  private AesKey: string = '4931EF6C91609BBAD576318450ED988F';

  encrypt(cryptMessage: string): string {
    cryptMessage = CryptoJS.AES.encrypt(cryptMessage, this.AesKey).toString();
    let bytes = CryptoJS.AES.decrypt(cryptMessage, this.AesKey);
    return cryptMessage;
  }
}