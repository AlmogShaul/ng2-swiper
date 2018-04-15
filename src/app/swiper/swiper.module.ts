import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SwiperElDirective} from './swipper-cmp/swiper-el.directive';
import {SwiperComponent} from './swipper-cmp/swiper.cmp';
//test
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SwiperElDirective, SwiperComponent],
  exports: [SwiperElDirective, SwiperComponent]
})
export class SwiperModule {
}
