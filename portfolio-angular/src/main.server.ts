import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app'; // <--- Altere de AppComponent para App
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(App, config);

export default bootstrap;