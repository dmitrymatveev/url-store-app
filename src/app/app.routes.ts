import { Routes } from '@angular/router';
import { FormComponent } from './form.component';
import { ResultsComponent } from './results.component';

export const routes: Routes = [
  { path: '', component: FormComponent },
  { path: 'results', component: ResultsComponent },
];
