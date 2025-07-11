import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-area',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-area.html',
  styleUrl: './input-area.scss'
})
export class InputArea {
  @Input() disabled = false;
  @Input() text = 'Download';
  @Output() click = new EventEmitter<void>();
  inputText = '';
  showCross = false;

  @Output() urlChange = new EventEmitter<string>();
  @Output() enterPressed = new EventEmitter<void>();

  onInputChange() {
    this.showCross = this.inputText.length > 0;
    this.urlChange.emit(this.inputText);
  }

  onClear() {
    this.inputText = '';
    this.showCross = false;
    this.urlChange.emit(this.inputText);
  }

  onEnter() {
    this.enterPressed.emit();
  }
}