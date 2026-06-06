import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  readonly hotelName = 'MünchnerRoyalResidenz';

  private slideshowTimer: ReturnType<typeof setInterval> | null = null;
  currentSlideIndex = 0;

  readonly heroSlides = [
    {
      imageUrl: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1800&q=80',
      slogan: 'Luxurioese Ruhe mitten in der Altstadt'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1800&q=80',
      slogan: 'Zeitlose Eleganz in jedem Detail'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1800&q=80',
      slogan: 'Exklusiver Service fuer besondere Aufenthalte'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=80',
      slogan: 'Grosszuegige Suiten mit alpinem Charme'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1800&q=80',
      slogan: 'Entspannung im exklusiven Spa- und Poolbereich'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1800&q=80',
      slogan: 'Grandeur und Herzlichkeit im Herzen Muenchens'
    }
  ];

  readonly showcaseSections = [
    {
      title: 'Aussenansicht',
      imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1400&q=80'
    },
    {
      title: 'Lobby',
      imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1400&q=80'
    },
    {
      title: 'Gourmetrestaurant',
      imageUrl: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1400&q=80'
    },
    {
      title: 'Hotelbar',
      imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f29c9fe3d1?auto=format&fit=crop&w=1400&q=80'
    },
    {
      title: 'Rooftop-Bar',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80'
    },
    {
      title: 'Spa',
      imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1400&q=80'
    },
    {
      title: 'Innenpool',
      imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1400&q=80'
    },
    {
      title: 'Wellnessbereich',
      imageUrl: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1400&q=80'
    },
    {
      title: 'Zimmerbeispiel',
      imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1400&q=80'
    }
  ];

  readonly highlightImages = [
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=80'
  ];

  readonly hotelAmenities = [
    'Spa & Wellnessbereich',
    'Fitnessbereich mit Personal Training',
    'Rooftop-Bar mit Blick ueber die Altstadt',
    'Gourmetrestaurant mit regionaler Fine Dining Karte',
    'Concierge-Service',
    'Parkservice',
    'Limousinenservice',
    'Tagungsraeume',
    'Kostenfreies Highspeed-WLAN',
    '24h Zimmerservice',
    'A-la-carte-Fruehstueck',
    'Gepaeckservice'
  ];

  readonly guestServices = [
    '24-Stunden-Rezeption',
    'Persoenlicher Concierge',
    'Flughafentransfer',
    'Valet Parking',
    'Waescheservice',
    'Business-Service',
    'Private Stadtfuehrungen',
    'Restaurant-Reservierungsservice',
    'Wellnessbehandlungen',
    'Room Service'
  ];

  readonly sights = [
    { name: 'Marienplatz', walkTime: '4 Min. zu Fuss', distance: '300 m' },
    { name: 'Frauenkirche', walkTime: '6 Min. zu Fuss', distance: '450 m' },
    { name: 'Viktualienmarkt', walkTime: '7 Min. zu Fuss', distance: '500 m' },
    { name: 'Residenz Muenchen', walkTime: '9 Min. zu Fuss', distance: '700 m' },
    { name: 'Hofbraeuhaus', walkTime: '8 Min. zu Fuss', distance: '650 m' },
    { name: 'Englischer Garten', walkTime: '18 Min. zu Fuss', distance: '1.5 km' }
  ];

  ngOnInit(): void {
    this.slideshowTimer = setInterval(() => {
      this.nextSlide();
    }, 5500);
  }

  ngOnDestroy(): void {
    if (this.slideshowTimer) {
      clearInterval(this.slideshowTimer);
    }
  }

  nextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.heroSlides.length;
  }

  previousSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.heroSlides.length) % this.heroSlides.length;
  }

  goToSlide(index: number): void {
    this.currentSlideIndex = index;
  }
}
