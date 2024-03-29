export default {
  "name": "SONY VPL projectors",
  "freeStates": {
    "VPL_ON": {
      "name": "Turn on the projector",
      "sentences": {
        "fr": [
          "allume(?: +\\w+){0,3} projecteur"
        ],
        "en": [
          "(?:turn|switch|put|set)(?: +\\w+){0,3} projector on",
          "(?:turn|switch|put|set) on(?: +\\w+){0,3} projector"
        ]
      },
      "responses": {
        "fr": [
          "Voila",
          "C'est fait"
        ],
        "en": [
          "Done",
          "It's done"
        ]
      }
    },
    "VPL_OFF": {
      "name": "Turn off the projector",
      "sentences": {
        "fr": [
          "(?:éteins|éteint|éteindre)(?: +\\w+){0,3} projecteur"
        ],
        "en": [
          "(?:turn|switch)(?: +\\w+){0,3} projector off",
          "(?:turn|switch|put|set) off(?: +\\w+){0,3} projector"
        ]
      },
      "responses": {
        "fr": [
          "Voila",
          "C'est fait"
        ],
        "en": [
          "Done",
          "It's done"
        ]
      }
    },
    "VPL_RATION": {
      "name": "Change image ratio of the projector",
      "sentences": {
        "fr": [
        ],
        "en": [
        ]
      },
      "responses": {
        "fr": [
          "Voila",
          "C'est fait"
        ],
        "en": [
          "Done",
          "It's done"
        ]
      }
    },
    "VPL_PRESET": {
      "name": "Change calibration preset of the projector",
      "sentences": {
        "fr": [
          "TODO"
        ],
        "en": [
        ]
      },
      "responses": {
        "fr": [
          "Voila",
          "C'est fait"
        ],
        "en": [
          "Done",
          "It's done"
        ]
      }
    },
    "VPL_INPUT": {
      "name": "Change HDMI input of the projector",
      "sentences": {
        "fr": [
        ],
        "en": [

        ]
      },
      "responses": {
        "fr": [
          "Voila",
          "C'est fait"
        ],
        "en": [
          "Done",
          "It's done"
        ]
      }
    }
  },
  "nestedStates": {},
  "links": []
}
