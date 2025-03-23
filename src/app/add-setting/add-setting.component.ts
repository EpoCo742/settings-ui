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
export class AddSettingComponent  {
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
    return [...this.savedSettings].sort((a, b) => b.dateCreated - a.dateCreated);
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
}
