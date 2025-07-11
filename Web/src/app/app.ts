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

  url = '';
  contentType: string | null = null;
  showDownloads = false;
  loadingText: string | null = null;

  mainButtonVisible = true;
  mediaDownloadInProgress = false;
  musicDownloadInProgress = false;

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

    if (!this.url) {
      this.mainButtonVisible = true;
    }

    this.cdr.detectChanges();
  }

  onAcceptClick() {
    if (!this.url) return;

    this.mainButtonVisible = false;
    this.loadingText = 'Downloading...';
    this.showDownloads = false;
    this.contentType = null;

    this.tiktokService.detectType(this.url).subscribe({
      next: res => {
        this.contentType = res.type;

        setTimeout(() => {
          this.loadingText = null;
          this.showDownloads = true;
          this.cdr.detectChanges();
        }, 1000);
      },
      error: () => {
        this.url = '';
        this.loadingText = null;
        this.mainButtonVisible = true;
        this.showDownloads = false;
        this.contentType = null;
        this.cdr.detectChanges();
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
    if (this.mediaDownloadInProgress) return; 

    this.mediaDownloadInProgress = true;

    const onComplete = () => {
      setTimeout(() => {
        this.mediaDownloadInProgress = false;
        this.cdr.detectChanges();
      }, 3000);
    };

    if (this.contentType === 'video') {
      this.tiktokService.downloadVideo(this.url).subscribe({
        next: blob => {
          this.downloadFile(blob, 'video.mp4');
          onComplete();
        },
        error: () => {
          alert('Error video downloads');
          onComplete();
        }
      });
    } else if (this.contentType === 'photo') {
      this.tiktokService.downloadPhoto(this.url).subscribe({
        next: blob => {
          this.downloadFile(blob, 'photos.zip');
          onComplete();
        },
        error: () => {
          alert('Error photo downloads.');
          onComplete();
        }
      });
    }
  }

  downloadMusic() {
    if (this.musicDownloadInProgress) return; 

    this.musicDownloadInProgress = true;

    this.tiktokService.downloadMusic(this.url).subscribe({
      next: blob => {
        this.downloadFile(blob, 'music.mp3');
        setTimeout(() => {
          this.musicDownloadInProgress = false;
          this.cdr.detectChanges();
        }, 3000);
      },
      error: () => {
        alert('Error music downloads.');
        setTimeout(() => {
          this.musicDownloadInProgress = false;
          this.cdr.detectChanges();
        }, 3000);
      }
    });
  }
}
