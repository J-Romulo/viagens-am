import { Traveler } from "./Traveler";

export type Trip = {
    _id: string;
    user_id: string;
    city: string;
    uf: string;
    hotel: string;
    start_date: Date;
    finish_date: Date;
    individual_price: number;
    expected_clients?: number;
    clients?: Traveler[];
    created_at: Date;
    updated_at: Date;
}