import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-note-grid',
  templateUrl: './note-grid.component.html',
  styleUrls: ['./note-grid.component.scss']
})
export class NoteGridComponent implements OnInit {
  filteredNotes = [];
  filterValue = '';
  filterTag: string;

  constructor(
    public store: StoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params.tag) {
        this.filterTag = params.tag;
        this.search();
      }
    });

    this.store.notes$.subscribe(data => {
      this.search();
    });
  }

  select(id: string): void {
    this.router.navigate(['/edit', id]);
  }

  onSearch(value: string): void {
    this.filterValue = value.toLowerCase();
    this.search();
  }

  search(): void {
    if (this.filterValue.trim() === '' && !this.filterTag) {
      this.filteredNotes = this.store.notes;
      return;
    }

    this.filteredNotes = this.store.notes.filter(note => {
      return (note.title.toLowerCase().includes(this.filterValue)
          || note.content.toLowerCase().includes(this.filterValue))
          && (!this.filterTag || (note.tags && note.tags.includes(this.filterTag)));
    });
  }
}
