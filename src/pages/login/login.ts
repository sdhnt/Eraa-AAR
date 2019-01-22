import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { SignUpPage } from '../sign-up/sign-up'
import firebase from 'firebase'
import { FeedPage } from '../feed/feed';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

	email: string="";
  password: string="";


  constructor(public navCtrl: NavController, public toastCtrl: ToastController, private geolocation: Geolocation) {

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

      this.toastCtrl.create({
  
        message: "Lat " + resp.coords.latitude + " Long " + resp.coords.longitude + " Head 118.1",
        duration: 1000,
      }).present();

      //console.log("58 degrees")
      console.log(resp.coords.latitude) 
      console.log(resp.coords.longitude) 
      console.log(resp.coords.heading) 
      
     }).catch((error) => {
       console.log('Error getting location', error);
     }, 
     );
     
     let watch = this.geolocation.watchPosition();
     watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      console.log(data.coords.latitude) 
      console.log(data.coords.longitude) 
      console.log(data.coords.heading) 
     });
  }

}
