import { Component } from '@angular/core';
import html2canvas from 'html2canvas';
import { from } from 'rxjs';
import { concatMap } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = 'Angular';

  ngOnInit() {}

  array = [0, 1, 2];

  // just using `let`
  public toCanvas() {
    this.array.forEach((key, index) => {
      let elem = document.getElementById(index.toString());
      html2canvas(elem).then(function (canvas) {
        let generatedImage = canvas
          .toDataURL('image/png')
          .replace('image/png', 'image/octet-stream');
        let a = document.createElement('a');
        a.href = generatedImage;
        a.download = `${index}.png`;
        a.click();
      });
    });
  }

  public downloadDivs() {
    from(this.array)
      .pipe(
        concatMap((arrayElem) => {
          let docElem = document.getElementById(arrayElem.toString());
          return from(
            html2canvas(docElem).then(function (canvas) {
              let generatedImage = canvas
                .toDataURL('image/png')
                .replace('image/png', 'image/octet-stream');
              let a = document.createElement('a');
              a.href = generatedImage;
              a.download = `${arrayElem}.png`;
              a.click();
              return `${arrayElem}.png`;
            })
          );
        })
      )
      .subscribe((images) => {
        console.log('Image downloaded', images);
      });
  }

  public trivialDownload() {
    console.log('Downloading image one by one, without a loop');
    this._download(0, this.array);
  }

  // this method will keep calling itself until all the elements of the array are scanned
  private _download(index, array) {
    if (index >= array.length) {
      console.log('Done!');
    } else {
      let docElem = document.getElementById(array[index].toString());
      html2canvas(docElem).then((canvas) => {
        let generatedImage = canvas
          .toDataURL('image/png')
          .replace('image/png', 'image/octet-stream');
        let a = document.createElement('a');
        a.href = generatedImage;
        a.download = `${array[index]}.png`;
        a.click();
        // at this point, image has been downloaded, then call the next download.
        this._download(index + 1, array);
      });
    }
  }
}
