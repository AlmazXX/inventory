declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPRESS_PORT: number;
      MYSQL_HOST: string;
      MYSQL_USER: string;
      MYSQL_PASSWORD: string;
      MYSQL_DATABASE: string;
    }
  }
}

export interface Category {
  title: string;
  description: string;
}

export interface ApiCategory extends Category {
  id: number;
}

export interface Location {
  title: string;
  description: string;
}

export interface ApiLocation extends Location {
  id: number;
}

export interface Record {
  title: string;
  category_id: number;
  location_id: number;
  description: string;
  image: string | null;
}

export interface ApiRecord extends Record {
  id: number;
  registered_at: string;
}