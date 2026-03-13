import { RoomType } from '../@types/Trip';

export function getRoomTypeDisplayName(type: RoomType): string {
  switch (type) {
    case 'doubleCouple':
      return 'Quarto Duplo (Casal)';
    case 'doubleSingle':
      return 'Quarto Duplo (Solteiro)';
    case 'triple':
      return 'Quarto Triplo';
    default:
      return '';
  }
}
