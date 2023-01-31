import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { count } from 'rxjs';
import { TurnService } from '../turn.service';

@Component({
  selector: 'app-turn',
  templateUrl: './turn.component.html',
  styleUrls: ['./turn.component.css'],
})
export class TurnComponent {
  valueFile: any;
  tokenFile: any;
  newFile: any;
  totalkey: any;
  key1: any;
  key2: any;
  key3: any;
  keyOther: any;
  arr: any = [];
  arrToken: any = [];
  map: any;
  unique: any;
  pFrom: any;
  pTo: any;
  result: any;
  lengthArr: any;
  key: any = [];
  value: any = [];
  arrJWT: any = [];
  TotalKey: any;
  arrContentToken: any = [];

  lengthKey: any;
  arrRemaining: any = [];

  timeStart: any;
  timeEnd: any;
  constructor(private route: Router, private tk: TurnService) {}

  inputfile(e: any) {
    let file = e.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = (e) => {
      this.valueFile = fileReader.result;
    };
    //fileReader.readAsText(this.valueFile);
  }
  submit() {
    this.key.splice(0, this.key.length);
    this.value.splice(0, this.value.length);
    this.lengthArr = 0;
    this.arr.splice(0, this.arr.length);
    try {
      if (this.valueFile.match(/'title' => 'TOKEN_ERROR'/g || [])) {
        this.key1 = this.valueFile.match(
          /'title' => 'TOKEN_ERROR'/g || []
        ).length;
      } else {
        this.key1 = 0;
      }
      if (this.valueFile.match(/ERROR: file_put_contents/g || [])) {
        this.key2 = this.valueFile.match(
          /ERROR: file_put_contents/g || []
        ).length;
      } else {
        this.key2 = 0;
      }
      if (this.valueFile.match(/ERROR: Maximum execution time of /g || [])) {
        this.key3 = this.valueFile.match(
          /ERROR: Maximum execution time of /g || []
        ).length;
      } else {
        this.key3 = 0;
      }
    } catch (error) {
      alert('Error');
    }

    this.newFile = this.valueFile;
    while (this.newFile.includes('.ERROR: array')) {
      var support =
        this.newFile.indexOf('.ERROR: array') + '.ERROR: array'.length;
      var pFrom =
        this.newFile.indexOf("'title' => '", support) + "'title' => '".length;
      var pTo = this.newFile.indexOf("',", pFrom);
      var result = this.newFile.substring(pFrom, pTo);
      this.arr.push(result);
      this.newFile = this.newFile.slice(pTo);
    }

    this.map = this.arr.reduce(function (prev: any, cur: any) {
      prev[cur] = (prev[cur] || 0) + 1;
      return prev;
    }, {});
    delete this.map.TOKEN_ERROR;
    //delete this.map.MAX_EXECUTION_TIME_ERROR;
    //delete this.map.ERROR_EXCEPTION;

    const data = Object.entries(this.map);
    for (let index = 0; index < data.length; index++) {
      this.key.push(data[index][0]);
      this.value.push(data[index][1]);
    }
    this.lengthKey = this.key.length;
    this.lengthArr = this.value.reduce(function (acc: any, value: any) {
      return acc + value;
    });

    this.TotalKey = this.valueFile.match(/.ERROR:/g || []).length;
    this.keyOther = this.TotalKey - (this.key2 + this.key3 + this.arr.length);
  }
  parseJwt(token: any) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
  timeConverter(UNIX_timestamp: any) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time =
      date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
  }
  token() {
    this.tokenFile = this.valueFile;
    while (this.tokenFile.includes('TOKEN_ERROR')) {
      let support =
        this.tokenFile.indexOf('TOKEN_ERROR') + 'TOKEN_ERROR'.length;
      let pFrom =
        this.tokenFile.indexOf("'token' => '", support) + "'token' => '".length;
      let pTo = this.tokenFile.indexOf("',", pFrom);
      let result = this.tokenFile.substring(pFrom, pTo);
      this.arrToken.push(result);

      let cfrom =
        this.tokenFile.indexOf("'content' => '", support) +
        "'content' => '".length;
      let cto = this.tokenFile.indexOf("',", cfrom);
      let resultContent = this.tokenFile.substring(cfrom, cto);
      if (result != 'null') {
        this.arrContentToken.push(resultContent);
      }
      this.tokenFile = this.tokenFile.slice(pTo);
    }

    for (let iterator of this.arrToken) {
      if (iterator != 'null') {
        this.arrJWT.push([this.parseJwt(iterator), iterator]);
      }
    }
    for (let index = 0; index < this.arrJWT.length; index++) {
      this.arrJWT[index][0].iat = this.timeConverter(this.arrJWT[index][0].iat);
      this.arrJWT[index][0].exp = this.timeConverter(this.arrJWT[index][0].exp);
      this.arrJWT[index][0].nbf = this.timeConverter(this.arrJWT[index][0].nbf);
    }

    for (let index = 0; index < this.arrContentToken.length; index++) {
      this.arrJWT[index].push(this.arrContentToken[index]);
    }

    this.tk.arrToken = this.arrJWT;
    this.route.navigateByUrl('/token');
  }
  filter_time(timeStart: any, timeEnd: any) {
    try {
      if (
        timeStart.length == 2 &&
        timeEnd.length == 2 &&
        timeStart < 25 &&
        timeEnd < 25 &&
        timeStart < timeEnd
      ) {
        this.key.splice(0, this.key.length);
        this.value.splice(0, this.value.length);
        this.lengthArr = 0;
        this.arr.splice(0, this.arr.length);
        this.newFile = this.valueFile;
        var first_dot_position = this.newFile.indexOf('.');
        var stringKey = this.newFile.substring(21, first_dot_position).length;

        while (this.newFile.includes('.ERROR: array')) {
          var position1 =
            this.newFile.indexOf('.ERROR: array (') - 9 - stringKey;
          var stringTest1 = this.newFile.substring(position1, position1 + 2);

          if (stringTest1 >= timeStart && stringTest1 < timeEnd) {
            var position =
              this.newFile.indexOf('.ERROR: array') + '.ERROR: array'.length;
            var pFrom =
              this.newFile.indexOf("'title' => '", position) +
              "'title' => '".length;
            var pTo = this.newFile.indexOf("',", pFrom);
            var result = this.newFile.substring(pFrom, pTo);
            this.arr.push(result);
            this.newFile = this.newFile.slice(pTo);
          } else {
            var position2 =
              this.newFile.indexOf('.ERROR: array') + '.ERROR: array'.length;
            var pFrom =
              this.newFile.indexOf("'title' => '", position2) +
              "'title' => '".length;
            var pTo = this.newFile.indexOf("',", pFrom);
            this.newFile = this.newFile.slice(pTo);
          }
        }


        if (this.arr.length > 0) {
          this.map = this.arr.reduce(function (prev: any, cur: any) {
            prev[cur] = (prev[cur] || 0) + 1;
            return prev;
          }, {});
          if (this.map.TOKEN_ERROR) {
            this.key1 = this.map.TOKEN_ERROR;
          } else {
            this.key1 = 0;
          }
          delete this.map.TOKEN_ERROR;
          delete this.map.MAX_EXECUTION_TIME_ERROR;
          delete this.map.ERROR_EXCEPTION;

          const data = Object.entries(this.map);
          for (let index = 0; index < data.length; index++) {
            this.key.push(data[index][0]);
            this.value.push(data[index][1]);
          }
          this.lengthKey = this.key.length;
          this.lengthArr = this.value.reduce(function (acc: any, value: any) {
            return acc + value;
          });
        } else {
          this.lengthKey = 0;
          this.lengthArr = 0;
        }

        this.TotalKey = 0;
        this.newFile = this.valueFile;
        while (this.newFile.includes('.ERROR')) {
          var position1 = this.newFile.indexOf('.ERROR') - 9 - stringKey;
          var stringTest1 = this.newFile.substring(position1, position1 + 2);
          if (stringTest1 >= timeStart && stringTest1 < timeEnd) {
            this.TotalKey++;
            var position2 =
              this.newFile.indexOf('.ERROR', position1) + '.ERROR'.length;
            this.newFile = this.newFile.slice(position2);
          } else {
            var position2 =
              this.newFile.indexOf('.ERROR', position1) + '.ERROR'.length;
            this.newFile = this.newFile.slice(position2);
          }
        }
        this.key2 = 0;
        this.newFile = this.valueFile;
        while (this.newFile.includes('.ERROR: file_put_contents')) {
          var position1 =
            this.newFile.indexOf('.ERROR: file_put_contents') - 9 - stringKey;
          var stringTest1 = this.newFile.substring(position1, position1 + 2);
          if (stringTest1 >= timeStart && stringTest1 < timeEnd) {
            this.key2++;
            var position2 =
              this.newFile.indexOf('.ERROR: file_put_contents', position1) +
              '.ERROR: file_put_contents'.length;
            this.newFile = this.newFile.slice(position2);
          } else {
            var position2 =
              this.newFile.indexOf('.ERROR: file_put_contents', position1) +
              '.ERROR: file_put_contents'.length;
            this.newFile = this.newFile.slice(position2);
          }
        }
        this.key3 = 0;
        this.newFile = this.valueFile;
        while (this.newFile.includes('.ERROR: Maximum execution time of')) {
          var position1 =
            this.newFile.indexOf('.ERROR: Maximum execution time of') -
            9 -
            stringKey;
          var stringTest1 = this.newFile.substring(position1, position1 + 2);
          if (stringTest1 >= timeStart && stringTest1 < timeEnd) {
            this.key3++;
            var position2 =
              this.newFile.indexOf(
                '.ERROR: Maximum execution time of',
                position1
              ) + '.ERROR: Maximum execution time of'.length;
            this.newFile = this.newFile.slice(position2);
          } else {
            var position2 =
              this.newFile.indexOf(
                '.ERROR: Maximum execution time of',
                position1
              ) + '.ERROR: Maximum execution time of'.length;
            this.newFile = this.newFile.slice(position2);
          }
        }
        this.keyOther =
          this.TotalKey - (this.key2 + this.key3 + this.arr.length);
      } else {
        alert('data is not correct');
      }
    } catch (error) {
      alert('Error!');
    }
  }
  // ngOnInit(): void {
  //   (window).on('load', function() {
  //     (".loader").fadeOut(1000);
  //     (".main").fadeIn(1000);
  //   })

  // }
}
