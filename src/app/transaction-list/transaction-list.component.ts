import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule for ngModel
import { CommonModule } from '@angular/common'; // ✅ Import CommonModule for *ngFor

// Define the Transaction interface
interface Transaction {
  transactionType: string;
  transactionSettings: {
    minimum: number;
    enabled: boolean;
    indicator: 'one' | 'two' | 'all';
  };
  isEditing?: boolean;
}

@Component({
  selector: 'app-transaction-list',
  standalone: true, // ✅ Ensure this is a standalone component
  templateUrl: './transaction-list.component.html', // Reference external template
  styleUrls: ['./transaction-list.component.scss'], // Reference external styles
  imports: [FormsModule, CommonModule] // ✅ Add FormsModule and CommonModule to imports
})
export class TransactionListComponent {
  transactions: Transaction[] = [
    { transactionType: 'Transaction A', transactionSettings: { minimum: 0, enabled: true, indicator: 'one' }, isEditing: false },
    { transactionType: 'Transaction B', transactionSettings: { minimum: 0, enabled: true, indicator: 'one' }, isEditing: false },
    { transactionType: 'Transaction C', transactionSettings: { minimum: 0, enabled: true, indicator: 'one' }, isEditing: false },
    { transactionType: 'Transaction D', transactionSettings: { minimum: 0, enabled: true, indicator: 'one' }, isEditing: false }
  ];

  savedTransactions: Omit<Transaction, 'isEditing'>[] = this.cleanTransactions(this.transactions);

  indicatorOptions = ['one', 'two', 'all'];

  editTransaction(transaction: Transaction) {
    transaction.isEditing = true;
  }

  saveTransaction(transaction: Transaction) {
    transaction.isEditing = false;
    this.savedTransactions = this.cleanTransactions(this.transactions);
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace(/\.00$/, '');
  }

  onMinimumChange(transaction: Transaction, event: Event) {
    const input = (event.target as HTMLInputElement).value.replace(/[^0-9]/g, '');
    transaction.transactionSettings.minimum = parseInt(input, 10) || 0;
  }

  private cleanTransactions(transactions: Transaction[]): Omit<Transaction, 'isEditing'>[] {
    return transactions.map(({ isEditing, ...rest }) => rest);
  }
}
