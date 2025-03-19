import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'; // ✅ Ensure MatIconModule is included

interface TransactionSetting {
  enabled: boolean;
  minimum: number;
  indicator: 'one' | 'two' | 'all';
  frequency: 'weekly' | 'monthly' | 'annual' | 'all';
  authorized: 'yes' | 'no' | 'all';
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
  imports: [FormsModule, CommonModule, MatIconModule] // ✅ Ensure MatIconModule is imported
})
export class TransactionListComponent {
  transactions: Transaction[] = [
    { transactionType: 'Transaction A', settings: [] },
    { transactionType: 'Transaction B', settings: [] },
    { transactionType: 'Transaction C', settings: [] },
    { transactionType: 'Transaction D', settings: [] }
  ];

  savedTransactions: Transaction[] = this.cleanTransactions(this.transactions);
  indicatorOptions = ['one', 'two', 'all'];
  frequencyOptions = ['weekly', 'monthly', 'annual', 'all'];
  authorizedOptions = ['yes', 'no', 'all'];

  selectedTransactions: string[] = []; // Stores selected transactions for multi-rule application
  multiRule: TransactionSetting = {
    enabled: true,
    minimum: 0,
    indicator: 'all',
    frequency: 'all',
    authorized: 'all',
    isEditing: true
  };

  dropdownOpen: boolean = false;

  constructor() {
    // ✅ Load saved transactions from sessionStorage on page load
    const savedData = sessionStorage.getItem('savedTransactions');
    if (savedData) {
      this.transactions = JSON.parse(savedData);
      this.savedTransactions = this.cleanTransactions(this.transactions);
    }

    document.addEventListener('click', (event) => this.handleOutsideClick(event));
  }

  addSetting(transaction: Transaction) {
    transaction.settings.push({
      enabled: true,
      minimum: 0,
      indicator: 'one',
      frequency: 'all',
      authorized: 'all',
      isEditing: true
    });
  }

  addMultiRule() {
    this.selectedTransactions.forEach(transactionType => {
      const transaction = this.transactions.find(t => t.transactionType === transactionType);
      if (transaction) {
        // ✅ Prevent duplicate rules per transaction
        const isDuplicate = transaction.settings.some(existingSetting => 
          (existingSetting.indicator === this.multiRule.indicator || 
          existingSetting.indicator === 'all' || 
          this.multiRule.indicator === 'all') &&

          (existingSetting.frequency === this.multiRule.frequency || 
          existingSetting.frequency === 'all' || 
          this.multiRule.frequency === 'all') &&

          (existingSetting.authorized === this.multiRule.authorized || 
          existingSetting.authorized === 'all' || 
          this.multiRule.authorized === 'all')
        );

        if (!isDuplicate) {
          transaction.settings.push({ ...this.multiRule, isEditing: false });
        }
      }
    });

    this.savedTransactions = this.cleanTransactions(this.transactions);
    sessionStorage.setItem('savedTransactions', JSON.stringify(this.savedTransactions));

     // ✅ Clear selected transactions
 this.selectedTransactions = [];

 // ✅ Reset multiRule settings
 this.multiRule = {
   enabled: true,
   minimum: 0,
   indicator: 'all',
   frequency: 'all',
   authorized: 'all',
   isEditing: true
 };

 // ✅ Close the dropdown after applying the rule
 this.dropdownOpen = false;
  }

  editSetting(setting: TransactionSetting) {
    setting.isEditing = true;
  }

  saveSetting(transaction: Transaction) {
    transaction.settings.forEach(setting => setting.isEditing = false);
    this.savedTransactions = this.cleanTransactions(this.transactions);
    sessionStorage.setItem('savedTransactions', JSON.stringify(this.savedTransactions));
  }

  deleteSetting(transaction: Transaction, setting: TransactionSetting) {
    transaction.settings = transaction.settings.filter(s => s !== setting);
    this.savedTransactions = this.cleanTransactions(this.transactions);
    sessionStorage.setItem('savedTransactions', JSON.stringify(this.savedTransactions));
  }

  formatCurrency(value: number): string {
    return `$` + value.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 0 });
  }

  onMinimumChange(setting: TransactionSetting, event: Event) {
    const input = (event.target as HTMLInputElement).value.replace(/[^0-9]/g, '');
    setting.minimum = parseInt(input, 10) || 0;
    (event.target as HTMLInputElement).value = this.formatCurrency(setting.minimum);
  }

  private cleanTransactions(transactions: Transaction[]): Transaction[] {
    return transactions.map(transaction => ({
      transactionType: transaction.transactionType,
      settings: transaction.settings.map(({ isEditing, ...setting }) => setting)
    }));
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
   }
   
   selectTransaction(transactionType: string) {
    if (this.selectedTransactions.includes(transactionType)) {
      this.selectedTransactions = this.selectedTransactions.filter(t => t !== transactionType);
    } else {
      this.selectedTransactions.push(transactionType);
    }
   }
   
   isSelected(transactionType: string): boolean {
    return this.selectedTransactions.includes(transactionType);
   }

   handleOutsideClick(event: Event) {
    const dropdownElement = document.querySelector('.dropdown');
    if (this.dropdownOpen && dropdownElement && !dropdownElement.contains(event.target as Node)) {
      this.dropdownOpen = false;
    }
  }
}
