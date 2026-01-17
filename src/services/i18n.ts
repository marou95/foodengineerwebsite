import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Define resources
const resources = {
  en: {
    translation: {
      hero: {
        title: "Melisa Mumcu",
        role: "Food Engineer.",
        description: "Designing the future of beverages through molecular engineering and sensory science.",
        cta: "Explore Portfolio",
        bio: "Food Engineer specialized in beverage formulation and R&D. From laboratory analysis to industrial scale-up, I bridge the gap between scientific innovation and sensory delight."
      },
      nav: {
        portfolio: "Formulations",
        blog: "Lab Notes",
        contact: "Contact",
        back: "Go back"
      },
      portfolio: {
        title: "Selected Formulations",
        specs_label: "Technical Profile",
        ph: "pH Level",
        brix: "Brix",
        ingredients: "Key Notes"
      },
      blog: {
        title: "Lab Journal",
        read_more: "Read Analysis",
        archiveIntro: "Complete technical archive of formulation reports and food engineering research."
      },
      contact: {
        title: "Contact Me",
        name: "Name",
        email: "Email",
        message: "Your Message",
        send: "Transmit Request",
        success: "Data transmitted successfully."
      }
    }
  },
  tr: {
    translation: {
      hero: {
        title: "Melisa Mumcu",
        role: "Gıda Mühendisi.",
        description: "Moleküler mühendislik ve duyusal bilim ile içeceklerin geleceğini tasarlıyoruz.",
        cta: "Portfolyoyu Keşfet",
        bio: "İçecek formülasyonu ve Ar-Ge konusunda uzmanlaşmış Gıda Mühendisi. Laboratuvar analizinden endüstriyel ölçeklendirmeye kadar, bilimsel yenilik ile duyusal zevk arasında köprü kuruyorum."
      },
      nav: {
        portfolio: "Formülasyonlar",
        blog: "Lab Notları",
        contact: "İletişim",
        back: "Geri Dön"
      },
      portfolio: {
        title: "Seçilmiş Formülasyonlar",
        specs_label: "Teknik Profil",
        ph: "pH Seviyesi",
        brix: "Brix Değeri",
        ingredients: "Ana Notalar"
      },
      blog: {
        title: "Lab Günlüğü",
        read_more: "Analizi Oku",
        archiveIntro: "Formülasyon raporları ve gıda mühendisliği araştırmalarının tam teknik arşivi."
      },
      contact: {
        title: "Bana yazın",
        name: "İsim",
        email: "E-posta",
        message: "Mesajınız",
        send: "İsteği İlet",
        success: "Veri başarıyla iletildi."
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // Default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;