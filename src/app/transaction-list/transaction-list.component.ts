import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface TransactionSetting {
  enabled: boolean;
  minimum: number;
  indicator: 'one' | 'two' | 'all';
  frequency: 'all' | 'one time' | 'recurring';
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
  imports: [FormsModule, CommonModule, MatIconModule]
})
export class TransactionListComponent {
  transactions: Transaction[] = [
    { transactionType: 'Transaction A', settings: [] },
    { transactionType: 'Transaction B', settings: [] },
    { transactionType: 'Transaction C', settings: [] },
    { transactionType: 'Transaction D', settings: [] }
  ];

  savedTransactions: Transaction[] = this.cleanTransactions(this.transactions); 

  indicatorOptions = ['all', 'one', 'two'];
  frequencyOptions = ['all', 'one time', 'recurring'];
  authorizedOptions = ['all', 'yes', 'no'];  

  addSetting(transaction: Transaction) {
    transaction.settings.push({
      enabled: true,  
      minimum: 0,  
      indicator: 'all', 
      frequency: 'all', 
      authorized: 'all',  
      isEditing: true
    });
  }

  editSetting(setting: TransactionSetting) {
    setting.isEditing = true;
  }

  saveSetting(transaction: Transaction) {
    const settingBeingSaved = transaction.settings.find(setting => setting.isEditing);
    if (!settingBeingSaved) return;
    
    const isDuplicate = transaction.settings.some(existingSetting => {
      if (!existingSetting.isEditing) {
        return (
          (existingSetting.indicator === settingBeingSaved.indicator || 
           existingSetting.indicator === 'all' || 
           settingBeingSaved.indicator === 'all') &&
  
          (existingSetting.frequency === settingBeingSaved.frequency || 
           existingSetting.frequency === 'all' || 
           settingBeingSaved.frequency === 'all') &&
  
          (existingSetting.authorized === settingBeingSaved.authorized || 
           existingSetting.authorized === 'all' || 
           settingBeingSaved.authorized === 'all')
        );
      }
      return false;
    });
  
    if (isDuplicate) {
      alert("Error: A conflicting setting already exists for this transaction.");
      return; // ✅ Prevent saving duplicate entry
    }
  
    settingBeingSaved.isEditing = false;
    this.savedTransactions = this.cleanTransactions(this.transactions);
  }

  
  

  deleteSetting(transaction: Transaction, setting: TransactionSetting) {
    transaction.settings = transaction.settings.filter(s => s !== setting);
    this.savedTransactions = this.cleanTransactions(this.transactions); // ✅ Update JSON preview after delete
  }

  formatCurrency(value: number): string {
    return `$` + value.toLocaleString('en-US', { 
      style: 'decimal', 
      minimumFractionDigits: 0 
    });
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
