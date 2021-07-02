import { Injectable } from '@angular/core';

import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AesService {

  private AesKey: string = CryptoJS.enc.Hex.parse('4931EF6C91609BBAD576318450ED988F');
  private salt: string = 'D4323E8099A29C6C';
  private iv: string = CryptoJS.enc.Hex.parse('C58CC2E8509CB49D7F219DD9A0177FE1');

  encrypt(cryptMessage: string): string {

    cryptMessage = CryptoJS.AES.encrypt(cryptMessage, this.AesKey, { iv: this.iv} ).toString();
    
    return cryptMessage;
  }
}