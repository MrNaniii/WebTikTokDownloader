import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-download-media',
  imports: [CommonModule],
  templateUrl: './download-media.html',
  styleUrl: './download-media.scss'
})
export class DownloadMedia {
  @Input() disabled = false;
  @Input() text = 'Download media';
  @Output() click = new EventEmitter<void>();
}
