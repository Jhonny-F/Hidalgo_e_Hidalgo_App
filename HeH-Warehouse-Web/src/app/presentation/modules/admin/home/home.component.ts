import { Observable, map, shareReplay } from 'rxjs';
import { ToastService } from '@core/common/toast.service';
import { Component, inject, OnInit } from '@angular/core';
import { AdminPages } from '../routes/admin-pages.routes';
import { AsyncPipe, CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router, RouterLink, RouterOutlet, Routes } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [
        AsyncPipe,
        RouterOutlet,
        RouterLink,
        CommonModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        MatToolbarModule,
        MatSidenavModule,
    ]
})
export class HomeComponent implements OnInit {

  public menuItems: Routes = [];

  private _router = inject(Router);
  private _toast = inject(ToastService);
  private _breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this._breakpointObserver.observe(Breakpoints.Handset)
    .pipe(map(result => result.matches), shareReplay());

  ngOnInit(): void {
    this.menuItems = this.getFilteredRoutes();
  }

  exitSession() {
    this._toast.success("Sesión cerrada exitosamente");
    this._router.navigate(['login']);
  }

  isActivePath(...routePaths: string[]): boolean {
    const fullPath = `/admin/${routePaths.join('/')}`;
    return this._router.url.startsWith(fullPath);
  }

  private getFilteredRoutes(): any[] {
    return AdminPages
      .map(route => route.children ?? [])
      .flat()
      .filter(route => route && route.path)
  }

}
