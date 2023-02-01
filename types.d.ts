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
    registered_at: Date;
}

export interface ApiRecord extends Record {
    id: number;
}