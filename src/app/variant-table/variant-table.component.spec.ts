import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantTableComponent } from './variant-table.component';

describe('VariantTableComponent', () => {
  let component: VariantTableComponent;
  let fixture: ComponentFixture<VariantTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariantTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariantTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
