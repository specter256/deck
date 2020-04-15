import { TagsDialogComponent } from '../tags-dialog/tags-dialog.component';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StoreService } from './../../services/store.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  _id: string;

  @Input()
    set id(val: string) {
      this.isDelConfirm = false;
      this._id = val;
    }
  @Input() title: string;
  @Input() isModal: boolean;
  @Output() new = new EventEmitter();
  @Output() save = new EventEmitter();
  @Output() togglePreview = new EventEmitter();
  @Output() del = new EventEmitter();
  @Output() closeNew = new EventEmitter();
  @Output() titleChange = new EventEmitter();
  @ViewChild('tagBtn') tagBtn: ElementRef<HTMLElement>;

  isDelConfirm = false;

  constructor(
    public store: StoreService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  onNew() {
    this.new.emit();
  }

  onSave() {
    this.save.emit();
  }

  onTogglePreview() {
    this.togglePreview.emit();
  }

  onDel() {
    if (this.isDelConfirm)
      this.del.emit();

    this.isDelConfirm = !this.isDelConfirm;

    if (this.isDelConfirm) {
      setTimeout(() => {
        this.isDelConfirm = false;
      }, 1500);
    }
  }

  selectTag(): void {
    const ref = this.dialog.open(TagsDialogComponent, {
      width: '250px',
      panelClass: 'dialog-container',
      data: {
        noteId: this._id
      },
    });
  }

  onCloseNew() {
    this.closeNew.emit();
  }

  onChangeTitle(title: string) {
    this.titleChange.emit(title);
  }
}
