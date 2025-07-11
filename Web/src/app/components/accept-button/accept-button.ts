import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-accept-button',
  templateUrl: './accept-button.html',
  styleUrl: './accept-button.scss'
})
export class AcceptButton {
  @Input() text: string = 'Download';  
}
