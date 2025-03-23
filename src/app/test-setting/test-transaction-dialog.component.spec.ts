import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTransactionDialogComponent } from './test-transaction-dialog.component';

describe('TestTransactionDialogComponent', () => {
  let component: TestTransactionDialogComponent;
  let fixture: ComponentFixture<TestTransactionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestTransactionDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestTransactionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
