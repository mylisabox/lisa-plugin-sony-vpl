const template = require('../widgets/projector.json')

module.exports = [
  {
    pairing: 'settings',
    name: {
      en: 'Sony VPL projector',
      fr: 'Projecteur Sony VPL'
    },
    description: {
      en: 'Add Sony VPL projector',
      fr: 'Ajout d\'un projecteur Sony VPL'
    },
    driver: 'vpl',
    type: 'other',
    template: template,
    image: 'projector.png',
    settings: {
      'type': 'column',
      'crossAxisAlignment': 3,
      'children': [
        {
          'type': 'text_field',
          'id': 'address',
          'required': true,
          'textInputAction': 6,
          'decoration': {
            'labelText': 'IP address*',
          }
        },
        {
          'type': 'text_field',
          'id': 'port',
          'required': true,
          'maxLength': 4,
          'minLength': 2,
          'textInputAction': 6,
          'value': '53484',
          'decoration': {
            'labelText': 'Port*',
          }
        },
      ],
    }
  }
]
