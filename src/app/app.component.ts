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

  constructor(private http: HttpClient, private elementRef: ElementRef) {
    this.data = this.http.get<DataModel>('./assets/data.json');
    this.http.get('./assets/diabetes.json').subscribe(resp => {
      this.dbdata = resp;
      this.get_result_names(this.dbdata)
      this.searchTerm = 'diabetes';
      // uncomment to reveal more without having to search
      // this.searchResults = true;
    });;
  }
  ngAfterViewInit(){
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#f9f5f6';
    this.elementRef.nativeElement.ownerDocument.body.style.overflow = 'hidden';
 }

 // create annotaiton array for variant array mapping on ideogram 
  newAnnotationArray(current_variants){
    var newAA = []
    for(var i = 0; i < current_variants.length; i++){
      if(parseInt(current_variants[i].chrom) > 0){
        var newA = {
          name: current_variants[i].rsid,
          chr: current_variants[i].chrom,
          start:parseInt(current_variants[i].pos),
          stop:parseInt(current_variants[i].pos),
          color: '#cc1100'
        };
        newAA.push(newA)
      }
    }
    if(newAA.length === 0){
      newAA.push({})
    }
    return(newAA)
  }

// create variant array ideogram (chromosome/variant mapping)
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
  }

  title = 'MyDisease.info Explorer';
  data: Observable<DataModel>;
  dbdata: any;
  result_names = [];
  result_ids = [];
  result_defs = [];
  results_array = [];
  current_disease: any;

  // oranize disease search results
  get_result_names(result_json){
    this.result_names = [];
    this.result_ids = [];
    this.result_defs = [];
    this.results_array = [];
    for(var i = 0; i < result_json.hits.length; i++){
      if(result_json.hits[i].mondo && result_json.hits[i].disgenet){
        if(result_json.hits[i].disgenet.length > 0){
          var new_disgenet = result_json.hits[i].disgenet[0]
          if(result_json.hits[i].disgenet.length > 1){
            for(var j = 1; j < result_json.hits[i].disgenet.length; j++){
              if(result_json.hits[i].disgenet[j].genes_related_to_disease){
                if(result_json.hits[i].disgenet[j].genes_related_to_disease.constructor === Array){
                  if(new_disgenet.genes_related_to_disease){
                    new_disgenet.genes_related_to_disease = new_disgenet.genes_related_to_disease.concat(result_json.hits[i].disgenet[j].genes_related_to_disease)
                  }else{
                    new_disgenet.genes_related_to_disease = result_json.hits[i].disgenet[j].genes_related_to_disease
                  }
                }
                else{
                  if(new_disgenet.genes_related_to_disease){
                    if(new_disgenet.genes_related_to_disease.constructor !== Array){
                      new_disgenet.genes_related_to_disease = [new_disgenet.genes_related_to_disease]
                    }
                    new_disgenet.genes_related_to_disease.push(result_json.hits[i].disgenet[j].genes_related_to_disease)
                  }
                  else{
                    new_disgenet.genes_related_to_disease = [result_json.hits[i].disgenet[j].genes_related_to_disease]
                  }
                }
              }
              if(result_json.hits[i].disgenet[j].variants_related_to_disease){
                if(result_json.hits[i].disgenet[j].variants_related_to_disease.constructor === Array){
                  if(new_disgenet.variants_related_to_disease){
                    new_disgenet.variants_related_to_disease = new_disgenet.variants_related_to_disease.concat(result_json.hits[i].disgenet[j].variants_related_to_disease)
                  }else{
                    new_disgenet.variants_related_to_disease = result_json.hits[i].disgenet[j].variants_related_to_disease
                  }
                }
                else if(typeof(result_json.hits[i].disgenet[j].variants_related_to_disease === "object")){
                  if(new_disgenet.variants_related_to_disease){
                    new_disgenet.variants_related_to_disease.push(result_json.hits[i].disgenet[j].variants_related_to_disease)
                  }
                  else{
                    new_disgenet.variants_related_to_disease = [result_json.hits[i].disgenet[j].variants_related_to_disease]
                  }
                }
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
        this.result_names.push(result_json.hits[i].disgenet.xrefs.disease_name)
        this.result_ids.push(result_json.hits[i]._id)
        this.result_defs.push(result_json.hits[i].mondo.definition)
        this.results_array.push(result_json.hits[i])
      }
    }
  }

  searchTerm = '';
  searchResults = false;
  searchInputValue = '';
  results_returned = false;
  diseaseName:string;




  diseaseSearchMain(name){
    this.searchTerm = name;
    this.elementRef.nativeElement.ownerDocument.body.style.overflow = 'visible';
    this.elementRef.nativeElement.ownerDocument.body.style.transition = 'all 2s ease 0s';
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#fff';
    var api_string = 'http://mydisease.info/v1/query?q=' + this.searchTerm
    if(this.searchTerm.length > 0){
      this.http.get(api_string).subscribe(resp => {
        this.dbdata = resp;
        this.get_result_names(this.dbdata)
        this.searchResults = true;
        this.results_returned = true;
        if(this.dbdata.total === 0){
          this.current_disease = '';
          this.results_returned= false;
        }
      });;
    }else{
      this.current_disease = '';
      this.results_returned= false;
    }
  }

  searchForDisease($event){
    this.diseaseSearchMain($event.target.value)
  }

  searchForDiseaseButton(){
    this.diseaseSearchMain(this.searchInputValue)
  }

  // variants array
  current_variant_array = [];
  // get hit counts (number of results) for each variant and sort by number of hits
  getCurrentVariantArray(id){
    var temp_var_array = this.current_disease.disgenet.variants_related_to_disease
    var new_var_array = []
    if(temp_var_array){
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
      new_var_array = new_var_array.sort((a, b) => (a.count < b.count) ? 1 : -1)
    }
    return(new_var_array)
  }
  
  updatedAnnotations = []
  current_disease_name = '';
  handleRadioChange($event){
    this.NotMappable = '';
    this.currentSearchGene = {};
    this.createGeneIdeogram([{}])
    this.current_disease = this.results_array[parseInt($event.target.value)]
    this.current_disease_name = this.result_names[parseInt($event.target.value)]
    this.current_variant_array = this.getCurrentVariantArray(parseInt($event.target.value))
    this.updatedAnnotations = this.newAnnotationArray(this.current_variant_array)
    this.createIdeogram(this.updatedAnnotations);
  }


  geneAA = [];
  geneJson: any;
  currentSearchGene: any;
  NotMappable = '';
  wikiJson: any;
  IxnGA = [];
  IAgeneJson: any;

  //Gene specific search through mygene and chromosome mapping of gene and its interacting genes
  geneSearch(gene_name){
    this.geneAA = []
    this.NotMappable = '';
    this.IxnGA = [];
    this.NoGeneSelected = false;
   
    var api_string = 'https://mygene.info/v3/query?q=' + gene_name + '&fields=symbol%2Cgenomic_pos%2Cname&species=human&size=1'

    this.http.get(api_string).subscribe(resp => {
        this.geneJson = resp
        if(this.geneJson.hits[0].genomic_pos){
          var myGeneA = {
            name: this.geneJson.hits[0].symbol,
            chr: this.geneJson.hits[0].genomic_pos.chr,
            start: this.geneJson.hits[0].genomic_pos.start,
            stop: this.geneJson.hits[0].genomic_pos.end,
            id: this.geneJson.hits[0].genomic_pos.ensemblgene,
            color: '#cc1100'
          }
          this.currentSearchGene = myGeneA
          this.currentSearchGene.description = this.geneJson.hits[0].name,
          this.geneAA.push(myGeneA)
          var wiki_api = 'https://webservice.wikipathways.org/findInteractions?query='+gene_name+'&format=json'
          
          this.http.get(wiki_api).subscribe(resp2 => {
            this.wikiJson = resp2
            var temp_gene_array = [];
            var results_array = this.wikiJson.result.filter(function(item){
              return item.species = "Homo sapiens"        
            });
            var max_results = 20;
            if(results_array.length < 20){
              max_results = results_array.length
            }
            // put all interactions in array 
            for(var i = 0; i < max_results; i++){
              temp_gene_array = temp_gene_array.concat(results_array[i].fields.left.values)
              temp_gene_array = temp_gene_array.concat(results_array[i].fields.right.values)
            }

            // make sure interaction is with a gene
            var temp2 = temp_gene_array.filter(function(item){
              return item !== gene_name && item !== '' && !item.includes(' ') && !item.includes('/') && item !== item.toLowerCase() && !item.includes('-') && item === item.toUpperCase()
            })

            // remove duplicates
            this.IxnGA = temp2.filter(function(item, pos) {
              return temp2.indexOf(item) == pos;
            })

            for(var j = 0; j < this.IxnGA.length; j++){
              var api_string_ia = 'https://mygene.info/v3/query?q=' + this.IxnGA[j] + '&fields=symbol%2Cgenomic_pos%2Cname&species=human&size=1'

              this.http.get(api_string_ia).toPromise().then(resp3 => {
                this.IAgeneJson  = resp3;
                if(this.IAgeneJson.hits[0]){
                  if(this.IAgeneJson.hits[0].genomic_pos){
                    var IAmyGeneA = {
                      name: this.IAgeneJson.hits[0].symbol,
                      chr: this.IAgeneJson.hits[0].genomic_pos.chr,
                      start: this.IAgeneJson.hits[0].genomic_pos.start,
                      stop: this.IAgeneJson.hits[0].genomic_pos.end,
                      id: this.IAgeneJson.hits[0].genomic_pos.ensemblgene,
                      color: '#ff7e05'
                    }
                    this.geneAA.push(IAmyGeneA)
                  }
                  this.createGeneIdeogram(this.geneAA)
                }
              })
            }
          })

          this.createGeneIdeogram(this.geneAA)
        }
        else{
          this.geneJson = []
          this.NotMappable = gene_name
          this.createGeneIdeogram([{}])
        }
      });;
    }

  
 
  favoriteSeason: string;
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];


  ngOnInit() {

  }

NoGeneSelected = true;
  createGeneIdeogram(annotations_array) {
    if(!(annotations_array[0].name)){
      this.NoGeneSelected = true;
    }else{
      this.NoGeneSelected = false;
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
  }

  decorateGene(annot) {
    const url = "https://ncbi.nlm.nih.gov/gene/?term=(" + annot.name + "[gene])+AND+(Homo%20sapiens[orgn])";
    annot.displayName =
      `<a target="_blank" href="${url}">${annot.name}</a>
      <br/>`;
    return annot
  }

}
