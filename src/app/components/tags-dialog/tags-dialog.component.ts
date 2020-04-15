import { StoreService } from 'src/app/services/store.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-tags',
  templateUrl: './tags-dialog.component.html',
  styleUrls: ['./tags-dialog.component.scss']
})
export class TagsDialogComponent implements OnInit {
  selectedTags = [];

  constructor(
    public dialogRef: MatDialogRef<TagsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public store: StoreService,
  ) { }

  ngOnInit(): void {
    this.selectedTags = this.store.getNoteTags(this.data.noteId);
  }

  isSelected(tag: string): boolean {
    return this.selectedTags.some(i => i === tag);
  }

  changeTag(event: MatCheckboxChange, tag: string): void {
    const index = this.selectedTags.findIndex(i => i === tag);

    if (!event.checked) {
      if (index !== -1) {
        this.selectedTags.splice(index, 1);
      }
    } else {
      if (index === -1) {
        this.selectedTags.push(tag);
      }
    }

    this.upd();
  }

  keyDown(event: any, tag: string): void {
    if (event.key === 'Enter') {
      const index = this.selectedTags.findIndex(i => i === tag);

      if (index === -1) {
        this.selectedTags.push(tag);
      }

      this.upd();
      event.target.value = '';
    }
  }

  upd(): void {
    this.store.updNote({
      id: this.data.noteId,
      tags: this.selectedTags
    });
  }
}
