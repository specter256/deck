import { ToolbarComponent } from './../toolbar/toolbar.component';
import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, take } from 'rxjs/operators';
import { Note } from 'src/app/models/note';
import { AuthService } from './../../services/auth.service';
import { StoreService } from './../../services/store.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  // Note
  id: string;
  title = '';
  content = '';
  tags = [];
  titleChanged = new Subject<string>();
  contentChanged = new Subject<string>();

  // Variables
  isPreview = true;
  isModal = false;
  tagsSubscription: Subscription;
  titleSubscription: Subscription;
  contentSubscription: Subscription;

  @ViewChild('editor') editorRef: ElementRef<HTMLTextAreaElement>;
  @ViewChild('toolbar') set toolbarRef(toolbar: ToolbarComponent) {
    if (!toolbar) return;
    if (this.activatedRoute.snapshot.url[0].path === 'new') {
      toolbar.focusOnTitle();
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      this.save();
    }

    if (event.ctrlKey && event.key === 'e') {
      event.preventDefault();
      this.togglePreview();
    }
  }

  constructor(
    public store: StoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private location: Location,
    private auth: AuthService
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.getData(params.id);
      }

      if (
        this.activatedRoute.snapshot.url.length
        && this.activatedRoute.snapshot.url[0].path === 'new'
      ) {
        if (!params.id) {
          this.isModal = true;
        }

        this.isPreview = false;
        this.cd.detectChanges();
      } else {
        // Select first note from the list
        if (!params.id && this.store.notes.length && !this.store.isPhoneScreen) {
          this.router.navigate(['/edit/' + this.store.notes[0].id]);
          return;
        }
      }
    });
  }

  getData(id: string): void {
    const note = this.store.getNote(id);

    if (!note) return;

    note.valueChanges().pipe(
      take(1)
    ).subscribe((data: Note) => {
      if (!data) {
        this.router.navigate(['/edit']);
        return;
      }

      this.id = id;
      this.title = data.title;
      this.content = data.content;

      this.subscribeToTags(note);
      this.subscribeToAutoSave();
    });
  }

  new(): void {
    this.router.navigate(['/new']);
  }

  async save(): Promise<void> {
    if (this.id) {
      this.store.updNote({
        id: this.id,
        title: this.title,
        content: this.content,
        updated_at: new Date(),
      });
    } else {
      const doc = await this.store.addNote({
        title: this.title,
        content: this.content,
        created_at: new Date(),
        updated_at: new Date(),
        user_id: this.auth.userData.uid
      });

      this.store.isLoading = false;

      if (this.store.isPhoneScreen)
        this.router.navigate(['/edit']);
      else
        this.onSelectNote(doc.id);
    }
  }

  del(): void {
    this.title = '';
    this.content = '';

    if (this.id) {
      this.store.moveNoteToTrash(this.id);
    }

    this.router.navigate(['/edit']);
    return;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      event.preventDefault();
    }
  }

  onChangeTitle(value: string): void {
    this.title = value;
    this.titleChanged.next(value);
  }

  onChangeContent(value: string): void {
    this.content = value;
    this.contentChanged.next(value);
  }

  onSelectNote(id: string): void {
    this.router.navigate(['/edit', id]);
  }

  togglePreview(): void {
    this.isPreview = !this.isPreview;
  }

  closeNew(): void {
    this.location.back();
  }

  isListVisible(): boolean {
    return !this.store.isPhoneScreen
        || (this.store.isPhoneScreen && !this.id && !this.isModal);
  }

  isEditorVisible(): boolean {
    return (this.store.isPhoneScreen && !!this.id || this.isModal)
        || !this.store.isPhoneScreen;
  }

  subscribeToTags(note: AngularFirestoreDocument): void {
    this.tagsSubscription = note.valueChanges().subscribe((values) => {
      // Unsubscribe if document was deleted
      if (values === undefined) {
        this.unsubscribe();
        return;
      }

      this.tags = this.store.getNoteTags(this.id);
    });
  }

  subscribeToAutoSave(): void {
    if (!this.id) return;

    this.titleSubscription = this.titleChanged.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {
      this.save();
    });

    this.contentSubscription = this.contentChanged.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {
      this.save();
    });
  }

  unsubscribe(): void {
    if (!this.id) return;
    this.tagsSubscription.unsubscribe();
    this.titleSubscription.unsubscribe();
    this.contentSubscription.unsubscribe();
  }
}
