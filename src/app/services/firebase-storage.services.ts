import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, from } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FirebaseStorageService {
    constructor(private storage: AngularFireStorage) { }

    getDownloadURL(imagePath: string): Observable<string> {
        const ref = this.storage.refFromURL(imagePath);
        return ref.getDownloadURL();
    }

    async getDownloadUrl(url: string): Promise<string> {

        try {
            const downloadUrl = await from(this.storage.refFromURL(url).getDownloadURL()).toPromise();
            return downloadUrl;
        } catch (error) {
            console.error(`Failed to get download URL for ${url}:`, error);
            return ''; // or throw error;
        }

        /* return new Observable<File>(observer => {
            from(this.storage.refFromURL(url).getDownloadURL()).subscribe({
                next: downloadUrl => {
                    fetch(downloadUrl).then(response => {
                        if(!response.ok){
                            throw new Error('Network response was not ok');
                        }
                        return response.blob();
                    }).then(blob => {
                        const file = new File([blob], 'filename', { type: 'image/jpeg' });
                        observer.next(file);
                        observer.complete();
                    })
                },
                error: error => {
                    observer.error(error); // Forward the error to the observer
                    observer.complete(); // Complete the observer even in case of an error
                }
            })
        }) */

        /* return new Observable<File>(observer => {
            from(this.storage.refFromURL(url).getDownloadURL()).subscribe({
                next: downloadURL => {
                    fetch(downloadURL)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.blob();
                        })
                        .then(blob => {
                            const file = new File([blob], 'filename');
                            observer.next(file);
                            observer.complete();
                        })
                        .catch(error => {
                            observer.error(error); // Forward the error to the observer
                            observer.complete(); // Complete the observer even in case of an error
                        });
                },
                error: error => {
                    observer.error(error); // Forward the error to the observer
                    observer.complete(); // Complete the observer even in case of an error
                }
            });
        }); */
    }

    getImageUrl(imagePath: string): Observable<string> {
        return this.storage.refFromURL(imagePath).getDownloadURL();
    }
}
