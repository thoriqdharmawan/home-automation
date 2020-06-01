"use strict";

const functions = require("firebase-functions");
const { smarthome } = require("actions-on-google");
const util = require("util");
const admin = require("firebase-admin");

// Initialize Firebase
admin.initializeApp();
const firebaseRef = admin.database().ref("/");

exports.fakeauth = functions.https.onRequest((request, response) => {
  const responseurl = util.format(
    "%s?code=%s&state=%s",
    decodeURIComponent(request.query.redirect_uri),
    "xxxxxx",
    request.query.state
  );
  console.log(responseurl);
  return response.redirect(responseurl);
});

exports.faketoken = functions.https.onRequest((request, response) => {
  const grantType = request.query.grant_type
    ? request.query.grant_type
    : request.body.grant_type;
  const secondsInDay = 86400; // 60 * 60 * 24
  const HTTP_STATUS_OK = 200;
  console.log(`Grant type ${grantType}`);

  let obj;
  if (grantType === "authorization_code") {
    obj = {
      token_type: "bearer",
      access_token: "123access",
      refresh_token: "123refresh",
      expires_in: secondsInDay,
    };
  } else if (grantType === "refresh_token") {
    obj = {
      token_type: "bearer",
      access_token: "123access",
      expires_in: secondsInDay,
    };
  }
  response.status(HTTP_STATUS_OK).json(obj);
});

let jwt;
try {
  jwt = require("./key.json");
} catch (e) {
  console.warn("Service account key is not found");
  console.warn("Report state will be unavailable");
}

const app = smarthome({
  debug: true,
  key: "<api-key>",
});

app.onSync((body, headers) => {
  // TODO: Implement full SYNC response
  return {
    requestId: body.requestId,
    payload: {
      devices: [
        {
          id: "officeLight",
          type: "action.devices.types.LIGHT",
          traits: ["action.devices.traits.OnOff"],
          name: {
            defaultNames: ["Office Light"],
            name: "Front Office Light",
          },
        },
        {
          id: "bedroomLight",
          type: "action.devices.types.LIGHT",
          traits: [
            "action.devices.traits.OnOff",
            // 'action.devices.traits.Brightness',
            "action.devices.traits.ColorSetting",
          ],
          name: {
            defaultNames: ["Bedroom Light"],
            name: "Bedroom",
          },
          attributes: {
            colorModel: "rgb",
            colorTemperatureRange: {
              temperatureMinK: 2000,
              temperatureMaxK: 9000,
            },
            commandOnlyColorSetting: false,
          },
        },
        {
          id: "readingLamp",
          type: "action.devices.types.LIGHT",
          traits: [
            "action.devices.traits.OnOff",
            "action.devices.traits.Brightness",
          ],
          name: {
            defaultNames: ["Reading Light"],
            name: "Reading Lamp",
          },
        },
        {
          id: "kitchenLight",
          type: "action.devices.types.LIGHT",
          traits: ["action.devices.traits.OnOff"],
          name: {
            defaultNames: ["Kitchen Light"],
            name: "Kitchen Light",
          },
        },
        {
          id: "streetLight",
          type: "action.devices.types.LIGHT",
          traits: ["action.devices.traits.OnOff"],
          name: {
            defaultNames: ["My Street Light"],
            name: "Street Light",
          },
        },
        {
          id: "fan",
          type: "action.devices.types.FAN",
          traits: [
            "action.devices.traits.OnOff",
            "action.devices.traits.FanSpeed",
          ],
          name: {
            defaultNames: ["My Fan"],
            name: "Fan",
          },
          attributes: {
            availableFanSpeeds: {
              speeds: [
                {
                  speed_name: "S1",
                  speed_values: [
                    {
                      speed_synonym: ["low", "slow"],
                      lang: "en",
                    },
                  ],
                },
                {
                  speed_name: "S2",
                  speed_values: [
                    {
                      speed_synonym: ["medium", "normal"],
                      lang: "en",
                    },
                  ],
                },
                {
                  speed_name: "S3",
                  speed_values: [
                    {
                      speed_synonym: ["high", "fast"],
                      lang: "en",
                    },
                  ],
                },
              ],
              ordered: true,
            },
            reversible: true,
          },
        },
        {
          id: "coffeeMaker",
          type: "action.devices.types.COFFEE_MAKER",
          traits: [
            "action.devices.traits.OnOff",
            "action.devices.traits.TemperatureControl",
          ],
          name: {
            defaultNames: ["Coffee Maker"],
            name: "Coffee Maker",
          },
          attributes: {
            temperatureRange: {
              minThresholdCelsius: 30,
              maxThresholdCelsius: 100,
            },
            temperatureStepCelsius: 1,
            temperatureUnitForUX: "C",
          },
        },
        /*{
				id : 'airConditioning',
				type : 'action.devices.types.AC_UNIT',
				traits : [
					'action.devices.traits.OnOff',
					'action.devices.traits.FanSpeed',
					'action.devices.traits.TemperatureSetting'
				],
				name : {
					defaultNames: ['Air Conditioning'],
					name : 'My Air Conditioning',
				},
				attributes: {
					availableFanSpeeds:{
						speeds:[{
							speed_name: 'S1',
							speed_values: [{
								speed_synonym : ['low', 'slow'],
								lang : 'en'
							}]
						},{
							speed_name: 'S2',
							speed_values:[{
								speed_synonym : ['medium', 'normal'],
								lang : 'en'
							}]
						},{
							speed_name: 'S3',
							speed_values:[{
								speed_synonym : ['high', 'fast'],
								lang : 'en'
							}]
						}],
						ordered: true
					},
					reversible : true,
					commandOnlyTemperatureSetting : true,
					thermostatTemperatureUnit : 'C',
					temperatureRange: {
            			minThresholdCelsius: 16,
            			maxThresholdCelsius: 32
          			},
				}
			},*/
        {
          id: "waterHeater",
          type: "action.devices.types.WATERHEATER",
          traits: [
            "action.devices.traits.OnOff",
            "action.devices.traits.TemperatureControl",
          ],
          name: {
            defaultNames: ["Heater"],
            name: "Water Heater",
          },
          attributes: {
            temperatureRange: {
              minThresholdCelsius: 30,
              maxThresholdCelsius: 100,
            },
            temperatureStepCelsius: 1,
            temperatureUnitForUX: "C",
          },
        },
      ],
    },
  };
});
///++++++++++++++++++++++++++++
const queryFirebase = (deviceId) =>
  firebaseRef
    .child(deviceId)
    .once("value")
    .then((snapshot) => {
      const snapshotVal = snapshot.val();
      return {
        on: snapshotVal.OnOff.on,
      };
    });

