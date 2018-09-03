import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainingComponent } from 'src/app/training/training.component';
import { HomeComponent } from 'src/app/common/home.component';
import { CompareOneComponent } from 'src/app/compare/compare-one.component';
import { CompareAllComponent } from 'src/app/compare/compare-all.component';

const APP_ROUTES: Routes = [
    { path: "training", component: TrainingComponent },
    { path: "compare-one", component: CompareOneComponent },
    { path: "compare-all", component: CompareAllComponent },
    { path: "home", component: HomeComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/home', pathMatch: 'full' }
]

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forRoot(APP_ROUTES)],
})
export class AppRoutingModule { }