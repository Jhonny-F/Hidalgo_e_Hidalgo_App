import { appConfig } from './app/config/app.config';
import { AppComponent } from './app/presentation/app.component';
import { bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
