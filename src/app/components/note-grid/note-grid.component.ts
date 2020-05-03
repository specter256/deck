import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
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
  isTrash = false;

  constructor(
    public store: StoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (
        this.activatedRoute.snapshot.url.length
        && this.activatedRoute.snapshot.url[0].path === 'trash'
      ) {
        this.isTrash = true;
      }

      if (params.tag) {
        this.filterTag = params.tag;
        this.search();
      }
    });

    this.store.notes$.pipe(debounceTime(50)).subscribe(data => {
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
    const notes = this.store.notes.filter(i => {
      if (this.isTrash) {
        return i.deleted === true;
      }

      return i.deleted !== true;
    });

    if (this.filterValue.trim() === '' && !this.filterTag) {
      this.filteredNotes = notes;
      return;
    }

    this.filteredNotes = notes.filter(note => {
      return (note.title.toLowerCase().includes(this.filterValue)
          || note.content.toLowerCase().includes(this.filterValue))
          && (!this.filterTag || (note.tags && note.tags.includes(this.filterTag)));
    });
  }
}