const queryDevice = (deviceId) =>
  queryFirebase(deviceId).then((data) => ({
    on: data.on,
  }));

app.onQuery((body) => {
  const { requestId } = body;
  const payload = {
    devices: {
      streetLight: {
        on: true,
        online: true,
      },
    },
  };
  const queryPromises = [];
  for (const input of body.inputs) {
    for (const device of input.payload.devices) {
      const deviceId = device.id;
      queryPromises.push(
        queryDevice(deviceId).then((data) => {
          // Add response to device payload
          payload.devices[deviceId] = data;
        })
      );
    }
  }
  // Wait for all promises to resolve
  return Promise.all(queryPromises).then((values) => ({
    requestId: requestId,
    payload: payload,
  }));
});
//+++++++++++++++++++++++++++++++

app.onExecute((body) => {
  const { requestId } = body;
  const payload = {
    commands: [
      {
        ids: [],
        status: "SUCCESS",
        states: {
          online: true,
        },
        ids: ["coffeeMaker", "waterHeater"],
        status: "SUCCESS",
        states: {
          temperatureSetpointCelsius: 40,
          temperatureAmbientCelsius: 140,
        },
        ids: ["bedroomLightMain"],
        status: "SUCCESS",
        states: {
          online: true,
          // brightness : 50,
          color: {
            spectrumRgb: 16711935,
          },
        },
        ids: ["fan"],
        status: "SUCCESS",
        states: {
          currentFanSpeedSetting: "S1",
        },
        /*ids: ['airConditioning'],
        status : 'SUCCESS',
        states: {
        	currentFanSpeedSetting: 'S2',
        	thermostatTemperatureSetpoint: 16,
        	thermostatTemperatureSetpointHigh : 32,
        	thermostatTemperatureSetpointLow : 16,
        },*/
        ids: ["readingLamp"],
        status: "SUCCESS",
        states: {
          brightness: 95,
        },
      },
    ],
  };

  for (const input of body.inputs) {
    for (const command of input.payload.commands) {
      for (const device of command.devices) {
        const deviceId = device.id;
        payload.commands[0].ids.push(deviceId);
        for (const execution of command.execution) {
          const execCommand = execution.command;
          const { params } = execution;
          switch (execCommand) {
            case "action.devices.commands.OnOff":
              firebaseRef.child(deviceId).child("OnOff").update({
                on: params.on,
              });
              payload.commands[0].states.on = params.on;
              break;
            case "action.devices.commands.SetTemperature":
              firebaseRef.child(deviceId).child("TemperatureControl").update({
                temperature: params.temperature,
              });
              payload.commands[0].states.temperature = params.temperature;
              break;
            case "action.devices.commands.BrightnessAbsolute":
              firebaseRef.child(deviceId).child("Brightness").update({
                brightness: params.brightness,
              });
              payload.commands[0].states.brightness = params.brightness;
              break;
            case "action.devices.commands.ColorAbsolute":
              firebaseRef.child(deviceId).child("Color").update({
                color: params.color,
              });
              payload.commands[0].states.color = params.color;
              break;
            case "action.devices.commands.SetFanSpeed":
              firebaseRef.child(deviceId).child("fanSpeed").update({
                fanSpeed: params.fanSpeed,
              });
              payload.commands[0].states.fanSpeed = params.fanSpeed;
              break;
            /* case 'action.devices.commands.TemperatureRelative':
              	firebaseRef.child(deviceId).child('TemperatureControl').update({
                	thermostatTemperatureRelativeDegree : params.thermostatTemperatureRelativeDegree,
              	});
              	payload.commands[0].states.thermostatTemperatureRelativeDegree = params.thermostatTemperatureRelativeDegree;
              	break;*/
          }
        }
      }
    }
  }
  return {
    requestId: requestId,
    payload: payload,
  };
});

exports.smarthome = functions.https.onRequest(app);

exports.requestsync = functions.https.onRequest((request, response) => {
  console.info("Request SYNC for user 123");
  app
    .requestSync("123")
    .then((res) => {
      console.log("Request sync completed");
      response.json(res.data);
    })
    .catch((err) => {
      console.error(err);
    });
});

/**
 * Send a REPORT STATE call to the homegraph when data for any device id
 * has been changed.
 */
exports.reportstate = functions.database.ref("{deviceId}").onWrite((event) => {
  console.info("Firebase write event triggered this cloud function");
  ///++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  const snapshotVal = event.after.val();

  const postData = {
    requestId: "ff36a3cc" /* Any unique ID */,
    payload: {
      devices: {
        states: {
          /* Report the current state of our washer */
          [event.params.deviceId]: {
            on: snapshotVal.OnOff.on,
          },
        },
      },
    },
  };
  ////++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
});
