'use strict'

const Plugin = require('lisa-plugin')

module.exports = class SonyVPLPlugin extends Plugin {

  /**
   * Initialisation of your plugin
   * Called once, when plugin is loaded
   * @returns Promise
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
        options.state = 'on'
        break
      case 'DEVICE_TURN_OFF':
      case 'VPL_OFF':
        options.state = 'off'
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

    return this.lisa.findDevices(criteria).then(devices => {
      const setStates = []
      devices.forEach(device => {
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
      drivers: require('./drivers'),
      pkg: require('./package'),
      config: require('./config'),
      bots: require('./bots')
    })
  }
}
