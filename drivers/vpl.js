import dgram from 'dgram';
import {Driver} from 'lisa-plugin';
import {createRequire} from 'module';
import pkg from 'sony-sdcp-com';
import {inputs} from '../lib/commands.js';

const {commands, powerStatus, SdcpClient} = pkg;
const delay = time => new Promise(res=>setTimeout(res,time));

const PORT = 53862;
const sdcpClient = SdcpClient;
const require = createRequire(import.meta.url);

const template = require('../widgets/projector.json');

export default class VplDriver extends Driver {
  init() {
    if (this._refreshInterval) {
      clearInterval(this._refreshInterval)
      this._refreshInterval = null
    }

    this._refreshInterval = setInterval(this._search.bind(this), 60000)
    return this._search()
  }

  _search() {
    if (!this.listening) {
      this.listening = true
      this.server = dgram.createSocket({type: 'udp4', reuseAddr: true})

      this.server.on('message', (message, remote) => {
        if (message.length === 50) {
          return this._manageProjector(message, remote)
        }
      })
      this.server.bind(PORT)
      setTimeout(() => {
        this.server.close(() => this.listening = false)
      }, 40000)
    }
    return Promise.resolve()
  }

  saveDevice(deviceData) {
    return this.getDevicesData([deviceData]).then((data) => {
      return this.lisa.createOrUpdateDevices(data[0])
    })
  }

  getDevices() {

  }

  getDevicesData(devices) {
    const getData = []
    for (const device of devices) {
      const api = sdcpClient({port: device.data.port, address: device.data.address})
      getData.push(api.getPower())
    }
    return Promise.all(getData).then((data) => {
      for (let i = 0; i < data.length; i++) {
        const power = data[i]
        const powered = this._isPowered(power)
        devices[i].powered = powered;
        devices[i].imageOn = 'smart_tv_on.svg';
        devices[i].imageOff = 'smart_tv_off.svg';
        devices[i].defaultAction = powered ? 'Turn off' : 'Turn on';
        devices[i].template = template;
        Object.assign(devices[i].data, this._getDeviceData(power))
      }
      return devices
    })
  }

  setDeviceValue(device, key, newValue) {
    const options = {}
    options[key] = newValue
    return this.setAction(device, options)
      .then(() => this.getDevicesData([device])
        .then((devices) => {
          const device = devices[0]
          device.data[key] = newValue
          return device
        })
        .then((data) => this.lisa.createOrUpdateDevices(data)))
  }

  setDevicesValue(devices, key, newValue) {

  }

  setAction(device, options) {
    const api = sdcpClient({port: device.data.port, address: device.data.address}, this.log)
    let action;
    let data

    if (options.input1 !== undefined) {
      action = commands.INPUT
      data = inputs.HDMI1
    }
    else if (options.input2 !== undefined) {
      action = commands.INPUT
      data = inputs.HDMI2
    }
    else if (options.powered !== undefined) {
      action = commands.SET_POWER
      data = options.powered ? powerStatus.START_UP : powerStatus.STANDBY
    }
    if (!data || !action) {
      return Promise.reject(new Error('Wrong command!'))
    }
    return api.setAction(action, data)
  }

  unload() {
    if (this.server) {
      this.server.close()
    }
    if (this._refreshInterval) {
      clearInterval(this._refreshInterval)
      this._refreshInterval = null
    }
    return Promise.resolve()
  }

  async triggerDevice(device) {
    await this.setDeviceValue(device, 'powered', !device.powered);
    device.powered = !device.powered;
    device.defaultAction = device.powered ? 'Turn off' : 'Turn on';
    await this.lisa.createOrUpdateDevices(device)
  }

  _manageProjector(message, remote) {
    // const header = message.subarray(0, 4)
    // const id = String.fromCharCode.apply(null, header.subarray(0, 2))
    // const version = header[2]
    // const cat = String.fromCharCode.apply(null, header.subarray(3, 4))
    // const community = String.fromCharCode.apply(null, message.subarray(4, 8))
    const name = String.fromCharCode.apply(null, message.subarray(8, 20)).replace(new RegExp('\u0000', 'g'), '')
    const serial = Buffer.from(message.subarray(20, 24)).toString('hex')
    const power = Buffer.from(message.subarray(24, 26)).toString('hex')
    // const location = String.fromCharCode.apply(null, message.subarray(26, 50))

    return this.lisa.findDevices().then((devices) => {
      let device = devices.find((device) => device.privateData.serial === serial)

      let powered = this._isPowered(power);

      if (device) {
        device.privateData = this._getDevicePrivateData(serial);
        device.data = this._getDeviceData(power);
        device.powered = powered;
        device.defaultAction = powered ? 'Turn off' : 'Turn on';
        device.imageOn = 'smart_tv_on.svg';
        device.imageOff = 'smart_tv_off.svg';
        device.template = template;
      }
      else {
        device = {
          name: name,
          driver: 'vpl',
          powered: powered,
          imageOn: 'smart_tv_on.svg',
          imageOff: 'smart_tv_off.svg',
          defaultAction: powered ? 'Turn off' : 'Turn on',
          privateData: this._getDevicePrivateData(serial),
          data: this._getDeviceData(power),
          template: template
        }
      }

      device.data.port = 53484
      device.data.address = remote.address

      return this.lisa.createOrUpdateDevices(device)
    })
  }

  _isPowered(power) {
    return power === powerStatus.POWER_ON || power === powerStatus.START_UP || power === powerStatus.START_UP_LAMP ||
      power === 'ON' || power === 'WARMING';
  }

  _getDeviceData(power) {
    return {
      powered: this._isPowered(power) ?
        'true' : 'false',
      values: {'false': '/images/widgets/smart_tv_off.svg', 'true': '/images/widgets/smart_tv_on.svg'},
    }
  }

  _getDevicePrivateData(serial) {
    return {
      serial: serial,
    }
  }
}
