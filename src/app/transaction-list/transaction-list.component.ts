import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface TransactionSetting {
  enabled: boolean;
  minimum: number;
  indicator: 'one' | 'two' | 'all';
  frequency: 'select' | 'weekly' | 'monthly' | 'annual';
  authorized: 'all' |'yes' | 'no';
  isEditing?: boolean;
}

interface Transaction {
  transactionType: string;
  settings: TransactionSetting[];
}

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class TransactionListComponent {
  transactions: Transaction[] = [
    { transactionType: 'Transaction A', settings: [] },
    { transactionType: 'Transaction B', settings: [] },
    { transactionType: 'Transaction C', settings: [] },
    { transactionType: 'Transaction D', settings: [] }
  ];

  savedTransactions: Transaction[] = this.cleanTransactions(this.transactions); // ✅ Ensures JSON preview is initialized

  indicatorOptions = ['all', 'one', 'two'];
  frequencyOptions = ['select', 'weekly', 'monthly', 'annual'];
  authorizedOptions = ['all', 'yes', 'no'];  

  addSetting(transaction: Transaction) {
    transaction.settings.push({
      enabled: true,  // ✅ Default checked
      minimum: 0,  // ✅ User must update to non-zero
      indicator: 'all',  // ✅ Default to "All"
      frequency: 'select', // ✅ Default to invalid selection (forces user to choose)
      authorized: 'all',  // ✅ Default to "All"
      isEditing: true
    });
  }

  editSetting(setting: TransactionSetting) {
    setting.isEditing = true;
  }

  saveSetting(transaction: Transaction) {
    const settingBeingSaved = transaction.settings.find(setting => setting.isEditing);
    if (!settingBeingSaved) return;
  
    // ✅ Enforce minimum must be greater than zero
    if (settingBeingSaved.minimum <= 0) {
      alert("Error: Minimum must be greater than zero.");
      return;
    }
  
    // ✅ Enforce frequency selection (cannot be default "Select Frequency")
    if (settingBeingSaved.frequency === "select") {
      alert("Error: Please select a valid Frequency.");
      return;
    }
  
    // ✅ Check for duplicates (Indicator + Frequency + Authorized)
    const isDuplicate = transaction.settings.some(
      setting => !setting.isEditing && 
                 setting.indicator === settingBeingSaved.indicator &&
                 setting.frequency === settingBeingSaved.frequency &&
                 setting.authorized === settingBeingSaved.authorized
    );
  
    if (isDuplicate) {
      alert("Error: A setting with the same Indicator, Frequency, and Authorized already exists.");
      return;
    }
  
    // ✅ If all validations pass, allow save
    settingBeingSaved.isEditing = false;
    this.savedTransactions = this.cleanTransactions(this.transactions); // ✅ Update JSON preview
  }
  

  deleteSetting(transaction: Transaction, setting: TransactionSetting) {
    transaction.settings = transaction.settings.filter(s => s !== setting);
    this.savedTransactions = this.cleanTransactions(this.transactions); // ✅ Update JSON preview after delete
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      minimumFractionDigits: 0 
    }).replace(/\$/g, ''); 
  }

  onMinimumChange(setting: TransactionSetting, event: Event) {
    const input = (event.target as HTMLInputElement).value.replace(/[^0-9]/g, '');
    setting.minimum = parseInt(input, 10) || 0;
    (event.target as HTMLInputElement).value = this.formatCurrency(setting.minimum);
  }

  private cleanTransactions(transactions: Transaction[]): Transaction[] {
    return transactions.map(transaction => ({
      transactionType: transaction.transactionType, // ✅ Ensure transaction type is kept
      settings: transaction.settings.map(({ isEditing, ...setting }) => setting) // ✅ Removes isEditing only
    }));
  }
}
