import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TransactionListComponent } from './transaction-list/transaction-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TransactionListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'settings-poc';
}
