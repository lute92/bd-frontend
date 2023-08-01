import { Component } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import * as XLSX from 'xlsx'; // Add this import statement
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-import',
  templateUrl: './product-import.component.html',
  styleUrls: ['./product-import.component.css']
})
export class ProductImportComponent {
  uploader!: FileUploader;
  excelData: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.uploader = new FileUploader({ url: 'http://localhost:4900/products/import', itemAlias: 'excelFile' });
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('File uploaded successfully', item, status, response);
    };
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const arrayBuffer: any = fileReader.result;
        const data = new Uint8Array(arrayBuffer);
        const arr = new Array();
        for (let i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        const bstr = arr.join("");
        const workbook = XLSX.read(bstr, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        this.excelData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      };
      fileReader.readAsArrayBuffer(file);
    }
  }

  uploadFile() {
    if (this.excelData.length > 0) {
     
      this.http.post<any>('http://localhost:4900/products/import', this.excelData).subscribe(
        (response) => {
          console.log('Data sent successfully', response);
        },
        (error) => {
          console.error('Error sending data', error);
        }
      );
    }
  }
}
