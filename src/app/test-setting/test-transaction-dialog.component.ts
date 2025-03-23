import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Inject } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatIconModule,
    MatTooltipModule
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
      amount: ['0', [
        Validators.required,
        Validators.pattern('^[1-9][0-9]*$'),
        Validators.min(1)
      ]],
      transactionTypes: ['', Validators.required],
      frequency: ['', Validators.required],
      indicator: ['', Validators.required],
      authorization: ['', Validators.required]
    });

    this.savedSettings = (data.settings || []).sort(
      (a: Setting, b: Setting) => a.dateCreated - b.dateCreated
    );
  }

  savedSettings: Setting[] = [];

  close() {
    this.dialogRef.close();
  }

  matchFound = false;
  submitted = false;
  matchedRuleId: string | null = null;
  ruleStatuses: Record<string, 'matched' | 'notMatched' | 'skipped'> = {};

  testTransaction() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitted = true;
    const tx = this.form.value;

    // If no settings exist, consider this a match
    if (!this.savedSettings.length) {
      this.matchFound = true;
      return;
    }

    this.ruleStatuses = {};

    if (!this.savedSettings.length) {
      this.matchFound = true;
      return;
    }
    
    for (const setting of this.savedSettings) {
      const value = setting.settingValue;
      const settingId = setting.settingsId;
    
      const dropdownMatch =
        value.transactionTypes.includes(tx.transactionTypes) &&
        value.frequency.includes(tx.frequency) &&
        value.indicator.includes(tx.indicator) &&
        value.authorization.includes(tx.authorization);
    
      const amountMatch =
        value.threshold === 0 || Number(tx.amount) >= value.threshold;
    
      if (dropdownMatch && amountMatch) {
        this.matchFound = true;
        this.matchedRuleId = settingId;
        this.ruleStatuses[settingId] = 'matched';
    
        // mark all remaining rules as skipped
        const matchedIndex = this.savedSettings.findIndex(s => s.settingsId === settingId);
        for (let i = matchedIndex + 1; i < this.savedSettings.length; i++) {
          this.ruleStatuses[this.savedSettings[i].settingsId] = 'skipped';
        }
    
        return;
      } else {
        this.ruleStatuses[settingId] = 'notMatched';
      }
    }
    
    this.matchFound = false;
  }

  onAmountInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const numericValue = input.value.replace(/\D/g, '');
    const amount = numericValue ? Number(numericValue) : null;

    const control = this.form.get('amount');
    control?.setValue(amount);
    control?.markAsDirty();
  }

  onAmountBlur(): void {
    const control = this.form.get('amount');
    control?.markAsTouched();
  }


  formatCurrency(value: string): string {
    if (!value) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(Number(value));
  }

  resetTest() {
    this.matchFound = false;
    this.submitted = false;
    this.matchedRuleId = null;
    this.ruleStatuses = {};
  }

  getStatusTooltip(settingId: string): string {
    const status = this.ruleStatuses[settingId];
    switch (status) {
      case 'matched': return 'This rule matched the test transaction';
      case 'notMatched': return 'This rule was evaluated and did not match';
      case 'skipped': return 'This rule was not evaluated';
      default: return 'This rule has not been tested yet';
    }
  }
}

