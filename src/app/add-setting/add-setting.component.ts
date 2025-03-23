import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { v4 as uuidv4 } from 'uuid';
import { Clipboard } from '@angular/cdk/clipboard';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-add-setting',
  standalone: true,
  templateUrl: './add-setting.component.html',
  styleUrls: ['./add-setting.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ]
})
export class AddSettingComponent implements OnInit {
  settingForm: FormGroup;
  savedSettings: any[] = [];

  editingId: string | null = null;
  editingForm: FormGroup | null = null;

  transactionTypeOptions = ['one', 'two', 'three', 'four'];
  frequencyOptions = ['weekly', 'monthly', 'annual'];
  indicatorOptions = ['primary', 'secondary'];
  authorizationOptions = ['yes', 'no'];

  constructor(private fb: FormBuilder, private clipboard: Clipboard) {
    this.settingForm = this.fb.group({
      transactionTypes: [[], Validators.required],
      threshold: ['0', [Validators.required, Validators.pattern('^[0-9]+$')]],
      frequency: [[], Validators.required],
      indicator: [[], Validators.required],
      authorization: [[], Validators.required]
    });
  }

  readonly SESSION_KEY = 'savedSettings';

  ngOnInit(): void {
    const stored = sessionStorage.getItem(this.SESSION_KEY);
    if (stored) {
      try {
        this.savedSettings = JSON.parse(stored);
      } catch (e) {
        console.warn('Invalid session data, resetting.');
        this.savedSettings = [];
      }
    }
  }

  showJson = true;
  editingSettingId: string | null = null;

  toggleJson() {
    this.showJson = !this.showJson;
  }

  copyJson() {
    const json = JSON.stringify(this.savedSettings, null, 2);
    this.clipboard.copy(json);
  }

  saveSetting() {
    if (this.settingForm.valid) {
      const newSetting = {
        settingsId: uuidv4(),
        groupId: 12345,
        groupName: 'group',
        dateCreated: Date.now(),
        settingValue: {
          ...this.settingForm.value
        }
      };

      this.savedSettings = [newSetting, ...this.savedSettings];

      this.updateSessionStorage();

      this.settingForm.setValue({
        transactionTypes: [],
        threshold: '0',
        frequency: [],
        indicator: [],
        authorization: []
      });

      this.settingForm.markAsPristine();
      this.settingForm.markAsUntouched();
    } else {
      this.settingForm.markAllAsTouched();
    }
  }

  onThresholdInput(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    const numericValue = input.replace(/[^0-9]/g, '');
    this.settingForm.get('threshold')?.setValue(numericValue);
  }

  deleteSetting(id: string) {
    this.savedSettings = this.savedSettings.filter(s => s.settingsId !== id);
  }

  startEdit(setting: any) {
    this.editingId = setting.settingsId;
    this.editingForm = this.fb.group({
      transactionTypes: [setting.settingValue.transactionTypes],
      threshold: [setting.settingValue.threshold, [Validators.required, Validators.pattern('^[0-9]+$')]],
      frequency: [setting.settingValue.frequency],
      indicator: [setting.settingValue.indicator],
      authorization: [setting.settingValue.authorization]
    });
  }

  cancelEdit() {
    this.editingId = null;
    this.editingForm = null;
  }

  saveEdit(id: string) {
    if (this.editingForm && this.editingForm.valid) {
      const idx = this.savedSettings.findIndex(s => s.settingsId === id);
      if (idx >= 0) {
        this.savedSettings[idx].settingValue = { ...this.editingForm.value };
      }
      this.cancelEdit();
    }
  }

  get sortedSettings() {
    const sorted = [...this.savedSettings].sort((a, b) => a.dateCreated - b.dateCreated);
    return this.sortDescending ? sorted.reverse() : sorted;
  }

  sortDescending = true;

  toggleSortDirection() {
    this.sortDescending = !this.sortDescending;
  }

  createFormWithValues(values: any): FormGroup {
    return this.fb.group({
      transactionTypes: [values.transactionTypes],
      threshold: [values.threshold],
      frequency: [values.frequency],
      indicator: [values.indicator],
      authorization: [values.authorization]
    });
  }

  formatCreatedDate(timestamp: number): string {
    const createdDate = new Date(timestamp);
    const now = new Date();

    const isSameDay =
      createdDate.getFullYear() === now.getFullYear() &&
      createdDate.getMonth() === now.getMonth() &&
      createdDate.getDate() === now.getDate();

    if (isSameDay) {
      return createdDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); // e.g. 3:45 PM
    }

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      createdDate.getFullYear() === yesterday.getFullYear() &&
      createdDate.getMonth() === yesterday.getMonth() &&
      createdDate.getDate() === yesterday.getDate();

    if (isYesterday) {
      return 'Yesterday';
    }

    const diffMs = now.getTime() - createdDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  }

  selectedTransactionType: string | null = null;

  getFilteredAndSortedSettings(): any[] {
    let filtered = [...this.savedSettings];

    if (this.selectedTransactionType) {
      filtered = filtered.filter(setting =>
        setting.settingValue.transactionTypes.includes(this.selectedTransactionType!)
      );
    }

    filtered.sort((a, b) => a.dateCreated - b.dateCreated);
    return this.sortDescending ? filtered.reverse() : filtered;
  }

  private updateSessionStorage() {
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(this.savedSettings));
  }
}
