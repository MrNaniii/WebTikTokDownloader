import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-download-music',
  imports: [CommonModule],
  templateUrl: './download-music.html',
  styleUrl: './download-music.scss'
})
export class DownloadMusic {
  @Input() disabled = false;
  @Input() text = 'Download music';
  @Output() click = new EventEmitter<void>();
}
