import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {
  constructor(private storage: AngularFireStorage) { }

  getFile(url: string): Observable<File> {
    return new Observable<File>(observer => {
      this.storage.storage.refFromURL(url).getDownloadURL()
        .then(downloadURL => {
          fetch(downloadURL)
            .then(response => response.blob())
            .then(blob => {
              const file = new File([blob], 'filename');
              observer.next(file);
              observer.complete();
            })
            .catch(error => observer.error(error));
        })
        .catch(error => observer.error(error));
    });
  }
}
