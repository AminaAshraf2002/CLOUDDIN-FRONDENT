// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

interface AdminUser {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://clouddin.onrender.com/api';
  private tokenKey = 'adminToken';
  private adminUserKey = 'adminUser';
  
  // BehaviorSubject to track the current admin user
  private currentAdminSubject = new BehaviorSubject<AdminUser | null>(this.getStoredAdmin());
  currentAdmin$ = this.currentAdminSubject.asObservable();
  
  constructor(private http: HttpClient) {}
  
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/login`, credentials)
      .pipe(
        tap(response => {
          if (response.token) {
            // Store the token
            localStorage.setItem(this.tokenKey, response.token);
            
            // Store admin user information
            const adminUser = {
              name: response.admin.name,
              email: response.admin.email
            };
            localStorage.setItem(this.adminUserKey, JSON.stringify(adminUser));
            
            // Update the behavior subject
            this.currentAdminSubject.next(adminUser);
          }
        })
      );
  }
  
  logout(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    
    return this.http.post(`${this.apiUrl}/admin/logout`, {}, { headers })
      .pipe(
        tap(() => {
          // Clear stored data
          localStorage.removeItem(this.tokenKey);
          localStorage.removeItem(this.adminUserKey);
          
          // Update the behavior subject
          this.currentAdminSubject.next(null);
        })
      );
  }
  
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  
  hasToken(): boolean {
    return !!this.getToken();
  }
  
  getStoredAdmin(): AdminUser | null {
    const adminJson = localStorage.getItem(this.adminUserKey);
    return adminJson ? JSON.parse(adminJson) : null;
  }
  
  getAdminName(): string {
    const admin = this.getStoredAdmin();
    return admin ? admin.name : 'Admin';
  }
}