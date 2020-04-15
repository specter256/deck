import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Note } from '../models/note';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  // Notes
  private notesCollection: AngularFirestoreCollection;
  notes = [];
  notes$: Observable<any[]>;

  // Tags
  tags = [];

  // Props
  isLoading = true;
  isPhoneScreen = this.breakpointObserver.isMatched('(max-width: 599px)');
  isTabletScreen = this.breakpointObserver.isMatched('(min-width: 600px) and (max-width: 959px)');
  isNavOpened = true;

  constructor(
    private fs: AngularFirestore,
    private breakpointObserver: BreakpointObserver,
    private auth: AuthService,
  ) {
  }

  getNotes(): void {
    this.notes = [];
    this.tags = [];

    this.notesCollection = this.fs.collection('notes', ref => {
      return ref.where('user_id', '==', this.auth.userData.uid || null)
                .orderBy('updated_at', 'desc');
    });

    this.notes$ = this.notesCollection.valueChanges({
      idField: 'id'
    });

    this.notes$.subscribe(data => {
      this.notes = data;
      this.isLoading = false;
      this.parseTags();
    });
  }

  getNote(id: string): AngularFirestoreDocument<any> {
    return this.notesCollection.doc(id);
  }

  addNote(data: Note): Promise<DocumentReference> {
    this.isLoading = true;
    return this.notesCollection.add(data);
  }

  updNote(data: Note): void {
    this.isLoading = true;
    this.notesCollection.doc(data.id).update(data).then(() => {
      this.isLoading = false;
    });
  }

  delNote(id: string): void {
    if (!id) return;
    this.isLoading = true;
    this.notesCollection.doc(id).delete().then(() => {
      this.isLoading = false;
    });
  }

  parseTags(): void {
    this.tags = [];

    for (const note of this.notes) {
      if (!note.tags) continue;

      for (const tag of note.tags) {
        if (!this.tags.find(i => i === tag)) {
          this.tags.push(tag);
        }
      }
    }
  }

  getNoteTags(noteId: string): string[] {
    const note = this.notes.find(i => i.id === noteId);
    return note.tags || [];
  }

  toggleNav(): void {
    this.isNavOpened = !this.isNavOpened;
  }
}
