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
  dbdata: any;
  result_names = [];
  result_ids = [];
  result_defs = [];
  get_result_names(result_json){
    this.result_names = [];
    this.result_ids = [];
    this.result_defs = [];
    for(var i = 0; i < result_json.hits.length; i++){
      if(result_json.hits[i].mondo){
        console.log(result_json.hits[i])
        this.result_names.push(result_json.hits[i].mondo.label)
        this.result_ids.push(result_json.hits[i]._id)
        this.result_defs.push(result_json.hits[i].mondo.definition)
      }
    }
    console.log(this.result_names)
    console.log(this.result_ids)
    console.log(this.result_defs)
  }

  constructor(private http: HttpClient) {
    this.data = this.http.get<DataModel>('./assets/data.json');
    this.http.get('./assets/diabetes.json').subscribe(resp => {
      this.dbdata = resp;
      console.log(this.dbdata)
      this.get_result_names(this.dbdata)
    });;
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

  handleRadioChange($event){
    console.log($event.target.value)
  }


}
