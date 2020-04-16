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

  delNote(event: MouseEvent): void {
    if (this.isDelConfirm && confirm('Are you sure?'))
      this.store.delNote(this.data.id);

    this.isDelConfirm = !this.isDelConfirm;

    if (this.isDelConfirm) {
      setTimeout(() => {
        this.isDelConfirm = false;
      }, 1500);
    }
  }

  onDblClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
