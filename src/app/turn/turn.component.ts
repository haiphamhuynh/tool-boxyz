import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { count } from 'rxjs';
import { TurnService } from '../turn.service';

@Component({
  selector: 'app-turn',
  templateUrl: './turn.component.html',
  styleUrls: ['./turn.component.css'],
})
export class TurnComponent implements OnInit {
  valueFile: any;
  tokenFile: any;
  newFile: any;
  totalkey: any;
  TotalUserID: any;
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
  time_Start_HH: any;
  time_Start_MM: any;
  time_Start_SS: any;
  time_End_HH: any;
  time_End_MM: any;
  time_End_SS: any;

  arrUserID: any = [];

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
    // this.setVisible('#loading', true);
    try {
      this.key.splice(0, this.key.length);
      this.value.splice(0, this.value.length);
      this.lengthArr = 0;
      this.TotalUserID = 0;
      this.arr.splice(0, this.arr.length);

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

      this.newFile = this.valueFile;
      while (this.newFile.includes("'user_id' => '")) {
        var pFrom =
          this.newFile.indexOf("'user_id' => '") + "'user_id' => '".length;
        var pTo = this.newFile.indexOf("',", pFrom);
        var result = this.newFile.substring(pFrom, pTo);
        this.arrUserID.push(result);
        this.newFile = this.newFile.slice(pTo);
      }
      this.TotalUserID = [...new Set(this.arrUserID)].length;
      this.TotalKey = this.valueFile.match(/.ERROR:/g || []).length;
      this.keyOther = this.TotalKey - (this.key2 + this.key3 + this.arr.length);
    } catch (error) {
      alert('Error');
    }
    // this.setVisible('#loading', false);
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
  setVisible(selector: string, visible: Boolean) {
    var loading = document.querySelector(selector) as HTMLElement;
    loading.style.display = visible ? 'block' : 'none';
  }
  filter_time() {
    //console.log(this.time_Start_HH, this.time_Start_MM);
    var string_time_start = `${this.time_Start_HH}:${this.time_Start_MM}:${this.time_Start_SS}`;
    var string_time_end = `${this.time_End_HH}:${this.time_End_MM}:${this.time_End_SS}`;
    //console.log(string_time_start < string_time_end, string_time_start, string_time_end);
    try {
      if (
        string_time_start < string_time_end &&
        this.time_Start_HH <= 24 &&
        this.time_Start_HH.length == 2 &&
        this.time_Start_MM < 60 &&
        this.time_Start_MM.length == 2 &&
        this.time_Start_SS < 60 &&
        this.time_Start_SS.length == 2 &&
        this.time_End_HH <= 24 &&
        this.time_End_HH.length == 2 &&
        this.time_End_MM < 60 &&
        this.time_End_MM.length == 2 &&
        this.time_End_SS < 60 &&
        this.time_End_SS.length == 2
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
          var stringH = this.newFile.substring(position1, position1 + 2);
          var stringM = this.newFile.substring(position1 + 3, position1 + 5);
          var stringS = this.newFile.substring(position1 + 6, position1 + 8);
          var string_time_log = `${stringH}:${stringM}:${stringS}`;
          // console.log(string_time_log, string_time_log >= string_time_start, string_time_log < string_time_end);

          if (
            string_time_log >= string_time_start &&
            string_time_log < string_time_end
          ) {
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

          // get TOKEN_ERROR
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

        // get Total Key
        this.TotalKey = 0;
        this.newFile = this.valueFile;
        while (this.newFile.includes('.ERROR')) {
          var position1 = this.newFile.indexOf('.ERROR') - 9 - stringKey;
          var stringH = this.newFile.substring(position1, position1 + 2);
          var stringM = this.newFile.substring(position1 + 3, position1 + 5);
          var stringS = this.newFile.substring(position1 + 6, position1 + 8);
          var string_time_log = `${stringH}:${stringM}:${stringS}`;
          if (
            string_time_log >= string_time_start &&
            string_time_log < string_time_end
          ) {
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

        // get file_put_contents
        this.key2 = 0;
        this.newFile = this.valueFile;
        while (this.newFile.includes('.ERROR: file_put_contents')) {
          var position1 =
            this.newFile.indexOf('.ERROR: file_put_contents') - 9 - stringKey;
          var stringH = this.newFile.substring(position1, position1 + 2);
          var stringM = this.newFile.substring(position1 + 3, position1 + 5);
          var stringS = this.newFile.substring(position1 + 6, position1 + 8);
          var string_time_log = `${stringH}:${stringM}:${stringS}`;
          if (
            string_time_log >= string_time_start &&
            string_time_log < string_time_end
          ) {
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

        // get Maximum execution time of
        this.key3 = 0;
        this.newFile = this.valueFile;
        while (this.newFile.includes('.ERROR: Maximum execution time of')) {
          var position1 =
            this.newFile.indexOf('.ERROR: Maximum execution time of') -
            9 -
            stringKey;
          var stringH = this.newFile.substring(position1, position1 + 2);
          var stringM = this.newFile.substring(position1 + 3, position1 + 5);
          var stringS = this.newFile.substring(position1 + 6, position1 + 8);
          var string_time_log = `${stringH}:${stringM}:${stringS}`;
          if (
            string_time_log >= string_time_start &&
            string_time_log < string_time_end
          ) {
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

        // get userID
        this.newFile = this.valueFile;
        this.arrUserID.splice(0, this.arrUserID.length);
        while (this.newFile.includes("'user_id' => '")) {
          var pFrom = this.newFile.indexOf('[20') + '[20'.length;
          var request_time = this.newFile.indexOf("'request_time' => '") + "'request_time' => '".length;
          var request_timeTo = this.newFile.indexOf("',", request_time);
          var pTo = this.newFile.indexOf("',", request_timeTo);
          var result = this.newFile.substring(pFrom, pTo);
          var stringH = this.newFile.substring(pFrom + 9, pFrom + 11);
          var stringM = this.newFile.substring(pFrom + 12, pFrom + 14);
          var stringS = this.newFile.substring(pFrom + 15, pFrom + 17);
          var string_time_log = `${stringH}:${stringM}:${stringS}`;
          if (
            string_time_log >= string_time_start &&
            string_time_log < string_time_end
          ) {
            if (result.includes("'user_id' => '")) {
              var pFrom1 =
                this.newFile.indexOf("'user_id' => '") +
                "'user_id' => '".length;
              var pTo1 = this.newFile.indexOf("',", pFrom1);
              var result1 = this.newFile.substring(pFrom1, pTo1);
              this.arrUserID.push(result1);
            }
            this.newFile = this.newFile.slice(pTo);
          } else {
            this.newFile = this.newFile.slice(pTo);
          }
        }
        this.TotalUserID = [...new Set(this.arrUserID)].length;

        // get keyOther
        this.keyOther =
          this.TotalKey - (this.key2 + this.key3 + this.arr.length);
      } else {
        alert('HH-MM-SS data must be 2 digits and correct in the format');
      }
    } catch (error) {
      alert('Error!');
    }
  }
  ngOnInit() {}
}
