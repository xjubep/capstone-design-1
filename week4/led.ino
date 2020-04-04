int led[3] = {23, 19, 33};  // R, Y, B
int gnd[3] = {22, 18, 32};
int trig = 13, echo = 14;

void setup() {
  // put your setup code here, to run once:
  for (int i = 0; i < 3; i++) {
    pinMode(led[i], OUTPUT);
    pinMode(gnd[i], OUTPUT);
    
    digitalWrite(led[i], 1);
    digitalWrite(gnd[i], 0);
  }
  pinMode(trig, OUTPUT); // trig
  pinMode(echo, INPUT);  // echo
  
  Serial.begin(115200);
}

int dis;

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(trig, 1);
  delay(10);
  digitalWrite(trig, 0);
  dis = pulseIn(echo, 1) * 17 / 1000;
  Serial.printf("%d cm\n", dis);
  delay(100);

  if (dis < 5) {
    blnk(10);
  }
  else if (dis < 10) {
    blnk(50);    
  }
  else if (dis < 15) {
    blnk(100);
  }
}

void blnk(int delay_time) {
  for (int i = 0; i < 500/delay_time; i++) {
    for (int j = 0; j < 3; j++) {
      digitalWrite(led[j], 1);
      delay(delay_time);
      digitalWrite(led[j], 0);
      delay(delay_time);
    }
  }
}
