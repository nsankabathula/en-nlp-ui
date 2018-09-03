import { Component } from '@angular/core';
import { TrainingService } from 'src/app/services/training.service';
import { FileItem, TLineItem, PLineItem, Accuracy } from 'src/app/models/model';
import { Observable } from 'rxjs';
import { forkJoin } from "rxjs";
import { error } from 'util';
@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  //styleUrls: ['./training.component.css']
})
export class TrainingComponent {
  title = 'app';
  fileItems: Array<Array<FileItem>> = [];
  selectedFile: FileItem;
  selectedFileDetails: Array<TLineItem> = [];
  predictionAvailable: boolean = false;
  predictResult: Array<PLineItem> = [];
  showPredictionResult: boolean = false;
  accuracyScore: Accuracy = null;
  constructor(private trainingSvc: TrainingService) {
    trainingSvc.getFileNames().subscribe((res) => {
      var i = 0, step = 30;
      for (i = 0; i < res.length; i = i + step) {
        this.fileItems.push(res.slice(i, i + step))
      }

      //console.log(this.fileNames)
    });

  }

  resetCollation(fileItem: FileItem): void {
    this.predictResult = []
    this.predictionAvailable = false;
    this.showPredictionResult = false;

    this.trainingSvc.getCollation(fileItem).subscribe(
      (result) => {
        this.predictionAvailable = true;
        this.predictResult = result;
        this.accuracyScore = this.trainingSvc.accuracyScore(this.predictResult)
      },
      (error: any) => { console.error(error) }
    )
  }



  fileNameSelected(fileItem: FileItem) {
    console.log(fileItem);
    this.selectedFile = fileItem;
    this.selectedFileDetails = [];
    this.predictResult = []
    this.predictionAvailable = false;
    this.showPredictionResult = false;
    this.trainingSvc.getFileContent(fileItem).subscribe(
      (res) => {
        this.selectedFileDetails = res;
        this.resetCollation(fileItem);
      },
      (error: any) => { },
      () => {

      }

    )

  }






  lineSelected(line: PLineItem, training: boolean = true) {
    line.target = (training) ? ((line.target == 0) ? 1 : 0) : ((line.predict == 0) ? 1 : 0);
    this.trainingSvc.updateLine(line, this.selectedFile, training).subscribe((res) => {
      console.log(res);
    }, (err: any) => {
      console.error(err)
    })
  }

  togglePredictionResult(predict) {
    this.showPredictionResult = (predict) ? !this.showPredictionResult : predict
    console.info("this.showPredictionResult: ", this.showPredictionResult)
  }

  deleteSelecteFile(fileItem: FileItem) {
    this.trainingSvc.delete(fileItem).subscribe((res) => {
      console.log(res);
      alert("Deletion Complete")
    }, (err: any) => {
      console.error("Delete error ", err);
      alert("Deletion Complete With Errors")
    })
  }


  markSelecteFile(fileItem: FileItem) {
    fileItem.useForTraining = fileItem.useForTraining > 0 ? 0 : 1;
    this.trainingSvc.markFileForTraining(fileItem).subscribe((res) => {
      console.log(res);
      alert("File Marked for Training")
    }, (err: any) => {
      console.error("File Marked for Training error ", err);
      alert("File Marked for Training With Errors")
    })
  }

  buildTrainingFeatures(fileItem: FileItem, training: boolean) {
    var that = this;
    that.predictionAvailable = false;
    that.predictResult = [];
    that.trainingSvc.predict(fileItem, training).subscribe((res) => {



      if (training) {
        that.fileNameSelected(fileItem)
        alert("Building Features Complete ")
      }
      else {
        that.resetCollation(fileItem);
        that.togglePredictionResult(true);
        alert("Prediction Complete ")
      }

    }, (error) => {
      console.error(error);
      alert("Prediction Complete With Errors")
    }, () => { })
  }


  mergePrediction(fileItem: FileItem) {
    this.trainingSvc.merge(fileItem).subscribe((res) => {
      console.log(res);
      alert("Merge Complete")
      this.fileNameSelected(fileItem)

    }, (err: any) => {
      console.error("Merge error ", err);
      alert("Merge Complete With Errors");
    })
  }



}
