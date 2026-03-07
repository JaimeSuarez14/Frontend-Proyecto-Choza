import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- Hero -->
    <section
      class="relative text-white py-24"
      style="background: linear-gradient(rgba(0,60,92,0.8), rgba(0,96,100,0.9)), url('/assets/img/empresa-banner.jpg') center/cover;"
    >
      <div class="max-w-7xl mx-auto px-6 text-center fade-in">
        <h1 class="text-5xl font-bold mb-4">Nuestra Empresa</h1>
        <p class="text-xl text-cyan-200">Comprometidos con la calidad y el mejor servicio</p>
      </div>
    </section>

    <!-- Quiénes somos -->
    <section class="max-w-7xl mx-auto px-6 py-16">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div
          class="bg-linear-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900/30 dark:to-cyan-800/30 rounded-3xl h-auto flex items-center justify-center text-8xl"
        >
          <img src="assets/choza.jpg" class="h-auto" />
        </div>
        <div class="fade-in">
          <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">¿Quiénes Somos?</h2>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            Somos una cevichería con tradición en Ica, Perú. Ofrecemos los mejores platos del mar
            con ingredientes frescos del día, preparados con recetas que han pasado de generación en
            generación.
          </p>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
            Nuestro equipo trabaja con pasión, responsabilidad y el firme compromiso de brindarte la
            mejor experiencia gastronómica marina.
          </p>
          <a routerLink="/menu" class="btn-ocean inline-flex items-center gap-2 mt-6 px-6 py-3">
            🍽️ Ver Nuestro Menú
          </a>
        </div>
      </div>
    </section>

    <!-- Misión y Visión -->
    <section class="bg-gray-50 dark:bg-gray-800/50 py-14">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid md:grid-cols-2 gap-6">
          <div class="card p-8 card-hover text-center">
            <div class="text-5xl mb-4">🎯</div>
            <h3 class="text-xl font-bold text-cyan-700 dark:text-cyan-400 mb-3">Misión</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Brindar platos de calidad con ingredientes frescos, garantizando la satisfacción de
              nuestros comensales con cada visita.
            </p>
          </div>
          <div class="card p-8 card-hover text-center">
            <div class="text-5xl mb-4">🚀</div>
            <h3 class="text-xl font-bold text-cyan-700 dark:text-cyan-400 mb-3">Visión</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Ser la cevichería líder en Ica, reconocida por su excelencia, autenticidad y
              compromiso con la gastronomía peruana.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Valores -->
    <section class="max-w-7xl mx-auto px-6 py-14">
      <h2 class="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-10">
        Nuestros Valores
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-5">
        @for (v of valores; track v.icon) {
          <div class="card p-6 text-center card-hover">
            <div class="text-4xl mb-3">{{ v.icon }}</div>
            <h4 class="font-bold text-gray-800 dark:text-gray-100 mb-1">{{ v.titulo }}</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ v.desc }}</p>
          </div>
        }
      </div>
    </section>

    <section class="bg-gray-50 py-16 dark:bg-gray-900">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            Nuestros Locales
          </h2>
          <div class="h-1 w-20 bg-indigo-600 mx-auto rounded-full"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            class="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
          >
            <div class="overflow-hidden">
              <img
                src="assets/locales/local1.jpg"
                alt="Local Centro"
                class="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div class="p-6">
              <h5 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Local Centro</h5>
              <div class="space-y-2">
                <p class="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <span class="mr-2">📍</span> Av. Principal 123, Lima
                </p>
                <p
                  class="flex items-center text-indigo-600 dark:text-indigo-400 font-medium text-sm"
                >
                  <span class="mr-2">📞</span> 987 654 321
                </p>
              </div>
            </div>
          </div>

          <div
            class="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
          >
            <div class="overflow-hidden">
              <img
                src="assets/locales/local2.jpg"
                alt="Local Norte"
                class="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div class="p-6">
              <h5 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Local Norte</h5>
              <div class="space-y-2">
                <p class="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <span class="mr-2">📍</span> Av. Norte 456, Lima
                </p>
                <p
                  class="flex items-center text-indigo-600 dark:text-indigo-400 font-medium text-sm"
                >
                  <span class="mr-2">📞</span> 912 345 678
                </p>
              </div>
            </div>
          </div>

          <div
            class="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
          >
            <div class="overflow-hidden">
              <img
                src="assets/locales/local3.jpg"
                alt="Local Sur"
                class="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div class="p-6">
              <h5 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Local Sur</h5>
              <div class="space-y-2">
                <p class="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <span class="mr-2">📍</span> Av. Sur 789, Lima
                </p>
                <p
                  class="flex items-center text-indigo-600 dark:text-indigo-400 font-medium text-sm"
                >
                  <span class="mr-2">📞</span> 923 456 789
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class NosotrosComponent {
  valores = [
    { icon: '🤝', titulo: 'Compromiso', desc: 'Con nuestros clientes y la calidad' },
    { icon: '⭐', titulo: 'Excelencia', desc: 'En cada plato que servimos' },
    { icon: '🌱', titulo: 'Frescura', desc: 'Ingredientes frescos del día' },
    { icon: '❤️', titulo: 'Pasión', desc: 'Por la gastronomía peruana' },
  ];
}
