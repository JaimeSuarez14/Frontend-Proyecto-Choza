import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { ThemeService } from '../../../core/services/theme.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  auth = inject(AuthService);
  carrito = inject(CartService);
  theme = inject(ThemeService);
  navOpen  = signal(false);
  menuOpen = signal(false);

  toggleTheme() {
    this.theme.toggle();
  }

  logout() {
    this.auth.logout();
  }
}
