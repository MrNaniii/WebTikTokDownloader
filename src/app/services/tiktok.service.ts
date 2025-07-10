import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TiktokService {
  constructor(private http: HttpClient) {}

  detectType(url: string): Observable<{ type: string }> {
    return this.http.post<{ type: string }>('/api/tiktok/detect', { url });
  }

  downloadVideo(url: string): Observable<Blob> {
    return this.http.post('/api/tiktok/download/video', { url }, { responseType: 'blob' });
  }

  downloadMusic(url: string): Observable<Blob> {
    return this.http.post('/api/tiktok/download/music', { url }, { responseType: 'blob' });
  }

  downloadPhoto(url: string): Observable<Blob> {
    return this.http.post('/api/tiktok/download/photo', { url }, { responseType: 'blob' });
  }
}
