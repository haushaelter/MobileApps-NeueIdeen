import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-rezept',
  templateUrl: './list-rezept.component.html',
  styleUrls: ['./list-rezept.component.scss'],
})
export class ListRezeptComponent implements OnInit {
  @Input() rezept: String[];

  constructor() { }

  ngOnInit() {}

}
