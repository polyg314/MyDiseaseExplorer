import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DataModel } from './data/data.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'MyDisease.info Explorer';
  data: Observable<DataModel>;
  constructor(private http: HttpClient) {
    this.data = this.http.get<DataModel>('./assets/data.json');
  }
  diseaseName:string;
  diseaseSearch($event: any){
  console.log("hellllooo")
  }
  methodInsideYourComponent($event){
    console.log("hellllooo2")
    console.log($event.target.value)
    // console.log($event)
  }
}
