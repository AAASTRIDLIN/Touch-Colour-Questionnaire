import controlP5.*;//GUI
import processing.serial.*;
Serial port;
PFont font,font2;
ControlP5 cp5;
String val = "",warning="Please lift up your hand before click 'Rotate'";
void setup(){
  size(425,800);
  port = new Serial(this,Serial.list()[1],115200);
  println(Serial.list()[1]);
  cp5 = new ControlP5(this);
  font = createFont(PFont.list()[243],45);
  font2 = createFont(PFont.list()[243],20);
  cp5.addButton("rotate").setPosition(width/6,300).setSize(300,100)
  .setFont(font);
}

void draw(){
 background(255,255,255); 
 if ( port.available() > 0) 
  {  // If data is available,
  val = port.readStringUntil('\n');         // read it and store it in val
  } 
 fill(255,0,0); //text colour
 textFont(font);
 text("Wait",width/8,height/5*3,width-width/8,height-height/5);

}
void rotate(){
 port.write('r'); 
 println("rotate");
}
