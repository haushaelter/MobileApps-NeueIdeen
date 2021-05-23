import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonToArray'
})
export class JsonToArrayPipe implements PipeTransform {

  transform(value, args:string[]) : any {
    console.log("value ");
    
    let keys = [];
    for (let key in value) {
      console.log(key);
      console.log(value[key])
      
      keys.push({key: key, value: value[key]});
    }
    console.log(keys);
    return keys;
  }

}
