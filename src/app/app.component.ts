import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataModel } from './data/data.model';
import Ideogram from 'ideogram';
import { IdeogramComponent} from './ideogram/ideogram.component'
// import {IdeogramComponent} from './ideogram/ideogram.component'
// import {MatPaginator} from '@angular/material/paginator';
// import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  // @ViewChild(IdeogramComponent, {static: false}) child;

  // ngAfterViewInit() {
  //   console.log('only after THIS EVENT "child" is usable!!');
  //   console.log(this.child)
  // }

  constructor(private http: HttpClient) {
    this.data = this.http.get<DataModel>('./assets/data.json');
    this.http.get('./assets/diabetes.json').subscribe(resp => {
      this.dbdata = resp;
      console.log(this.dbdata)
      this.get_result_names(this.dbdata)
    });;
  }

  example_ans = [{
    name: 'BRCA1',
    chr: '17',
    start: 43044294,
    stop: 43125482
  }]

  newAnnotationArray(current_variants){
    var newAA = []
    for(var i = 0; i < current_variants.length; i++){
      if(parseInt(current_variants[i].chrom) > 0){
        var newA = {
          name: current_variants[i].rsid,
          chr: current_variants[i].chrom,
          start:parseInt(current_variants[i].pos),
          stop:parseInt(current_variants[i].pos)
        };
        newAA.push(newA)
      }
    }
    return(newAA)
  }

  createIdeogram(annotations_array) {
    const ideogram = new Ideogram({
      organism: 'human',  
      container: '#ideo-container',
      annotations: annotations_array
    });
    console.log(ideogram)
  }

  title = 'MyDisease.info Explorer';
  data: Observable<DataModel>;
  dbdata: any;
  result_names = [];
  result_ids = [];
  result_defs = [];
  results_array = [];
  current_disease: any;
  get_result_names(result_json){
    this.result_names = [];
    this.result_ids = [];
    this.result_defs = [];
    this.results_array = [];
    for(var i = 0; i < result_json.hits.length; i++){
      if(result_json.hits[i].mondo && result_json.hits[i].disgenet){
        if(result_json.hits[i].disgenet.length > 0){
          // console.log("SDIFHOSDIFJSOF")
          // console.log(i)
          // console.log(result_json.hits[i])
          var new_disgenet = result_json.hits[i].disgenet[0]
          if(result_json.hits[i].disgenet.length > 1){
            for(var j = 1; j < result_json.hits[i].disgenet.length; j++){
              if(result_json.hits[i].disgenet[j].genes_related_to_disease.constructor === Array){
                new_disgenet.genes_related_to_disease = new_disgenet.genes_related_to_disease.concat(result_json.hits[i].disgenet[j].genes_related_to_disease)
              }
              else if(typeof(result_json.hits[i].disgenet[j].genes_related_to_disease) === "object"){
                // console.log("muah")
                new_disgenet.genes_related_to_disease.push(result_json.hits[i].disgenet[j].genes_related_to_disease)
              }
              if(result_json.hits[i].disgenet[j].variants_related_to_disease.constructor === Array){
                new_disgenet.variants_related_to_disease = new_disgenet.variants_related_to_disease.concat(result_json.hits[i].disgenet[j].variants_related_to_disease)
              }
              else if(typeof(result_json.hits[i].disgenet[j].variants_related_to_disease === "object")){
                new_disgenet.variants_related_to_disease.push(result_json.hits[i].disgenet[j].variants_related_to_disease)
              }
              
            }
          }
          result_json.hits[i].disgenet = new_disgenet
        }
        if(result_json.hits[i].disgenet.genes_related_to_disease){
          if(result_json.hits[i].disgenet.genes_related_to_disease.length > 0){
            // console.log("do nothing")
          }else{
            result_json.hits[i].disgenet.genes_related_to_disease = [result_json.hits[i].disgenet.genes_related_to_disease]
          }
        }            
        console.log(result_json.hits[i])
        this.result_names.push(result_json.hits[i].mondo.label)
        this.result_ids.push(result_json.hits[i]._id)
        this.result_defs.push(result_json.hits[i].mondo.definition)
        this.results_array.push(result_json.hits[i])
      }
    }
    console.log(this.result_names)
    console.log(this.result_ids)
    console.log(this.result_defs)
  }

 
  diseaseName:string;
  diseaseSearch($event: any){
  console.log("hellllooo")
  }
  methodInsideYourComponent($event){
    console.log("hellllooo2")
    console.log($event.target.value)
    
    // this.ideogram.createIdeogram();

    // this.createIdeogram();
    // console.log($event)
  }



  current_variant_array = [];

  getCurrentVariantArray(id){
    var temp_var_array = this.current_disease.disgenet.variants_related_to_disease

    var new_var_array = []
    new_var_array.push(temp_var_array[0])
    new_var_array[0].count = 1;
    for(var i = 1; i < temp_var_array.length; i++){
      var repeat = false;
      for(var j = 0; j < new_var_array.length; j++){
        if(temp_var_array[i].rsid === new_var_array[j].rsid){
          repeat = true;
          new_var_array[j].count = new_var_array[j].count + 1;
        }
      }
      if(repeat === false){
        temp_var_array[i].count = 1;
        new_var_array.push(temp_var_array[i])
      }
    }
    console.log("Nowwww")
    
    console.log(new_var_array)
    new_var_array = new_var_array.sort((a, b) => (a.count < b.count) ? 1 : -1)
    return(new_var_array)
  }

  udpatedAnnotations = []
  handleRadioChange($event){
    // console.log($event.target.value)
    // console.log(this.results_array)
    this.current_disease = this.results_array[parseInt($event.target.value)]
    // console.log("HIHIHIH")
    // console.log(this.current_disease)
    this.current_variant_array = this.getCurrentVariantArray(parseInt($event.target.value))
    this.udpatedAnnotations = this.newAnnotationArray(this.current_variant_array)
    console.log("NEW ANS")
    console.log(this.udpatedAnnotations)
    this.createIdeogram(this.udpatedAnnotations);
  }

  favoriteSeason: string;
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];
  

  ngOnInit() {
    // this.createIdeogram(this.example_ans);
    // console.log("hiiasdfoasdjfoiasjfoiasjfosdjfio")
  }

}
