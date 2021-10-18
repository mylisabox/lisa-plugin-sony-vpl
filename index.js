import {Plugin} from 'lisa-plugin';
import {createRequire} from 'module';
import bots from './bots/index.js';

import config from './config/index.js';
import drivers from './drivers/index.js';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default class SonyVPLPlugin extends Plugin {
  /**
   * Initialisation of your plugin
   * Called once, when plugin is loaded
   * @return Promise
   */
  init() {
    return super.init()
  }

  /**
   * Called when
   * @param action to execute
   * @param infos context of the action
   * @return Promise
   */
  interact(action, infos) {
    const room = infos.fields.room || infos.context.room
    const device = infos.fields.device
    if (device && device.pluginName !== this.fullName) {
      return Promise.resolve()
    }
    const options = {}
    switch (action) {
    case 'DEVICE_TURN_ON':
    case 'VPL_ON':
      options.powered = true
      break
    case 'DEVICE_TURN_OFF':
    case 'VPL_OFF':
      options.powered = false
      break
    case 'VPL_RATIO':
      break
    case 'VPL_PRESET':
      break
    case 'VPL_INPUT':
      break
    default:
      return Promise.resolve()
    }

    const criteria = {}
    if (room) {
      criteria.roomId = room.id
    }
    else if (device) {
      return this.drivers.vpl.setAction(device, options)
    }

    return this.lisa.findDevices(criteria).then((devices) => {
      const setStates = []
      devices.forEach((device) => {
        setStates.push(this.drivers.vpl.setAction(device, options))
      })
      return Promise.all(setStates)
    })
  }

  unload() {
    return super.unload()
  }

  constructor(app) {
    super(app, {
      drivers: drivers,
      pkg: pkg,
      config: config,
      bots: bots,
    })
  }
}
