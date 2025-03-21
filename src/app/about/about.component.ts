import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, AfterViewInit {
  private counted = false;
  
  constructor() {}
  
  ngOnInit(): void {}
  
  ngAfterViewInit(): void {
    this.startCounterOnScroll();
  }
  
  @HostListener('window:scroll', [])
  onScroll(): void {
    this.startCounterOnScroll();
  }
  
  startCounterOnScroll(): void {
    const counters = document.querySelectorAll('.counter');
    const section = document.querySelector('.stats-section');
    
    if (section) {
      const sectionTop = section.getBoundingClientRect().top;
      const screenHeight = window.innerHeight;
      
      if (sectionTop < screenHeight && !this.counted) {
        counters.forEach(counter => {
          const target = Number(counter.getAttribute('data-target'));
          let count = 0;
          const increment = Math.ceil(target / 100);
          
          const updateCounter = () => {
            if (count < target) {
              count += increment;
              counter.textContent = count.toString();
              setTimeout(updateCounter, 20);
            } else {
              counter.textContent = target.toString();
            }
          };
          
          updateCounter();
        });
        
        this.counted = true;
      }
    }
  }
}