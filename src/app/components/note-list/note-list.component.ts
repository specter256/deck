import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Note } from 'src/app/models/note';
import { StoreService } from './../../services/store.service';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent implements OnInit {
  filteredNotes = [];
  filterValue = '';

  @Input() selectedId: string;
  @Output() selectNote = new EventEmitter();

  constructor(
    public store: StoreService
  ) { }

  ngOnInit(): void {
    this.store.notes$.pipe(debounceTime(50)).subscribe(data => {
      this.onSearch(this.filterValue);
    });
  }

  onSelect(note: Note): void {
    this.selectNote.emit(note.id);
  }

  onSearch(value: string): void {
    this.filterValue = value.toLowerCase();
    this.search();
  }

  search(): void {
    const notes = this.store.notes.filter(i => i.deleted !== true );

    if (this.filterValue.trim() === '') {
      this.filteredNotes = notes;
      return;
    }

    this.filteredNotes = notes.filter(note => {
      return note.title.toLowerCase().includes(this.filterValue)
          || note.content.toLowerCase().includes(this.filterValue);
    });
  }
}
