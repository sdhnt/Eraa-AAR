import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { SignUpPage } from '../sign-up/sign-up'
import firebase from 'firebase'
import { FeedPage } from '../feed/feed';
import { Geolocation } from '@ionic-native/geolocation';
import { Injectable } from '@angular/core';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation';
import { HttpClient } from '@angular/common/http';
import { TextToSpeech } from '@ionic-native/text-to-speech';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

@Injectable()
export class LoginPage {

	email: string="";
  password: string="";
  res;
  heading;
  lat;
  long;
  totaldat;
  speaking;


  constructor(public navCtrl: NavController, public toastCtrl: ToastController, private geolocation: Geolocation,
     private deviceOrientation: DeviceOrientation, private http: HttpClient, private tts: TextToSpeech ) {

  }

  login(){


 
  firebase.auth().signInWithEmailAndPassword(this.email, this.password)
  .then( (user) => {console.log(user)
  this.toastCtrl.create({

  	message: "Welcome " + user.user.displayName,
  	duration: 3000
  }).present();
  this.navCtrl.setRoot(FeedPage)


  }).catch( (err) => {console.log(err)
    this.toastCtrl.create({

  	message: err.message,
  	duration: 3000
  }).present();




  })
  }

  gotoSignUp(){

  this.navCtrl.push(SignUpPage)

  }


  

  getLocation(){
    //console.log("Entered Function")
    this.geolocation.getCurrentPosition().then((resp) => {

       console.log("Compass")
       this.deviceOrientation.getCurrentHeading().then(
         (data: DeviceOrientationCompassHeading) => console.log(data),
          
         (error: any) => console.log(error)
       );

       var subscription = this.deviceOrientation.watchHeading().subscribe(
         (data: DeviceOrientationCompassHeading) => this.heading=data.magneticHeading,
         
       );
      
       

      // this.toastCtrl.create({
  
      //   message: "Lat " + resp.coords.latitude + " Long " + resp.coords.longitude + " " + this.heading,
      //   duration: 1000,
      // }).present();

      // console.log("GeoLoc1")
      // console.log(resp.coords.latitude) 
      // console.log(resp.coords.longitude) 
      // console.log(resp.coords.heading) 

     

     
      
     }).catch((error) => {
       console.log('Error getting location', error);
     }, 
     );
     var options = {
      enableHighAccuracy: true,
      timeout: 500,
      maximumAge: 0
    };

     let watch = this.geolocation.watchPosition(options);
     watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      console.log("GeoLoc2")
      console.log(data.coords.latitude) 
      console.log(data.coords.longitude) 
      console.log(data.coords.heading) 
      //Lat and Long
      this.lat=data.coords.latitude;
      this.long=data.coords.longitude;

      this.http.get("https://places.cit.api.here.com/places/v1/discover/around?app_id=YkPk0Q157MjLyGLCgJOs&app_code=16i7bpHinNjTgRaRS1NJeg&in="+data.coords.latitude+","+data.coords.longitude+";r=70&pretty")
      .subscribe(dataheremaps =>{
      // console.log("We got", dataheremaps);
      this.totaldat=dataheremaps["results"].items[0].category.title;
      this.res = dataheremaps["results"].items[0].title;
      console.log('The closest place near you is ',this.res)
      })
/////////////////// SPEECH
 if(this.res){
  this.tts.speak('You are looking at '+this.res)
  .then(() => 
  console.log("Voice Success")
  )
  .catch((reason: any) => console.log(reason));

  }
  this.tts.speak('')
     });
  }


}
