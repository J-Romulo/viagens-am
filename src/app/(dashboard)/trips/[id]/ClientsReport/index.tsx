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
import { getRoomTypeDisplayName } from '../../../../../utils/text';
import { RoomType } from '../../../../../@types/Trip';

// Define styles using the application's color scheme
const styles = StyleSheet.create({
  page: {
    padding: 36,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: '#4f46e5',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
    objectFit: 'contain',
    borderRadius: 4,
    backgroundColor: '#eef2ff',
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#18181b',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 10,
    color: '#71717a',
  },
  roomSummary: {
    flexDirection: 'row',
    backgroundColor: '#4f46e5',
    borderRadius: 6,
    padding: 14,
    marginBottom: 20,
  },
  roomCountColumn: {
    flex: 1,
    alignItems: 'center',
  },
  roomCountTitle: {
    fontSize: 7,
    color: '#c7d2fe',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  roomCountValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  roomTypeSectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#4f46e5',
    marginBottom: 6,
    marginTop: 16,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#6366f1',
  },
  roomTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#6366f1',
    marginTop: 10,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  clientCard: {
    backgroundColor: '#f5f3ff',
    padding: 9,
    marginBottom: 3,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#6366f1',
  },
  clientName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#18181b',
    marginBottom: 4,
  },
  clientDetail: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  clientDetailLabel: {
    fontWeight: 'bold',
    width: 75,
    color: '#6366f1',
    fontSize: 8,
  },
  clientDetailValue: {
    flex: 1,
    color: '#52525b',
    fontSize: 8,
  },
  emptyRoom: {
    color: '#a1a1aa',
    fontStyle: 'italic',
    fontSize: 9,
    marginBottom: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 36,
    right: 36,
    textAlign: 'center',
    color: '#a1a1aa',
    fontSize: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e4e4e7',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 36,
    fontSize: 9,
    color: '#a1a1aa',
  },
});

// Format date to Brazilian format DD/MM/YYYY
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('pt-BR');
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
              {getRoomTypeDisplayName(roomType as RoomType)} ({rooms.length})
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
                  {getRoomTypeDisplayName(type as RoomType)}
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
