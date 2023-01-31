export interface Category {
    id: number;
    title: string;
    description: string;
}

export interface Location {
    id: number;
    title: string;
    description: string;
}

export interface Record {
    id: number;
    category_id: number;
    location_id: number;
    title: string;
    description: string;
    image: string | null;
}