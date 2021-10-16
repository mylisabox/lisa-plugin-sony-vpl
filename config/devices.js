import {createRequire} from 'module';

const require = createRequire(import.meta.url);
const template = require('../widgets/projector.json')

export default [
  {
    pairing: 'settings',
    name: {
      en: 'Sony VPL projector',
      fr: 'Projecteur Sony VPL',
    },
    description: {
      en: 'Add Sony VPL projector',
      fr: 'Ajout d\'un projecteur Sony VPL',
    },
    driver: 'vpl',
    type: 'other',
    template: template,
    imageOn: 'smart_tv_on.svg',
    imageOff: 'smart_tv_off.svg',
    defaultAction: {
      en: 'Turn on',
      fr: 'Allumer',
    },
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
          },
        },
        {
          'type': 'text_field',
          'id': 'port',
          'required': true,
          'maxLength': 5,
          'minLength': 2,
          'textInputAction': 2,
          'value': '53484',
          'decoration': {
            'labelText': 'Port*',
          },
        },
      ],
    },
  },
]
