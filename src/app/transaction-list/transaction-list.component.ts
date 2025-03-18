import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface TransactionSetting {
  enabled: boolean;
  minimum: number;
  indicator: 'one' | 'two' | 'all';
  frequency: 'weekly' | 'monthly' | 'annual';
  authorized: 'yes' | 'no';
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

  indicatorOptions = ['one', 'two', 'all'];
  frequencyOptions = ['weekly', 'monthly', 'annual'];
  authorizedOptions = ['yes', 'no'];

  addSetting(transaction: Transaction) {
    transaction.settings.push({
      enabled: true, // ✅ Defaults to checked
      minimum: 0,
      indicator: 'one',
      frequency: 'weekly',
      authorized: 'yes',
      isEditing: true
    });
  }

  editSetting(setting: TransactionSetting) {
    setting.isEditing = true;
  }

  saveSetting(transaction: Transaction) {
    const settingBeingSaved = transaction.settings.find(setting => setting.isEditing);
    if (!settingBeingSaved) return;
  
    // Generate the compound key for the setting being saved
    const newKey = `${settingBeingSaved.indicator}-${settingBeingSaved.frequency}-${settingBeingSaved.authorized}`;
  
    // Check if another setting (excluding itself) already has the same key
    const isDuplicate = transaction.settings.some(
      setting => !setting.isEditing && 
                 setting.indicator === settingBeingSaved.indicator &&
                 setting.frequency === settingBeingSaved.frequency &&
                 setting.authorized === settingBeingSaved.authorized
    );
  
    if (isDuplicate) {
      alert("Error: A setting with the same Indicator, Frequency, and Authorized already exists.");
      return; // ✅ Prevent saving duplicate entry
    }
  
    // If it's unique, proceed with saving
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
