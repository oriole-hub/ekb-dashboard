export const mockAPI = {
  getLibraryInfo: async () => {
    return {
      name: 'Библиотека №14',
      address: 'ул. Свердлова, 25, Екатеринбург, Свердловская обл., 620027',
      workHours: 'Суббота: 10:00–18:00\nВоскресенье: Закрыто\nПонедельник: Закрыто\nВторник: 10:00–14:00, 15:00–19:00\nСреда: 10:00–14:00, 15:00–19:00\nЧетверг: 10:00–14:00, 15:00–19:00\nПятница: 10:00–14:00, 15:00–19:00',
      phone: '8 (343) 353-29-07',
    };
  },

  getStatsSummary: async () => {
    return {
      totalBooks: 12847,
      activeLoans: 342,
      totalUsers: 2156,
      overdueLoans: 23,
      booksAvailable: 10342,
      newBooksThisMonth: 147,
    };
  },

  getActivityStats: async (fromDate, toDate) => {
    const data = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        issued: Math.floor(Math.random() * 30) + 10,
        returned: Math.floor(Math.random() * 25) + 8,
      });
    }
    
    return data;
  },

  getEvents: async () => {
    return [
      {
        id: '1',
        title: 'Литературный вечер: Современная поэзия',
        description: 'Встреча с местными поэтами и обсуждение современных течений в поэзии',
        date: '2025-12-01T18:00:00',
        location: 'Большой зал',
        capacity: 50,
        registered: 32,
      },
      {
        id: '2',
        title: 'Мастер-класс по книжному переплету',
        description: 'Практический курс по восстановлению и реставрации книг',
        date: '2025-12-05T15:00:00',
        location: 'Мастерская',
        capacity: 15,
        registered: 15,
      },
      {
        id: '3',
        title: 'Детский книжный клуб',
        description: 'Чтение и обсуждение классических сказок для детей 6-10 лет',
        date: '2025-12-08T11:00:00',
        location: 'Детский отдел',
        capacity: 20,
        registered: 18,
      },
    ];
  },

  createEvent: async (eventData) => {
    return {
      id: Date.now().toString(),
      ...eventData,
      registered: 0,
    };
  },

  updateEvent: async (eventId, eventData) => {
    return {
      id: eventId,
      ...eventData,
    };
  },

  deleteEvent: async (eventId) => {
    return { success: true, id: eventId };
  },
};


