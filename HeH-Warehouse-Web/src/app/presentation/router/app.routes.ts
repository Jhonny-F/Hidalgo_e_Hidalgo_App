import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        title: 'Inicio de Sesión | Hidalgo e Hidalgo',
        loadComponent: () => import('./../modules/authentication/authentication.component').then(c => c.AuthenticationComponent)
    },
    {
        path: 'admin',
        title: 'Administrador | Hidalgo e Hidalgo',
        loadComponent: () => import('../modules/admin/home/home.component').then(c => c.HomeComponent),
        loadChildren: () => import('../modules/admin/routes/admin-pages.routes').then(r => r.AdminPages)
    }
];
