import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  QueryList,
  Renderer2, ViewEncapsulation
} from '@angular/core';
import * as Hammer from 'hammerjs';
import {SwiperElDirective} from './swiper-el.directive';


@Component({
  selector: 'swipper',
  template: `
    <div class="wrapper" [ngStyle]="{'width.px':width}">
      <div class="parent" [style.marginLeft.px]=marginLeft [ngStyle]="{'height.px':height,'width.px':wrapperWidth}">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./swiper.less'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SwiperComponent implements OnInit, AfterContentInit {
  panning: boolean;
  panDistance: number;

  private hammerHandler: HammerManager;
  private lastPos = 0;
  private childrenCount: number;
  @ContentChildren(SwiperElDirective) children: QueryList<SwiperElDirective>;
  @Input() width = 200;
  @Input() height = 100;
  wrapperWidth = 9999;
  marginLeft = 0;
  private swiping: boolean;
  private selectedItem: SwiperElDirective;
  private selectedIndex: number;

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit() {

    this.hammerHandler = new Hammer(this.el.nativeElement);
    this.hammerHandler.get('swipe').set({direction: Hammer.DIRECTION_ALL});
    this.hammerHandler.get('pan').set({direction: Hammer.DIRECTION_ALL});
    // this.hammerHandler.on('panleft panright', event => {
    //   this.panEvent(event);
    // });
    this.hammerHandler.on('swiperight swipeleft ', event => {
      this.swipeEvent(event);
    });
  }

  ngAfterContentInit(): void {

    this.children.forEach(c => {
      c.width = this.width;
      c.height = this.height;
    });
    this.childrenCount = this.children.length;
    this.wrapperWidth = (this.childrenCount * this.width);
  }

  private swipeEvent(hammerInput: HammerInput) {
    console.log(hammerInput.type);
    this.swiping = true;
    if (this.canMoveLeft(hammerInput)) {
      this.swipeLeft();
    }
    if (this.canMoveRight(hammerInput)) {
      this.swipeRight();
    }
    this.swiping = false;
    this.selectedIndex = Math.abs(this.marginLeft / this.width);
    this.selectedItem = this.children.toArray()[this.selectedIndex];
    console.log(this.selectedIndex);
  }

  private canMoveRight(hammerInput: HammerInput) {
    return ((hammerInput.type === 'swiperight') || (hammerInput.type === 'panright')) && this.marginLeft < 0;
  }

  private canMoveLeft(hammerInput: HammerInput) {
    return ((hammerInput.type === 'swipeleft') || (hammerInput.type === 'panleft')) &&
      this.marginLeft > (-this.width - 1 * this.childrenCount);
  }

  private swipeRight() {
    this.lastPos += this.width;
    this.marginLeft = this.lastPos;
  }

  private swipeLeft() {
    this.lastPos += -this.width;
    this.marginLeft = this.lastPos;
  }

  private panEvent(hammerInput: HammerInput) {
    if (this.swiping) {
      return;
    }
    if ((hammerInput.type === 'panleft' && this.canMoveLeft(hammerInput)) ||
      (hammerInput.type === 'panright' && this.canMoveRight(hammerInput))) {
      this.marginLeft = this.lastPos + hammerInput.deltaX;
      this.panning = true;
    }
  }

  finishedAction() {
    if (this.panning) {
      this.panning = false;
      this.panDistance = 0;
      if (this.marginLeft - this.lastPos > 0) {
        this.swipeRight();
      } else {
        this.swipeLeft();
      }

    }

  }

}
