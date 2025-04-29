import { provideHttpClient } from '@angular/common/http';
import { routes } from '../presentation/router/app.routes';
import { provideRouter, withViewTransitions } from '@angular/router';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(),
    provideAnimationsAsync()
  ]
};
