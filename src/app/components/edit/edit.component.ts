import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
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
  titleChanged: Subject<string> = new Subject<string>();
  contentChanged: Subject<string> = new Subject<string>();

  // Variables
  isPreview = true;
  isModal = false;
  tagsSubscription: Subscription;
  titleSubscription: Subscription;
  contentSubscription: Subscription;

  @ViewChild('editor') editor: ElementRef<HTMLTextAreaElement>;

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

      if (this.activatedRoute.snapshot.url[0].path === 'new') {
        if (!params.id) {
          this.isModal = true;
        }

        this.isPreview = false;
        this.cd.detectChanges();

        if (this.editor) {
          this.editor.nativeElement.focus();
        }
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

      this.tagsSubscription = note.valueChanges().subscribe(() => {
        this.tags = this.store.getNoteTags(this.id);
      });
      this.subscribeToAutoSave();
    });
  }

  async new(): Promise<void> {
    const doc = await this.store.addNote({
      title: '',
      content: '',
      created_at: new Date(),
      updated_at: new Date(),
      user_id: this.auth.userData.uid
    });

    this.store.isLoading = false;
    this.router.navigate(['/new', doc.id]);
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
      this.store.delNote(this.id).then(() => {
        this.router.navigate(['/edit']);
      });
    } else {
      this.router.navigate(['/edit']);
    }

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
