import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { CantineToulouse } from './app.component';
import { HomePage } from '../pages/home/home';
import { CantineDetailsPage } from '../pages/cantine-details/cantine-details';
import { CantineListPage } from '../pages/cantine-list/cantine-list';

@NgModule({
  declarations: [
    CantineToulouse,
    HomePage,
    CantineDetailsPage,
    CantineListPage
  ],
  imports: [
    IonicModule.forRoot(CantineToulouse)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    CantineToulouse,
    HomePage,
    CantineDetailsPage,
    CantineListPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
