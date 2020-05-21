import { Component, OnInit} from '@angular/core';
import Ideogram from 'ideogram';

@Component({
  selector: 'app-ideogram',
  templateUrl: './ideogram.component.html',
  styleUrls: ['./ideogram.component.css']
})
export class IdeogramComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.createIdeogram();

  }

  createIdeogram() {
    const ideogram = new Ideogram({
      organism: 'human',  
      container: '#ideo-container',
      annotations: [{
        name: 'BRCA1',
        chr: '17',
        start: 43044294,
        stop: 43125482
      }]
    });
    console.log(ideogram)
  }

}
