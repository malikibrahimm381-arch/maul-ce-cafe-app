export function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export function roleLabel(role) {
  return {
    cashier: "Kasir",
    admin: "Admin",
    developer: "Developer"
  }[role] || role;
}

export const thumbnailOptions = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFQztr0w0a1Vh1Qwia3bkJVp2FR_D1wq-0zA&s",
  "https://asset.kompas.com/crops/QzJ7mkzUuw8Xo1yZf0gpBGxUuAI=/15x9:895x596/1200x800/data/photo/2023/02/01/63d9fbce5a2d2.jpg",
  "https://images.themodernproper.com/production/posts/2022/Homemade-French-Fries_8.jpg?w=960&h=960&q=82&fm=jpg&fit=crop&dm=1662474181&s=50bccc38a736ef0e0a6e261ad23378f4",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQECDWd5uz2t0QErli92w2apL9JcLU9U-ZlmA&s",
  "https://d1vbn70lmn1nqe.cloudfront.net/prod/wp-content/uploads/2025/03/11082616/5-Resep-Nasi-Goreng-Sederhana-hingga-Spesial-Mudah-dan-Praktis.jpg",
  "https://www.preciouscore.com/wp-content/uploads/2024/06/Spaghetti-Bolognese-Chicken.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxbeTrexIYpCCSK6QSKlS283rUBtdQ7hpjIw&s",
  "https://islandsunindonesia.com/wp-content/uploads/2022/01/espresso.jpg",
  "https://rri-portal-app-assets.obs.ap-southeast-4.myhuaweicloud.com/upload/berita/image/bukittinggi/1777464925702232_8da3810820_berita_bukittinggi.webp",
  "https://awsimages.detik.net.id/community/media/visual/2022/11/15/sama-sama-kopi-hitam-apa-bedanya-americano-long-black-dan-kopi-tubruk_169.jpeg?w=600&q=90",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKslKWi8UpfQ5JgRvXS9Nx6-oxvsOuGckjJg&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTQdGZiR3vS7PS4CxexJkZ_sGJvCC349BRzw&s"
];
