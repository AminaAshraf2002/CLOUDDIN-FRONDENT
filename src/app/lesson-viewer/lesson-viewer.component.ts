import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { CourseService } from '../services/course.service';
import { Course, Lesson, Subcategory } from '../shared/models/course.model';

@Component({
  selector: 'app-lesson-viewer',
  templateUrl: './lesson-viewer.component.html',
  styleUrls: ['./lesson-viewer.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, MatTabsModule]
})
export class LessonViewerComponent implements OnInit, OnDestroy {
  courseId: number = 0;
  subcategoryId: number = 0;
  course: Course | null = null;
  subcategory: Subcategory | null = null;
  lessons: Lesson[] = [];
  currentLesson: Lesson | null = null;
  selectedTabIndex: number = 0;
  isLoading: boolean = true;
  error: string | null = null;
  private routeSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(params => {
      this.courseId = +params['courseId'];
      this.subcategoryId = +params['subcategoryId'];
      
      this.loadData();
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  loadData(): void {
    this.isLoading = true;
    this.error = null;

    // First, load the course
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (course) => {
        this.course = course;
        
        // Then, load the subcategory
        this.loadSubcategory();
      },
      error: (err) => {
        console.error('Error loading course:', err);
        this.error = err.message || 'Failed to load course';
        this.isLoading = false;
      }
    });
  }

  loadSubcategory(): void {
    // Get the subcategory by ID from the API
    this.courseService.getSubcategoryById(this.subcategoryId).subscribe({
      next: (subcategory) => {
        this.subcategory = subcategory;
        
        // Finally, load the lessons
        this.loadLessons();
      },
      error: (err) => {
        console.error('Error loading subcategory:', err);
        this.error = err.message || 'Failed to load subcategory';
        this.isLoading = false;
      }
    });
  }

  loadLessons(): void {
    // Get lessons for this subcategory from the API
    this.courseService.getLessonsForSubcategory(this.subcategoryId).subscribe({
      next: (lessons) => {
        this.lessons = lessons;
        
        // Set first lesson as current if available
        if (lessons.length > 0) {
          this.currentLesson = lessons[0];
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading lessons:', err);
        this.error = err.message || 'Failed to load lessons';
        this.isLoading = false;
      }
    });
  }

  // Tab change event handler
  onTabChanged(index: number): void {
    this.selectedTabIndex = index;
    this.currentLesson = this.lessons[index];
  }

  // Safely transform video URL
  sanitizeVideoUrl(url: string | undefined): SafeResourceUrl | null {
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  }

  // Helper methods for the template
  getLessonTitle(lesson: Lesson): string {
    return `Day ${lesson.day}: ${lesson.title}`;
  }

  getLessonDescription(lesson: Lesson): string {
    return lesson.description || 'No description available';
  }

  getLessonTopics(lesson: Lesson): string[] {
    return lesson.topics || [];
  }
}