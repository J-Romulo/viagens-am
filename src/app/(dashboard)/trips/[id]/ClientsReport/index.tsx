import { toast } from 'react-toastify';
import { Trip } from '../../../../../@types/Trip';
import {
  Document,
  pdf,
  Page,
  StyleSheet,
  View,
  Text,
  Image,
} from '@react-pdf/renderer';
import { ReactNode } from 'react';
import { User } from '../../../../../@types/User';
import AMLogo from '../../../../../assets/am-logo.png';

// Define styles using the application's color scheme
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#f8fafc', // light bg
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#4f46e5', // --color-primary-500
    paddingBottom: 15,
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 15,
    objectFit: 'contain',
    borderRadius: '50px',
    backgroundColor: 'white',
    opacity: 1,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27272a', // --color-neutral-600
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#52525b', // --color-neutral-500
    marginBottom: 2,
  },
  roomSummary: {
    flexDirection: 'row',
    backgroundColor: '#f4f4f5', // --color-neutral-100
    padding: 8,
    borderRadius: 4,
    marginBottom: 20,
    marginTop: 10,
  },
  roomCountColumn: {
    flex: 1,
  },
  roomCountTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#3730a3', // --color-primary-600
    marginBottom: 6,
  },
  roomCountValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4f46e5', // --color-primary-500
  },
  roomTypeSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4f46e5', // --color-primary-500
    marginBottom: 12,
    marginTop: 20,
    backgroundColor: '#eef2ff', // Lighter primary
    padding: 8,
    borderRadius: 4,
  },
  roomTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3730a3', // --color-primary-600
    marginTop: 12,
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#a5b4fc', // --color-primary-300
  },
  clientCard: {
    backgroundColor: '#e4e4e7', // --color-neutral-200
    padding: 12,
    marginBottom: 12,
    borderRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#6366f1', // --color-primary-400
  },
  clientName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#27272a', // --color-neutral-600
    marginBottom: 8,
  },
  clientDetail: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  clientDetailLabel: {
    fontWeight: 'bold',
    width: 85,
    color: '#52525b', // --color-neutral-500
    fontSize: 9,
  },
  clientDetailValue: {
    flex: 1,
    color: '#52525b', // --color-neutral-500
    fontSize: 11,
  },
  emptyRoom: {
    color: '#71717a', // --color-neutral-500
    fontStyle: 'italic',
    fontSize: 10,
    marginBottom: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#a1a1aa', // --color-neutral-400
    fontSize: 8,
    paddingTop: 10,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    fontSize: 10,
    color: '#a1a1aa', // --color-neutral-400
  },
});

// Format date to Brazilian format DD/MM/YYYY
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

// Get room type display name
const getRoomTypeDisplayName = (type: string): string => {
  switch (type) {
    case 'doubleCouple':
      return 'Quarto Duplo (Casal)';
    case 'doubleSingle':
      return 'Quarto Duplo (Solteiro)';
    case 'triple':
      return 'Quarto Triplo';
    default:
      return 'Outro Tipo de Quarto';
  }
};

// Function to fetch and convert an image to Base64
const fetchImageAsBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
};

