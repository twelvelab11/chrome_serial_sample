// Generated by CoffeeScript 1.6.3
var Serial,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Serial = (function() {
  var connectionId;

  connectionId = null;

  function Serial(parms) {
    this.getData = __bind(this.getData, this);
    var name, value;
    for (name in parms) {
      value = parms[name];
      this[name] = value;
    }
    this.getPorts();
  }

  Serial.prototype.getPorts = function() {
    var _this = this;
    return chrome.serial.getDevices(function(ports) {
      var i, port, value;
      for (i in ports) {
        value = ports[i];
        port = value.path;
        _this.select.appendChild(new Option(port, port));
      }
    });
  };

  Serial.prototype.startConnection = function() {
    var config, portName;
    portName = this.select.childNodes[this.select.selectedIndex].value;
    config = {
      bitrate: this.bitrate,
      dataBits: this.dataBits,
      parityBit: this.parityBit,
      stopBits: this.stopBits
    };
    chrome.serial.connect(portName, config, function(openInfo) {
      connectionId = openInfo.connectionId;
      console.log("connectionId = " + connectionId);
    });
  };

  Serial.prototype.endConnection = function() {
    return chrome.serial.disconnect(connectionId, function(result) {});
  };

  Serial.prototype.startRecieve = function() {
    return chrome.serial.onReceive.addListener(this.getData);
  };

  Serial.prototype.getData = function(readInfo) {
    var data;
    data = new Uint8Array(readInfo.data);
    return this.recieveCallback(data);
  };

  Serial.prototype.sendData = function(message) {
    var array, buffer, i, value,
      _this = this;
    buffer = new ArrayBuffer(message.length);
    array = new Uint8Array(buffer);
    for (i in message) {
      value = message[i];
      array[i] = value;
    }
    return chrome.serial.send(connectionId, buffer, function(sendInfo) {
      return _this.sendCallback(sendInfo);
    });
  };

  return Serial;

})();
