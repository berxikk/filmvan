import { Movie, Genre } from '../types/movie';

export const MOCK_GENRES: Genre[] = [
  {
    id: 'g-1',
    name: 'Aksiyon & Macera',
    slug: 'aksiyon-macera',
    description: 'Nefes kesen kovalamacalar, cesur kaçışlar ve unutulmaz maceralar.',
    iconName: 'Zap',
    movieCount: 0,
    coverUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'g-2',
    name: 'Dram',
    slug: 'dram',
    description: 'Derin insan hikayeleri, duygusal yolculuklar ve güçlü oyunculuklar.',
    iconName: 'Heart',
    movieCount: 0,
    coverUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'g-3',
    name: 'Klasikler',
    slug: 'klasikler',
    description: 'Sinema tarihine damga vurmuş, zamansız başyapıtlar ve ilk dönem filmleri.',
    iconName: 'Film',
    movieCount: 0,
    coverUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'g-4',
    name: 'Korku & Gerilim',
    slug: 'korku-gerilim',
    description: 'Karanlık atmosferler, tekinsiz gölgeler ve gerilim dolu anlar.',
    iconName: 'Ghost',
    movieCount: 0,
    coverUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'g-5',
    name: 'Komedi',
    slug: 'komedi',
    description: 'Sessiz sinemanın dehalarından kahkaha dolu klasik komediler.',
    iconName: 'Smile',
    movieCount: 0,
    coverUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'g-6',
    name: 'Bilim Kurgu',
    slug: 'bilim-kurgu',
    description: 'Geleceğin vizyonları, distopyalar ve uzay keşifleri.',
    iconName: 'Sparkles',
    movieCount: 0,
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  },
];

// Pure empty array - Only movies added by the admin via BERXO panel will be displayed!
export const MOCK_MOVIES: Movie[] = [];
