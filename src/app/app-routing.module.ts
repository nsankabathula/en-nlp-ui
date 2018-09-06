import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainingComponent } from 'src/app/training/training.component';
import { HomeComponent } from 'src/app/common/home.component';
import { CompareOneComponent } from 'src/app/compare/compare-one.component';
import { CompareAllComponent } from 'src/app/compare/compare-all.component';
import { Doc2VecTrainingComponent } from 'src/app/compare/training.d2v.component';

const APP_ROUTES: Routes = [
    { path: "training", component: TrainingComponent },
    { path: "d2v-testing-2", component: CompareOneComponent },
    { path: "d2v-testing-1", component: CompareAllComponent },
    { path: "d2v-training", component: Doc2VecTrainingComponent },
    { path: "home", component: HomeComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/home', pathMatch: 'full' }
]

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forRoot(APP_ROUTES)],
})
export class AppRoutingModule { }