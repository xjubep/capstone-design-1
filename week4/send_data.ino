#include <WiFi.h>
#include <HTTPClient.h>
#include "OneWire.h"
#include "DallasTemperature.h"

const char* ssid = "AndroidHotspot0F_C1_3A";
const char* password = "0314682207";
const char* host = "3.21.37.105";
const uint16_t port = 8000;
const int device_id = 14;

int seq_num = 0;

OneWire oneWire(device_id);  // port number
DallasTemperature tempSensor(&oneWire);

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  delay(10);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  tempSensor.begin();
}

void loop() {
  // put your main code here, to run repeatedly:
  send_data();
}

double get_temp(void) {
  double temp;
  
  tempSensor.requestTemperaturesByIndex(0);  
  temp = tempSensor.getTempCByIndex(0);  

  return temp;
}

void send_data(void) {
  String url;
  double temp = get_temp();
  url = "/input?device_id=" + String(device_id);
  url += "&temperature_value=" + String(temp);
  url += "&sequence_number=" + String(seq_num);
  Serial.println(url);

  WiFiClient client;

  if (!client.connect(host, port)) {
    Serial.println("Connection failed.");
    return;
  }

  client.print("GET " + url + " HTTP/1.1\n\n");

  int maxloops = 0;

  while (!client.available() && maxloops < 1000) {
    maxloops++;
    delay(1);
  }

  if (client.available() > 0) {
    String line = client.readStringUntil('\r');
    Serial.println(line);
    seq_num++;
    if (seq_num == 720)
      seq_num = 0;
  }
  else {
    Serial.println("client.available() timed out");
  }

  Serial.println("Closing connection.");
  client.stop();

  Serial.println("Waiting 1 Minute before restarting...");
  delay(58000);
}
