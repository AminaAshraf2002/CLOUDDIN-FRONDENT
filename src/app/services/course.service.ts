// src/app/services/course.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Course, Lesson, Subcategory } from '../shared/models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'https://clouddin.onrender.com/api/course'; // Your API base URL

  constructor(private http: HttpClient) {}

  // Helper method to get auth headers
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Retrieve all courses with error handling
  getCourses(): Observable<Course[]> {
    return this.http.get<{success: boolean, data: Course[]}>(`${this.apiUrl}/courses`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error fetching courses:', error);
        return throwError(() => new Error('Unable to fetch courses'));
      })
    );
  }

  // Get a specific course by its ID
  getCourseById(courseId: number): Observable<Course | null> {
    return this.http.get<{success: boolean, data: Course}>(`${this.apiUrl}/courses/${courseId}`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error(`Error fetching course with ID ${courseId}:`, error);
        return throwError(() => new Error(`Course with ID ${courseId} not found`));
      })
    );
  }

  // Get user's assigned course
  getUserCourse(): Observable<Course> {
    return this.http.get<{success: boolean, data: Course}>(`${this.apiUrl}/user/course`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error fetching user course:', error);
        return throwError(() => new Error('Unable to fetch your course'));
      })
    );
  }

  // Get courses filtered by difficulty level (keep your existing implementation)
  getCoursesByLevel(level: 'beginner' | 'intermediate' | 'advanced'): Observable<Course[]> {
    return this.http.get<{success: boolean, data: Course[]}>(`${this.apiUrl}/courses`).pipe(
      map(response => response.data.filter(course => course.level === level)),
      map(courses => {
        if (courses.length === 0) {
          console.warn(`No courses found for level: ${level}`);
        }
        return courses;
      }),
      catchError(error => {
        console.error(`Error fetching courses by level ${level}:`, error);
        return throwError(() => new Error(`Unable to fetch courses for level ${level}`));
      })
    );
  }

  // Get subcategories for a specific course
  getSubcategoriesForCourse(courseId: number): Observable<Subcategory[]> {
    return this.http.get<{success: boolean, data: Subcategory[]}>(`${this.apiUrl}/courses/${courseId}/subcategories`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => response.data),
      catchError(error => {
        console.error(`Error fetching subcategories for course ${courseId}:`, error);
        return throwError(() => new Error(`Unable to fetch subcategories for course ${courseId}`));
      })
    );
  }

  // Get a specific subcategory by ID
  getSubcategoryById(subcategoryId: number): Observable<Subcategory> {
    return this.http.get<{success: boolean, data: Subcategory}>(`${this.apiUrl}/subcategories/${subcategoryId}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => response.data),
      catchError(error => {
        console.error(`Error fetching subcategory ${subcategoryId}:`, error);
        return throwError(() => new Error(`Unable to fetch subcategory`));
      })
    );
  }

  // Get lessons for a specific subcategory
  getLessonsForSubcategory(subcategoryId: number): Observable<Lesson[]> {
    return this.http.get<{success: boolean, data: Lesson[]}>(`${this.apiUrl}/subcategories/${subcategoryId}/lessons`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => response.data),
      catchError(error => {
        console.error(`Error fetching lessons for subcategory ${subcategoryId}:`, error);
        return throwError(() => new Error(`Unable to fetch lessons`));
      })
    );
  }

  // Get a specific lesson
  getLesson(subcategoryId: number, lessonId: number): Observable<Lesson | null> {
    return this.http.get<{success: boolean, data: Lesson}>(
      `${this.apiUrl}/subcategories/${subcategoryId}/lessons/${lessonId}`,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => response.data),
      catchError(error => {
        console.error(`Error fetching lesson ${lessonId}:`, error);
        return throwError(() => new Error(`Lesson not found`));
      })
    );
  }

  // Keep your other utility methods but implement them using the API data
  // For example:
  courseExists(courseId: number): Observable<boolean> {
    return this.http.get<{success: boolean, data: Course}>(`${this.apiUrl}/courses/${courseId}`).pipe(
      map(response => !!response.data),
      catchError(() => {
        return throwError(() => new Error('Unable to verify course existence'));
      })
    );
  }

  // For methods that don't have direct API equivalents, you can still implement them
  // by fetching data and filtering it client-side
  searchCourses(options: {
    query?: string;
    level?: 'beginner' | 'intermediate' | 'advanced';
    instructor?: string;
  } = {}): Observable<Course[]> {
    return this.http.get<{success: boolean, data: Course[]}>(`${this.apiUrl}/courses`).pipe(
      map(response => response.data),
      map(courses => {
        return courses.filter(course => {
          const matchQuery = !options.query || 
            course.title.toLowerCase().includes(options.query.toLowerCase()) ||
            course.description?.toLowerCase().includes(options.query.toLowerCase());
          
          const matchLevel = !options.level || course.level === options.level;
          
          const matchInstructor = !options.instructor || 
            course.instructor?.toLowerCase().includes(options.instructor.toLowerCase());
          
          return matchQuery && matchLevel && matchInstructor;
        });
      }),
      catchError(error => {
        console.error('Error searching courses:', error);
        return throwError(() => new Error('Unable to search courses'));
      })
    );
  }
}