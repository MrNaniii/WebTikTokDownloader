import { Component, HostListener, ChangeDetectorRef } from '@angular/core';
import { HeaderText } from './components/header-text/header-text';
import { AcceptButton } from './components/accept-button/accept-button';
import { InputArea } from './components/input-area/input-area';
import { DownloadMedia } from './components/download-media/download-media';
import { DownloadMusic } from './components/download-music/download-music';
import { TiktokService } from './services/tiktok.service';
import { CommonModule } from '@angular/common';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderText, AcceptButton, InputArea, DownloadMusic, DownloadMedia],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected title = 'WebTikTokDownloader';

  showDownloads = false;
  url = '';
  contentType: string | null = null;
    buttonsDisabled = false;

  private tiktokUrlRegex = /https?:\/\/(vm|vt|www)\.tiktok\.com\/\S+/i;

  constructor(
    private tiktokService: TiktokService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  onUrlUpdate(newUrl: string) {
    this.url = newUrl.trim();
    this.showDownloads = false;
    this.contentType = null;
    this.buttonsDisabled = true;
    setTimeout(() => {
      this.buttonsDisabled = false;
      this.cdr.detectChanges(); 
    }, 3000);
  }

  onAcceptClick() {
    if (!this.url) return;

    this.showDownloads = true;
    this.contentType = null;
    this.buttonsDisabled = true; 
    setTimeout(() => {
      this.buttonsDisabled = false;
      this.cdr.detectChanges();
    }, 3000);

    this.tiktokService.detectType(this.url).subscribe({
      next: res => {
        this.contentType = res.type;
      },
      error: () => {
        this.contentType = null;
        alert('Invalid link.');
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.url) {
      this.onAcceptClick();
    }
  }

  private downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

   downloadMedia() {
    if (this.buttonsDisabled) return; 

    this.buttonsDisabled = true; 
    setTimeout(() => {
      this.buttonsDisabled = false;
      this.cdr.detectChanges();
    }, 3000);

    if (this.contentType === 'video') {
      this.tiktokService.downloadVideo(this.url).subscribe({
        next: blob => {
          this.downloadFile(blob, 'video.mp4');
        },
        error: () => {
          alert('Error video downloading.');
        }
      });
    } else if (this.contentType === 'photo') {
      this.tiktokService.downloadPhoto(this.url).subscribe({
        next: blob => {
          this.downloadFile(blob, 'photos.zip');
        },
        error: () => {
          alert('Error photo downloading.');
        }
      });
    } else {
      alert('Unsupported content type for download.');
    }
  }

  downloadMusic() {
    if (this.buttonsDisabled) return;

    this.buttonsDisabled = true;
    setTimeout(() => {
      this.buttonsDisabled = false;
      this.cdr.detectChanges();
    }, 3000);

    this.tiktokService.downloadMusic(this.url).subscribe({
      next: blob => {
        this.downloadFile(blob, 'music.mp3');
      },
      error: () => {
        alert('Error music downloading.');
      }
    });
  }
}
