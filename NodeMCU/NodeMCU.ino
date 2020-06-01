#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>


#define FIREBASE_HOST "smart-home-fd884.firebaseio.com"
#define FIREBASE_AUTH "lO86dLLjzGFuembsmXdWKgFS33sOIWfEtkrzrwCC"
#define WIFI_SSID "PUTRA--2"
#define WIFI_PASSWORD "putradua"

#define ON HIGH
#define OFF LOW

int relay1 = D3; 
int relay2 = D4;
int relay3 = D1;
int relay4 = D2;
int led1 = D0;
int led2 = D6;
int led3 = D7;
int led4 = D8;

/*
int color;
String hex;
int arr;
String hexstring;
*/

void setup() {
  Serial.begin(115200);

  // connect to wifi.
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());
  
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);

    if (Firebase.failed()) {
      Serial.print("setting /number failed:");
      Serial.println(Firebase.error());  
      return;
  }
  delay(1000);

  pinMode(relay1, OUTPUT);
  pinMode(relay2, OUTPUT);
  pinMode(relay3, OUTPUT);
  pinMode(relay4, OUTPUT);
  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
  pinMode(led3, OUTPUT);
  pinMode(led4, OUTPUT); 
  
 /*
  Serial.print("Desimal Warnanya : ");
  color = Firebase.getInt("bedroomLight/Color/color/spectrumRGB");
  Serial.println(color);
  Serial.print("Hex Warnanya : ");
  Serial.println(color, HEX);
  hex = Serial.println(color, HEX);

*/


    }

void loop() {
     

  Serial.print("Fan Status: ");
  Serial.println(Firebase.getBool("fan/OnOff/on"));
  Serial.print("Kitchen Light Status: ");
  Serial.println(Firebase.getBool("kitchenLight/OnOff/on"));
  Serial.print("Office Light Status: ");
  Serial.println(Firebase.getBool("officeLight/OnOff/on"));
  Serial.print("Street Light Status: ");
  Serial.println(Firebase.getBool("streetLight/OnOff/on"));

  Serial.print("Bedroom Light Status: ");
  Serial.println(Firebase.getBool("bedroomLight/OnOff/on"));
  Serial.print("Coffee Maker Status: ");
  Serial.println(Firebase.getBool("coffeeMaker/OnOff/on"));
  Serial.print("Water Heater Status: ");
  Serial.println(Firebase.getBool("waterHeater/OnOff/on"));
  Serial.print("Dinning Room Light Status: ");
  Serial.println(Firebase.getBool("diningroomLight/OnOff/on")); 
  delay(1000);

   if (Firebase.getBool("fan/OnOff/on") == 1)  {
    digitalWrite(relay1, OFF);
  }
  if (Firebase.getBool("fan/OnOff/on") == 0)  {
    digitalWrite(relay1, ON);
  }
  if (Firebase.getBool("kitchenLight/OnOff/on") == 1)  {
    digitalWrite(relay2, OFF);
  }
  if (Firebase.getBool("kitchenLight/OnOff/on") == 0)  {
    digitalWrite(relay2, ON);
  }
  if (Firebase.getBool("officeLight/OnOff/on") == 1)  {
    digitalWrite(relay3, OFF);
  }
  if (Firebase.getBool("officeLight/OnOff/on") == 0)  {
    digitalWrite(relay3, ON);
  }
  if (Firebase.getBool("streetLight/OnOff/on") == 1)  {
    digitalWrite(relay4, OFF);
  }
  if (Firebase.getBool("streetLight/OnOff/on") == 0)  {
    digitalWrite(relay4, ON);
  }

  
  if (Firebase.getBool("bedroomLight/OnOff/on") == 1)  {
    digitalWrite(led1, ON);
  }
  if (Firebase.getBool("bedroomLight/OnOff/on") == 0)  {
    digitalWrite(led1, OFF);
  }
  if (Firebase.getBool("coffeeMaker/OnOff/on") == 1)  {
    digitalWrite(led2, ON);
  }
  if (Firebase.getBool("coffeeMaker/OnOff/on") == 0)  {
    digitalWrite(led2, OFF);
  }
  if (Firebase.getBool("waterHeater/OnOff/on") == 1)  {
    digitalWrite(led3, ON);
  }
  if (Firebase.getBool("waterHeater/OnOff/on") == 0)  {
    digitalWrite(led3, OFF);
  }
  if (Firebase.getBool("diningroomLight/OnOff/on") == 1)  {
    digitalWrite(led4, 225);
  }
  if (Firebase.getBool("diningroomLight/OnOff/on") == 0)  {
    digitalWrite(led4, 100);
  }
  delay(1000);
}
