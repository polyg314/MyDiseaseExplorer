import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from "@angular/material/input"
import { MatPaginatorModule } from "@angular/material/paginator"
import { MatProgressSpinnerModule} from "@angular/material/progress-spinner"
import { MatSortModule } from "@angular/material/sort"
import { MatTableModule } from "@angular/material/table"

import { VariantTableComponent } from './variant-table.component';

@NgModule({
  imports: [BrowserModule, CommonModule, FormsModule, NgbModule,MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule],
  declarations: [VariantTableComponent],
  exports: [VariantTableComponent],
  bootstrap: [VariantTableComponent]
})
export class VariantTableComponentModule {}
