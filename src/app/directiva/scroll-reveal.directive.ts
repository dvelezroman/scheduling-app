import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appScrollReveal]'
})
export class ScrollRevealDirective {
  @Input() revealClass = 'reveal';

  constructor(private el: ElementRef, private renderer: Renderer2) {

    this.renderer.addClass(this.el.nativeElement, 'hidden');
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const elementPosition = this.el.nativeElement.getBoundingClientRect().top;
    const viewportHeight = window.innerHeight;

    if (elementPosition < viewportHeight) {
      this.renderer.addClass(this.el.nativeElement, this.revealClass);
      this.renderer.removeClass(this.el.nativeElement, 'hidden');
    }
  }
}
