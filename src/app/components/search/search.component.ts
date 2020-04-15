import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Output() search = new EventEmitter();

  constructor(
    public store: StoreService
  ) { }

  ngOnInit(): void {
  }

  onSearch(value: string): void {
    this.search.emit(value);
  }
}
