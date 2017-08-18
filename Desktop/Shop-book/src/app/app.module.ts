import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PhonesComponent } from './phones/phones.component';
import { PhoneListComponent } from './phones/phone-list/phone-list.component';
import { PhoneDetailComponent } from './phones/phone-detail/phone-detail.component';
import { PhoneAccessoriesComponent } from './phones/phone-list/phone-accessories/phone-accessories.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PhonesComponent,
    PhoneListComponent,
    PhoneDetailComponent,
    PhoneAccessoriesComponent,
    ShoppingListComponent,
    ShoppingEditComponent,


  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
