import { Component, OnInit } from '@angular/core';
import { UserService } from '../api/user.service';
import { UploadingService } from  '../uploading.service';
import { FileUploader, FileLikeObject } from  'ng2-file-upload';
import { concat } from  'rxjs';
import {Media,MediaObject} from "@ionic-native/media/ngx";
import {File} from "@ionic-native/file/ngx";
import {FileTransfer,FileUploadOptions,FileTransferObject} from '@ionic-native/file-transfer/ngx';
import {FileChooser} from '@ionic-native/file-chooser/ngx';
import {FilePath} from '@ionic-native/file-path/ngx';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NativeRingtones } from '@ionic-native/native-ringtones/ngx';

@Component({
  selector: 'app-offerpage',
  templateUrl: './offerpage.page.html',
  styleUrls: ['./offerpage.page.scss'],
})
export class OfferpagePage implements OnInit {

  userDetails:any =[];
  userDetailsDJANGO:any =[];
  status:string = "";
  timer : number; // seconds
  timeArray :any= [];
  timer2 : number;
  interval;
  state = 'start';
  uploadText:any;
  dowloadText:any;
  fileTransfer:FileTransferObject;
  wordDetails:any = [];
  data: any = [];
  esit_dizi: any = [];
  uploadForName:string;
  audioFile:MediaObject = this.media.create(this.file.externalRootDirectory+'/'+ this.uploadForName + '.wav');
  isShow = false;
  motive:any;
  motiveText:any;
  gif:any;
  listenAudioFileName:any;

  public fileUploader: FileUploader = new FileUploader({});
  public hasBaseDropZoneOver: boolean = false;

  constructor(private userService:UserService,private route: ActivatedRoute,private media:Media,private file:File,
    private transfer:FileTransfer,private filePath:FilePath,
    private fileChooser:FileChooser,private uploadingService: UploadingService,public alertController: AlertController,
    private ringtones: NativeRingtones) 
  { 
    this.uploadText = "";
    this.dowloadText = "";
    this.route.queryParams.subscribe(params => {
      console.log("params:",params);
      if(params && params.wordArray){
        this.data = params.wordArray;
        console.log("data ",this.data);
      }
     
    });
    

  }
  ngOnInit() {
  }

  playAudioFile(listenAudioFile){
    this.listenAudioFileName = listenAudioFile;
    this.ringtones.playRingtone(this.listenAudioFileName);
    console.log("listenAudioFile",this.listenAudioFileName);
  }
 
  fileOverBase(event): void {
    this.hasBaseDropZoneOver = event;
  }

  getFiles(): FileLikeObject[] {
    
    return this.fileUploader.queue.map((fileItem) => {
      return fileItem.file;
     
    });

  }

  uploadFiles() {
    let files = this.getFiles();
    let requests = [];
    let name:string = 'irem'

    files.forEach((file) => {
      let formData = new FormData();
      formData.append('file' , file.rawFile, file.name);
      formData.append('user',name);
      requests.push(this.uploadingService.uploadWordFile(formData));
      
    });
    concat(...requests).subscribe(
      (res) => {
        console.log(res );
        this.motive = res
        //console.log(this.motive)
        this.motiveRightOrWrong()
      },
      (err) => {  
        console.log(err);
      }
    );
    this.fileUploader.queue.pop();

  }

  motiveRightOrWrong(){
    
    if(this.motive == true){
      this.presentAlertTrue();
   
     // this.motiveText = "TEBRİKLER DOGRU ";
      this.gif = "../../assets/gifs/tenor.gif" 
    }
    else{
      this.presentAlertFalse();

     // this.motiveText = "HADİ TEKRAR DENEYELİM"
      this.gif = "../../assets/gifs/false3.gif" 

    }
  }
 
  async presentAlertTrue() {
    const alert = await this.alertController.create({
      header: 'SONUÇ',
      message: 'TEBRİKLER DOGRU',
      buttons: ['TAMAM'],
    });
  
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
    this.fileUploader.queue.splice;
  }

  async presentAlertFalse() {
    const alert = await this.alertController.create({
      header: 'SONUÇ',
      message: 'HADİ TEKRAR DENEYELİM',
      buttons: ['TAMAM'],
    });
  
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  
  RecordAudio(){
    this.audioFile.startRecord();
    this.status = "kayıt..."
    this.startTimer();
  }
  StopRecording(wordName){
    this.uploadForName = wordName;
    //wordName turkce karakter bulundurmamalı
    console.log(wordName);
    this.audioFile.stopRecord();
    this.status = "kaydedildi..."
    this.stopTimer();
    setTimeout(() => 
    {

      this.uploadFiles();
    },10000);
    
  }

  startTimer(){
    this.state ='start';
    clearInterval(this.interval);
    this.timer = 0;
    this.updateTimeValue();
    this.interval = setInterval( () => {
      this.updateTimeValue();
    }, 1000);
  }
  stopTimer(){
    clearInterval(this.interval);
  
   }
 

   updateTimeValue(){
     let minutes :any = this.timer / 60;
     let seconds :any = this.timer % 60;
 
     minutes = String ('0' + Math.floor(minutes)).slice(-2);
     seconds = String ('0' + Math.floor(seconds)).slice(-2);
 
     const text = minutes + ':' + seconds;
 
     ++this.timer;
 
     if (this.timer<0){
       this.startTimer();
     }
 
    }
    GetWordsDetails(){
     
      this.userService.GetWordsDJANGO().subscribe((words)=> {
        var anyData = <any>words;
        this.wordDetails = anyData.words;
        this.Letter2()
      })
      this.isShow = !this.isShow; //divi gizliyor

    }  
    Letter2(){
      for(let j=0;j<this.data.length;j++){
        for(let i=0;i<this.wordDetails.length;i++){
          if(this.data[j] == this.wordDetails[i].letter){
              console.log("eşit olan ", this.wordDetails[i].letter)
              this.esit_dizi.push(this.wordDetails[i]);
              console.log(this.esit_dizi);
          }

        }
      }
    }

    Delete(){
      for(let i = 0; i< this.data.length;i++){
        for(let j =1; j< this.data.length;j++){
          if(this.data[i] == this.data[j]){
            this.data[i] = this.data[i].replace(this.data[i],'');
          }
        }
      }
      //console.log(this.data);
    }
  }