export function ClientsReport() {
  async function handleGeneratePDF(trip: Trip, user?: User) {
    try {
      const PDFGenerated = await generatePDFContent(trip, user);

      const blob = await pdf(PDFGenerated).toBlob();

      // Create a temporary URL for the blob
      const url = URL.createObjectURL(blob);

      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `Viagem_${trip.city}_${trip.uf}.pdf`;

      // Simulate a click event to trigger the download
      link.dispatchEvent(new MouseEvent('click'));

      // Clean up the temporary URL
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error(
        'Ocorreu um erro ao tentar gerar o arquivo de relatório. Tente novamente.'
      );
    }
  }

  // Calculate room statistics
  const getRoomStatistics = (trip: Trip) => {
    if (!trip.rooms) return { totalRooms: 0, roomTypes: {}, totalTravelers: 0 };

    const stats = {
      totalRooms: 0,
      roomTypes: {} as Record<string, number>,
      totalTravelers: 0,
    };

    // Count rooms by type and total travelers
    Object.entries(trip.rooms).forEach(([type, rooms]) => {
      if (Array.isArray(rooms)) {
        stats.totalRooms += rooms.length;
        stats.roomTypes[type] = rooms.length;

        // Count travelers in this room type
        rooms.forEach((room) => {
          if (Array.isArray(room.travelers)) {
            stats.totalTravelers += room.travelers.length;
          }
        });
      }
    });

    return stats;
  };

  async function generatePDFContent(trip: Trip, user?: User) {
    // Prepare avatar image - fetch user avatar if available
    let avatarImage = AMLogo.src;

    if (user?.avatar) {
      try {
        const avatarUrl = `${process.env.NEXT_PUBLIC_API_URL}/images/avatars/${user.avatar}`;
        avatarImage = await fetchImageAsBase64(avatarUrl);
      } catch {
        avatarImage = AMLogo.src;
      }
    }

    const roomStats = getRoomStatistics(trip);

    // Create an array to ensure react-pdf renders efficiently
    const roomsContent: ReactNode[] = [];

    if (trip.rooms) {
      Object.entries(trip.rooms).forEach(([roomType, rooms]) => {
        if (Array.isArray(rooms) && rooms.length > 0) {
          // Add room type section title
          roomsContent.push(
            <Text key={`type-${roomType}`} style={styles.roomTypeSectionTitle}>
              {getRoomTypeDisplayName(roomType)} ({rooms.length})
            </Text>
          );

          // Add each room and its travelers
          rooms.forEach((room, index) => {
            roomsContent.push(
              <View key={`room-${roomType}-${room.id}`} wrap={false}>
                <Text style={styles.roomTitle}>Quarto #{index + 1}</Text>

                {!room.travelers || room.travelers.length === 0 ? (
                  <Text style={styles.emptyRoom}>
                    Nenhum cliente neste quarto.
                  </Text>
                ) : (
                  room.travelers.map((traveler, idx) => (
                    <View
                      style={styles.clientCard}
                      key={`traveler-${room.id}-${idx}`}
                    >
                      <Text style={styles.clientName}>
                        {traveler.full_name}
                      </Text>

                      <View style={styles.clientDetail}>
                        <Text style={styles.clientDetailLabel}>CPF:</Text>
                        <Text style={styles.clientDetailValue}>
                          {traveler.cpf}
                        </Text>
                      </View>

                      {traveler.rg && (
                        <View style={styles.clientDetail}>
                          <Text style={styles.clientDetailLabel}>RG:</Text>
                          <Text style={styles.clientDetailValue}>
                            {traveler.rg}
                          </Text>
                        </View>
                      )}

                      {traveler.birth_date && (
                        <View style={styles.clientDetail}>
                          <Text style={styles.clientDetailLabel}>
                            Nascimento:
                          </Text>
                          <Text style={styles.clientDetailValue}>
                            {formatDate(traveler.birth_date)}
                          </Text>
                        </View>
                      )}

                      {traveler.email && (
                        <View style={styles.clientDetail}>
                          <Text style={styles.clientDetailLabel}>Email:</Text>
                          <Text style={styles.clientDetailValue}>
                            {traveler.email}
                          </Text>
                        </View>
                      )}

                      {traveler.phone && (
                        <View style={styles.clientDetail}>
                          <Text style={styles.clientDetailLabel}>
                            Telefone:
                          </Text>
                          <Text style={styles.clientDetailValue}>
                            {traveler.phone}
                          </Text>
                        </View>
                      )}
                    </View>
                  ))
                )}
              </View>
            );
          });
        }
      });
    }

    return (
      <Document>
        <Page size='A4' style={styles.page}>
          {/* Header with Logo */}
          <View style={styles.header} fixed>
            <Image src={avatarImage} style={styles.logo} />
            <View style={styles.headerInfo}>
              <Text style={styles.title}>
                Viagem - {trip.city}/{trip.uf}
              </Text>
              <Text style={styles.subtitle}>
                Relatório de quartos e hóspedes
              </Text>
            </View>
          </View>

          {/* Room Summary */}
          <View style={styles.roomSummary}>
            {Object.entries(roomStats.roomTypes).map(([type, count]) => (
              <View style={styles.roomCountColumn} key={type}>
                <Text style={styles.roomCountTitle}>
                  {getRoomTypeDisplayName(type)}
                </Text>
                <Text style={styles.roomCountValue}>{count}</Text>
              </View>
            ))}
            <View style={styles.roomCountColumn}>
              <Text style={styles.roomCountTitle}>Total de hóspedes</Text>
              <Text style={styles.roomCountValue}>
                {roomStats.totalTravelers}
              </Text>
            </View>
          </View>

          {roomsContent.length > 0 ? (
            roomsContent
          ) : (
            <Text style={styles.emptyRoom}>Nenhum quarto cadastrado.</Text>
          )}

          {/* Footer with page number */}
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} de ${totalPages}`
            }
            fixed
          />

          <Text style={styles.footer} fixed>
            Relatório gerado em {new Date().toLocaleDateString('pt-BR')} às{' '}
            {new Date().toLocaleTimeString('pt-BR')}
          </Text>
        </Page>
      </Document>
    );
  }

  return {
    generatePDF: handleGeneratePDF,
  };
}
