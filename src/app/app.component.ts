import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, AfterViewInit, ElementRef} from '@angular/core';
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
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements AfterViewInit {


  // @ViewChild(IdeogramComponent, {static: false}) child;
  // ngAfterContentChecked() {
  //   if(this.current_variant_array.length > 0){
  //     this.createIdeogram(this.updatedAnnotations);
  //   }
  // }
  // ngAfterViewInit() {
  //   console.log('only after THIS EVENT "child" is usable!!');
  //   console.log(this.child)
  // }

  constructor(private http: HttpClient, private elementRef: ElementRef) {
    this.data = this.http.get<DataModel>('./assets/data.json');
    this.http.get('./assets/diabetes.json').subscribe(resp => {
      this.dbdata = resp;
      console.log(this.dbdata)
      this.get_result_names(this.dbdata)
      this.searchTerm = 'diabetes';
      // this.searchResults = true;
    });;
  }
  ngAfterViewInit(){
    
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#f9f5f6';
    this.elementRef.nativeElement.ownerDocument.body.style.overflow.x = 'hidden';
    
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
      chrWidth: 8,
      chrHeight: 140,
      chrLabelSize: 10,
      rows: 2,
      rotatable: false,
      annotations: annotations_array
    });
    // console.log(ideogram)
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
        // console.log(result_json.hits[i])
        this.result_names.push(result_json.hits[i].disgenet.xrefs.disease_name)
        this.result_ids.push(result_json.hits[i]._id)
        this.result_defs.push(result_json.hits[i].mondo.definition)
        this.results_array.push(result_json.hits[i])
      }
    }
    // console.log(this.result_names)
    // console.log(this.result_ids)
    // console.log(this.result_defs)
  }

  searchTerm = '';
  searchResults = false;
 
  diseaseName:string;
  diseaseSearch($event: any){
  console.log("hellllooo")
  }
  searchForDisease($event){
    this.elementRef.nativeElement.ownerDocument.body.style.transition = 'all 2s ease 0s';
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#fff';
    // console.log("hellllooo2")
    // console.log($event.target.value)
    this.searchTerm = $event.target.value;
    var api_string = 'http://mydisease.info/v1/query?q=' + this.searchTerm
    if(this.searchTerm.length > 0){
      this.http.get(api_string).subscribe(resp => {
        this.dbdata = resp;
        console.log(this.dbdata)
        this.get_result_names(this.dbdata)
        this.searchResults = true;
      });;
    }else{
      this.current_disease = '';
      // console.log("OKasdfasfadf")
    }
    
    
    // this.ideogram.createIdeogram();

    // this.createIdeogram();
    // console.log($event)
  }



  current_variant_array = [];

  getCurrentVariantArray(id){
    var temp_var_array = this.current_disease.disgenet.variants_related_to_disease
    console.log("vavavava")
    console.log(this.current_disease.disgenet)
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
    // console.log("Nowwww")
    
    // console.log(new_var_array)
    new_var_array = new_var_array.sort((a, b) => (a.count < b.count) ? 1 : -1)
    return(new_var_array)
  }

  updatedAnnotations = []
  current_disease_name = '';
  handleRadioChange($event){
    this.createGeneIdeogram([{}])
    // console.log($event.target.value)
    // console.log(this.results_array)
    this.current_disease = this.results_array[parseInt($event.target.value)]
    this.current_disease_name = this.result_names[parseInt($event.target.value)]
    // console.log("HIHIHIH")
    // console.log(this.current_disease)
    this.current_variant_array = this.getCurrentVariantArray(parseInt($event.target.value))
    this.updatedAnnotations = this.newAnnotationArray(this.current_variant_array)
    // console.log("NEW ANS")
    // console.log(this.updatedAnnotations)
    // ngAfterContentChecked() {
 
    // }
    // this.createGeneIdeogram([])
    this.createIdeogram(this.updatedAnnotations);
  }


  geneAA = [];
  geneJson: any;
  currentSearchGene: any;
  geneSearch(gene_name){
    // console.log("HISDFHSDOIF")
    // console.log(gene_name)
    // this.createGeneIdeogram([])
    this.geneAA = []

   
    var api_string = 'https://mygene.info/v3/query?q=' + gene_name + '&fields=symbol%2Cgenomic_pos%2Cname&species=human&size=1'

    this.http.get(api_string).subscribe(resp => {
        // console.log(resp.hits[0])
        this.geneJson = resp
        console.log(this.geneJson.hits[0])
        if(this.geneJson.hits[0].genomic_pos){
          var myGeneA = {
            name: this.geneJson.hits[0].symbol,
            chr: this.geneJson.hits[0].genomic_pos.chr,
            start: this.geneJson.hits[0].genomic_pos.start,
            stop: this.geneJson.hits[0].genomic_pos.end,
            id: this.geneJson.hits[0].genomic_pos.ensemblgene,
            color: 'red'
          }
          this.currentSearchGene = myGeneA
          this.currentSearchGene.description = this.geneJson.hits[0].name,
          console.log(myGeneA)
          this.geneAA.push(myGeneA)
          this.createGeneIdeogram(this.geneAA)
        }
        else{
          this.geneJson = []
        }
   
        // var myGeneA = {
        //     name: gene.symbol,
        //     chr: geneJson.hits[0]
        //     start: genomic_pos.start,
        //     stop: genomic_pos.end,
        //     id: genomic_pos.ensemblgene,
        //     color: color
        // }
        // this.dbdata = resp;
        // console.log(this.dbdata)
        // this.get_result_names(this.dbdata)
        // this.searchResults = true;
      });;
    }

  
 
  favoriteSeason: string;
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];


  ngOnInit() {
    
    // this.createIdeogram(this.example_ans);
    // console.log("hiiasdfoasdjfoiasjfoiasjfosdjfio")
  }

  // `https://webservice.wikipathways.org/findInteractions${queryString}`;
  // const taxid = ideogram.config.taxid;
  // const orgUnderscored = ideogram.config.organism.replace(/[ -]/g, '_');

  // const params = `&format=condensed&type=paralogues&target_taxon=${taxid}`;
  // let path = `/homology/id/${annot.id}?${params}`


  // newGeneAnnotationArray(current_variants){
  //   var newAA = []
  //   for(var i = 0; i < current_variants.length; i++){
  //     if(parseInt(current_variants[i].chrom) > 0){
  //       var newA = {
  //         name: current_variants[i].rsid,
  //         chr: current_variants[i].chrom,
  //         start:parseInt(current_variants[i].pos),
  //         stop:parseInt(current_variants[i].pos)
  //       };
  //       newAA.push(newA)
  //     }
  //   }
  //   return(newAA)
  // }


  createGeneIdeogram(annotations_array) {
    if(annotations_array.length < 1){
      console.log("ooooo")
    }
    const ideogram = new Ideogram({
      organism: 'human',  
      container: '#gene-ideo-container',
      chrWidth: 6,
      chrHeight: 120,
      annotationHeight: 5,
      chrLabelSize: 10,
      rows: 1,
      rotatable: true,
      annotations: annotations_array,
      onWillShowAnnotTooltip: this.decorateGene
    });
    // console.log(ideogram)
  }


  // const annot = {
  //   name: gene.symbol,
  //   chr: genomic_pos.chr,
  //   start: genomic_pos.start,
  //   stop: genomic_pos.end,
  //   id: genomic_pos.ensemblgene,
  //   color: color
  // };


  // config = {
  //   organism: organism,
  //   container: '#ideogram-container',
  //   chrWidth: 8,
  //   chrHeight: 90,
  //   chrLabelSize: 10,
  //   annotationHeight: 5,
  //   showFullyBanded: false,
  //   rotatable: false,
  //   legend: legend,
  //   onWillShowAnnotTooltip: decorateGene
  // }

  // shape = 'triangle'; 

  // legend = [{
  //   name: '<b>Click gene to search</b>',
  //   rows: [
  //     {name: 'Interacting gene', color: 'purple', shape: this.shape},
  //     {name: 'Paralogous gene', color: 'pink', shape: this.shape},
  //     {name: 'Searched gene', color: 'red', shape: this.shape}
  //   ]
  // }];


  decorateGene(annot) {
    // console.log(annot)
    console.log("muah")
    // console.log(Ideogram.taxid)
    // const org = annot.id
    // const term = "(" + annot.name + '}[gene])+AND+(${' + org + '}[orgn])`;
    const url = "https://ncbi.nlm.nih.gov/gene/?term=(" + annot.name + "[gene])+AND+(Homo%20sapiens[orgn])";
    // const description = annot.description
    annot.displayName =
      `<a target="_blank" href="${url}">${annot.name}</a>
      <br/>`;
    return annot
  }

}
