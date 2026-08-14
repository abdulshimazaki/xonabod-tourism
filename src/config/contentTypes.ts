import type { ContentTypeKey } from "../types/content";

export type ExtraFieldDef = {
  key: string;
  label: string;
  type: "text" | "number" | "textarea" | "boolean" | "select";
  options?: string[];
  placeholder?: string;
};

export type ContentTypeConfig = {
  key: ContentTypeKey;
  table: string;
  urlSlug: string; // public URL segment, e.g. /dam-olish-maskanlari
  navLabel: string;
  singularLabel: string;
  pluralLabel: string;
  addLabel: string; // "+ Yangi qo'shish" button context
  description: string;
  mapColor: string; // hex used for map marker + badges
  mapEmoji: string;
  categoryOptions?: string[]; // sub-category dropdown, e.g. Mehmonxona/Hostel
  amenityOptions: string[];
  extraFields: ExtraFieldDef[];
};

export const CONTENT_TYPES: Record<ContentTypeKey, ContentTypeConfig> = {
  recreation_places: {
    key: "recreation_places",
    table: "recreation_places",
    urlSlug: "dam-olish-maskanlari",
    navLabel: "Dam olish maskanlari",
    singularLabel: "Dam olish maskani",
    pluralLabel: "Dam olish maskanlari",
    addLabel: "+ Yangi dam olish maskani qo'shish",
    description:
      "Xonabod atrofidagi tabiat qo'ynidagi dam olish va hordiq maskanlari.",
    mapColor: "#2E6B57",
    mapEmoji: "🟢",
    amenityOptions: ["Wi-Fi", "Avtoturargoh", "Oshxona", "Bolalar maydonchasi", "Basseyn", "Mangal joyi"],
    extraFields: [
      { key: "capacity", label: "Sig'imi (kishi)", type: "number" },
    ],
  },
  sanatoriums: {
    key: "sanatoriums",
    table: "sanatoriums",
    urlSlug: "sanatoriyalar",
    navLabel: "Sanatoriyalar",
    singularLabel: "Sanatoriya",
    pluralLabel: "Sanatoriyalar",
    addLabel: "+ Yangi sanatoriya qo'shish",
    description: "Davolanish va sog'lomlashtirish uchun sanatoriyalar.",
    mapColor: "#1F6FEB",
    mapEmoji: "🔵",
    amenityOptions: ["Wi-Fi", "Avtoturargoh", "Basseyn", "Sport zal", "Restoran"],
    extraFields: [
      { key: "treatment_directions", label: "Davolash yo'nalishlari", type: "textarea", placeholder: "Masalan: mineral suvlar, balchiq terapiyasi" },
    ],
  },
  dachas: {
    key: "dachas",
    table: "dachas",
    urlSlug: "dachalar",
    navLabel: "Dachalar",
    singularLabel: "Dacha",
    pluralLabel: "Dachalar",
    addLabel: "+ Yangi dacha qo'shish",
    description: "Oilaviy va guruh bo'lib dam olish uchun dachalar.",
    mapColor: "#E0B429",
    mapEmoji: "🟡",
    amenityOptions: ["Basseyn", "Barbekyu", "Wi-Fi", "Avtoturargoh", "Oshxona", "Sanuzel"],
    extraFields: [
      { key: "guest_count", label: "Mehmonlar soni", type: "number" },
      { key: "room_count", label: "Xonalar soni", type: "number" },
      { key: "bed_count", label: "Yotoq joylari", type: "number" },
    ],
  },
  restaurants: {
    key: "restaurants",
    table: "restaurants",
    urlSlug: "restoranlar",
    navLabel: "Restoranlar",
    singularLabel: "Restoran",
    pluralLabel: "Restoranlar",
    addLabel: "+ Yangi restoran qo'shish",
    description: "Milliy va zamonaviy taomlar tortiladigan restoranlar.",
    mapColor: "#E08A2B",
    mapEmoji: "🟠",
    categoryOptions: ["Milliy taomlar", "Fast-food", "Yevropa oshxonasi", "Choyxona", "Boshqa"],
    amenityOptions: ["Wi-Fi", "Avtoturargoh", "Bolalar xonasi", "Ochiq terassa"],
    extraFields: [
      { key: "cuisine_type", label: "Oshxona turi", type: "text" },
      { key: "average_check", label: "O'rtacha chek (so'm)", type: "text" },
      { key: "menu_url", label: "Menyu (rasm/PDF havolasi)", type: "text" },
    ],
  },
  accommodations: {
    key: "accommodations",
    table: "accommodations",
    urlSlug: "joylashish-vositalari",
    navLabel: "Joylashish vositalari",
    singularLabel: "Joylashish vositasi",
    pluralLabel: "Joylashish vositalari",
    addLabel: "+ Yangi joylashish vositasini qo'shish",
    description: "Mehmonxona, gostxaus va boshqa turar joylar.",
    mapColor: "#8E5CD9",
    mapEmoji: "🟣",
    categoryOptions: ["Mehmonxona", "Guest House", "Hostel", "Oilaviy mehmon uyi", "Boshqa"],
    amenityOptions: ["Wi-Fi", "Avtoturargoh", "Nonushta", "Konditsioner", "Basseyn"],
    extraFields: [
      { key: "room_count", label: "Xona soni", type: "number" },
    ],
  },
  attractions: {
    key: "attractions",
    table: "attractions",
    urlSlug: "diqqatga-sazovor-joylar",
    navLabel: "Diqqatga sazovor joylar",
    singularLabel: "Diqqatga sazovor joy",
    pluralLabel: "Diqqatga sazovor joylar",
    addLabel: "+ Yangi obyekt qo'shish",
    description: "Xonabodning tarixiy, tabiiy va madaniy diqqatga sazovor joylari.",
    mapColor: "#B5502F",
    mapEmoji: "🔴",
    categoryOptions: ["Tarixiy obidalar", "Tabiiy maskanlar", "Ziyoratgohlar", "Madaniy obyektlar", "Bog'lar", "Sayr qilish joylari"],
    amenityOptions: [],
    extraFields: [
      { key: "history", label: "Tarix", type: "textarea" },
      { key: "visit_tips", label: "Tashrif uchun tavsiyalar", type: "textarea" },
    ],
  },
};

export const CONTENT_TYPE_LIST = Object.values(CONTENT_TYPES);

export function getContentTypeByUrlSlug(slug: string): ContentTypeConfig | undefined {
  return CONTENT_TYPE_LIST.find((c) => c.urlSlug === slug);
}
