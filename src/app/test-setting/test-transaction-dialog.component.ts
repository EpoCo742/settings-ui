import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Inject } from '@angular/core';

interface Setting {
  settingsId: string;
  groupId: number;
  groupName: string;
  dateCreated: number;
  settingValue: {
    transactionTypes: string[];
    frequency: string[];
    indicator: string[];
    authorization: string[];
    threshold: number;
  };
}

@Component({
  selector: 'app-test-transaction-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './test-transaction-dialog.component.html',
  styleUrls: ['./test-transaction-dialog.component.scss']
})
export class TestTransactionDialogComponent {
  form: FormGroup;

  transactionTypeOptions = ['one', 'two', 'three', 'four'];
  frequencyOptions = ['weekly', 'monthly', 'annual'];
  indicatorOptions = ['primary', 'secondary'];
  authorizationOptions = ['yes', 'no'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TestTransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      amount: ['0', [Validators.required, Validators.pattern('^[0-9]+$')]],
      transactionTypes: [[], Validators.required],
      frequency: [[], Validators.required],
      indicator: [[], Validators.required],
      authorization: [[], Validators.required]
    });
    this.savedSettings = (data.settings || []).sort(
      (a: Setting, b: Setting) => a.dateCreated - b.dateCreated
    );
  }

  savedSettings: Setting[] = [];

  close() {
    this.dialogRef.close();
  }

  testTransaction() {
    if (this.form.valid) {
      const tx = this.form.value;
      console.log('Transaction to test:', tx);
      // Future: Call test logic here
    } else {
      this.form.markAllAsTouched();
    }
  }

  onAmountInput(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    const numericOnly = input.replace(/[^0-9]/g, '');
    this.form.get('amount')?.setValue(numericOnly);
  }
  
}
