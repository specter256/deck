import { Component, Input, OnInit } from '@angular/core';
import { Note } from 'src/app/models/note';
import * as utils from 'src/app/shared/utils';
import { StoreService } from './../../services/store.service';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements OnInit {
  @Input() data: Note;

  utils = utils;
  isDelConfirm = false;

  constructor(
    private store: StoreService,
  ) { }

  ngOnInit(): void {
  }

  moveToTrash(event: MouseEvent): void {
    if (this.isDelConfirm)
      this.store.moveNoteToTrash(this.data.id);

    this.isDelConfirm = !this.isDelConfirm;

    if (this.isDelConfirm) {
      setTimeout(() => {
        this.isDelConfirm = false;
      }, 1500);
    }
  }

  delForever(event: MouseEvent): void {
    if (confirm('Are you sure?')) {
      this.store.delNote(this.data.id);
    }
  }

  undoDelete(event: MouseEvent): void {
    this.store.updNote({
      id: this.data.id,
      deleted: false
    });
  }

  onDblClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
