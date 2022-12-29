import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'maps';
  section: 'maps' | 'lists' = 'maps';

  setSection(section: 'maps' | 'lists') {
    this.section = section;
  }
}
