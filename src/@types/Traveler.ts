import { Trip } from './Trip';

export type Traveler = {
  _id: string;
  user_id: string;
  full_name: string;
  cpf: string;
                                    rg: string;
                                    birth_date: Date;
                                    email?: string;
                                    phone?: string;
                                    trips?: Trip[];
                                    created_at: Date;
                                    updated_at: Date;
};
