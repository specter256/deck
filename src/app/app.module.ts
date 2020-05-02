import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgsgModule } from 'ng-sortgrid';
import { MarkdownModule } from 'ngx-markdown';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { NavComponent } from './components/nav/nav.component';
import { NoteGridComponent } from './components/note-grid/note-grid.component';
import { NoteCardComponent } from './components/note-card/note-card.component';
import { EditComponent } from './components/edit/edit.component';
import { NoteListComponent } from './components/note-list/note-list.component';
import { SearchComponent } from './components/search/search.component';
import { environment } from '../environments/environment';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { LoginComponent } from './components/auth/login/login.component';
import { TagsDialogComponent } from './components/tags-dialog/tags-dialog.component';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    NoteGridComponent,
    NoteCardComponent,
    EditComponent,
    NoteListComponent,
    SearchComponent,
    ToolbarComponent,
    LoginComponent,
    TagsDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    NgsgModule,
    MarkdownModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
