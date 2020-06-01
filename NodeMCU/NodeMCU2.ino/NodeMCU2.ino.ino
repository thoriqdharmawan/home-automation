#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>

#define FIREBASE_HOST "XXXXXXXX"
#define FIREBASE_AUTH "XXXXXXX"
#define WIFI_SSID "thq"
#define WIFI_PASSWORD "thoriqdharmawan"

int pinMerah = 16;
int pinHijau = 5;
int pinBiru = 4;

int Reading = 14;
int Coffee = 12;
int Water = 15;
int dbReading;
int dbCoffee;
int dbWater;
int dbBed;
int Brightness, dbBrightness;
String color;

void setup () {

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
 
    pinMode ( pinMerah, OUTPUT );
    pinMode ( pinHijau, OUTPUT );
    pinMode ( pinBiru, OUTPUT );

    pinMode (Reading, OUTPUT);
    pinMode (Coffee, OUTPUT);
    pinMode (Water, OUTPUT);
    
    
}
void loop () {
  dbReading = Firebase.getBool("readingLamp/OnOff/on");
  dbCoffee = Firebase.getBool("coffeeMaker/OnOff/on");
  dbWater = Firebase.getBool("waterHeater/OnOff/on");
  dbBed = Firebase.getBool("bedroomLight/OnOff/on");
  dbBrightness = Firebase.getInt("readingLamp/Brightness/brightness");
  color = Firebase.getString("bedroomLight/Color/color/name");
  Brightness = dbBrightness*10.24;
  
  Serial.print("Bedroo, Light : ");
  Serial.println(dbBed);
  Serial.print("Reading Light : ");
  Serial.println(dbReading);
  Serial.print("Coffee: ");
  Serial.println(dbCoffee);
  Serial.print("Water : ");
  Serial.println(dbWater);
  Serial.print("Brightness : ");
  Serial.println(Brightness);  

  if (dbReading == true){
      analogWrite(Reading, Brightness);
    }
  else if (dbReading == false){
      digitalWrite(Reading, LOW);
    }
  /*=============================================================================*/

   if (dbCoffee == true){
      digitalWrite(Coffee, HIGH);
    }
  else if (dbCoffee == false){
      digitalWrite(Coffee, LOW);
    }
  /*==============================================================================*/

  if (dbWater == true){
      digitalWrite(Water, HIGH);
    }
  else if (dbWater == false){
      digitalWrite(Water, LOW);
    }
  /*==============================================================================*/

  if(dbBed == false){
    digitalWrite(pinMerah, LOW);//Mati
      digitalWrite(pinHijau, LOW);
      digitalWrite(pinBiru, LOW);
    }
  /*==============================================================================*/
  if (color == "red" && dbBed == true){
      analogWrite(pinMerah, 255);//red
      analogWrite(pinHijau, 0);
      analogWrite(pinBiru, 0);
    }

  else if (color == "orange" && dbBed == true){
    analogWrite(pinMerah, 255);//orange
    analogWrite(pinHijau, 127);
    analogWrite(pinBiru, 0);
    }
    
  else if (color == "yellow" && dbBed == true){
    analogWrite(pinMerah, 255);//yellow
    analogWrite(pinHijau, 255);
    analogWrite(pinBiru, 0);
    }

    else if (color == "green" && dbBed == true){
    analogWrite(pinMerah, 0);//green
    analogWrite(pinHijau, 255);
    analogWrite(pinBiru, 0);
    }
    else if (color == "blue" && dbBed == true){
    analogWrite(pinMerah, 0);//blue
    analogWrite(pinHijau, 0);
    analogWrite(pinBiru, 255);
    }
    else if (color == "indigo" && dbBed == true){
    digitalWrite(pinMerah, 111);//nila
    digitalWrite(pinHijau, 0);
    digitalWrite(pinBiru, 255);
    }
    else if (color == "purple" && dbBed == true){
    analogWrite(pinMerah, 191);//ungu
    analogWrite(pinHijau, 0);
    analogWrite(pinBiru, 255);
    }
    
}
