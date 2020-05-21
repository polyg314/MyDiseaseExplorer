import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { VariantTableComponent } from './variant-table.component';

@NgModule({
  imports: [BrowserModule, CommonModule, FormsModule, NgbModule],
  declarations: [VariantTableComponent],
  exports: [VariantTableComponent],
  bootstrap: [VariantTableComponent]
})
export class VariantTableComponentModule {}
