import { read } from 'fs';
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
        cta: "Learn More",
        bio: "Food Engineer specialized in beverage formulation and R&D. From laboratory analysis to industrial scale-up, I bridge the gap between scientific innovation and sensory delight."
      },
      nav: {
        journey: "About Me",
        blog: "Lab Journal",
        contact: "Contact",
        back: "Go back"
      },
      journey: {
        title: "My Journey",
        specs_label: "Technical Profile",
        read_more: "Read more",
        read_less: "Close"
      },
      blog: {
        title: "Lab Journal",
        read_more: "Read More",
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
        description: "Moleküler mühendislik ve duyusal bilim yoluyla içeceklerin geleceğini tasarlıyor.",
        cta: "Daha Fazla Bilgi",
        bio: "İçecek formülasyonu ve Ar-Ge alanında uzmanlaşmış Gıda Mühendisi. Laboratuvar analizlerinden endüstriyel ölçekli üretime, bilimsel yenilik ile duyusal zevk arasında köprü kuruyorum."
      },
      nav: {
        journey: "Hakkımda",
        blog: "Laboratuvar Günlüğü",
        contact: "İletişim",
        back: "Geri Dön"
      },
      journey: {
        title: "Yolculuğum",
        specs_label: "Teknik Profil",
        read_more: "Devamını Oku",
        read_less: "Kapat"
      },
      blog: {
        title: "Laboratuvar Günlüğü",
        read_more: "Devamını Oku",
        archiveIntro: "Formülasyon raporları ve gıda mühendisliği araştırmalarının tamamı içeren teknik arşiv."
      },
      contact: {
        title: "Bana Ulaşın",
        name: "Adınız",
        email: "E-posta",
        message: "Mesajınız",
        send: "Talebi Gönder",
        success: "Veriler başarıyla iletildi."
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