import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { EditComponent } from './components/edit/edit.component';
import { NavComponent } from './components/nav/nav.component';
import { NoteGridComponent } from './components/note-grid/note-grid.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: NavComponent,
    children: [
      { path: '', component: NoteGridComponent },
      { path: 'tag/:tag', component: NoteGridComponent },
      { path: 'trash', component: NoteGridComponent },
      { path: 'new', component: EditComponent },
      { path: 'new/:id', component: EditComponent },
      { path: 'edit', component: EditComponent },
      { path: 'edit/:id', component: EditComponent },
    ],
    canActivate: [ AuthGuard ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
