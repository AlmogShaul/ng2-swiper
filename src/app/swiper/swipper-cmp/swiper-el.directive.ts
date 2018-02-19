import {AfterViewInit, Directive, ElementRef, HostBinding, HostListener, Input, OnChanges, Renderer2, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[saSwiperEl]'
})
export class SwiperElDirective implements AfterViewInit, OnChanges {

  @Input() width = 300;
  @Input() height = 200;

  @HostListener('mousedown', ['$event'])
  private onClick(event: any): void {
    event.stopPropagation();
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {
    // const imgs = el.nativeElement.querySelector(el.nativeElement, 'img');
    // Array.of(...imgs).forEach(img => {
    //   img.setAttribute('draggable', 'false');
    // });
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.renderer.setStyle(this.el, 'height', this.height);
    this.renderer.setStyle(this.el, 'width', this.width);
  }

}
