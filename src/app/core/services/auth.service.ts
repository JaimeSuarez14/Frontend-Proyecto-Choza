import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export interface AuthUser {
  id?: number;
  nombre: string;
  email?: string;
  tipo: 'cliente' | 'admin';
  rol?: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = environment.apiUrl;

  // Señal del usuario autenticado
  readonly user = signal<AuthUser | null>(this.loadUser());

  // Señales computadas
  readonly isLoggedIn = computed(() => !!this.user());
  readonly isAdmin = computed(() => this.user()?.tipo === 'admin');
  readonly isCliente = computed(() => this.user()?.tipo === 'cliente');
  readonly nombreUsuario = computed(() => this.user()?.nombre ?? '');

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  loginCliente(email: string, contrasena: string) {
    return this.http
      .post<any>(`${this.api}/auth/login-cliente`, { email, contrasena })
      .pipe(tap((res) => {
        console.log(res);
        this.guardarSesion(res.data)}
      ));
  }

  loginAdmin(usuario: string, contrasena: string) {
    return this.http
      .post<any>(`${this.api}/auth/login-admin`, { usuario, contrasena })
      .pipe(tap((res) => this.guardarSesion(res.data)));
  }

  registro(data: any) {
    return this.http
      .post<any>(`${this.api}/auth/registro`, data)
      .pipe(tap((res) => this.guardarSesion(res.data)));
  }

  logout(): void {
    this.user.set(null);
    localStorage.removeItem('choza-user');
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return this.user()?.token ?? null;
  }

  private guardarSesion(data: AuthUser): void {
    this.user.set(data);
    localStorage.setItem('choza-user', JSON.stringify(data));
  }

  private loadUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem('choza-user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
