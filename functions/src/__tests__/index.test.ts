import { getTrafficData, addTrafficData, updateTrafficData, deleteTrafficData } from '../index';
import { mockFirestore, mockAuth } from '../test/setup';

describe('Cloud Functions', () => {
  let mockRequest: any;
  let mockResponse: any;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create mock request and response
    mockRequest = {
      method: 'GET',
      headers: {
        authorization: 'Bearer valid-token',
      },
      body: {},
      params: {},
      query: {},
      rawBody: Buffer.from('{}'),
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      set: jest.fn(),
      end: jest.fn(),
    };

    // Reset mocks to default values
    mockAuth.verifyIdToken.mockResolvedValue({ uid: 'test-user-id' });
  });

  describe('getTrafficData', () => {
    it('should return traffic data for authenticated user', async () => {
      // Mock successful authentication
      mockAuth.verifyIdToken.mockResolvedValue({ uid: 'test-user-id' });

      // Mock Firestore query with correct forEach implementation
      const mockSnapshot = {
        forEach: jest.fn((callback) => {
          callback({
            id: 'doc1',
            data: () => ({ date: '2025-03-01', visits: 120 }),
          });
          callback({
            id: 'doc2',
            data: () => ({ date: '2025-03-02', visits: 140 }),
          });
        }),
      };

      // Configure the mock chain properly
      (mockFirestore.collection as any).mockReturnValue({
        orderBy: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue(mockSnapshot)
        })
      });

      await getTrafficData(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: [
          { id: 'doc1', date: '2025-03-01', visits: 120 },
          { id: 'doc2', date: '2025-03-02', visits: 140 },
        ],
        message: 'Retrieved 2 shared traffic entries',
      });
    });

    it('should return 401 for unauthenticated user', async () => {
      mockAuth.verifyIdToken.mockRejectedValue(new Error('Invalid token'));

      await getTrafficData(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Unauthorized',
      });
    });

    it('should handle CORS preflight request', async () => {
      mockRequest.method = 'OPTIONS';

      await getTrafficData(mockRequest, mockResponse);

      expect(mockResponse.set).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.end).toHaveBeenCalled();
    });

    it('should reject non-GET requests', async () => {
      mockRequest.method = 'POST';

      await getTrafficData(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(405);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Method not allowed',
      });
    });
  });

  describe('addTrafficData', () => {
    beforeEach(() => {
      mockRequest.method = 'POST';
      mockRequest.body = { date: '2025-03-01', visits: 120 };
    });

    it('should create new traffic entry', async () => {
      mockAuth.verifyIdToken.mockResolvedValue({ uid: 'test-user-id' });

      // Mock no existing entry
      (mockFirestore.collection as any).mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            get: jest.fn().mockResolvedValue({ empty: true })
          })
        }),
        add: jest.fn().mockResolvedValue({ id: 'new-doc-id' })
      });

      await addTrafficData(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          id: 'new-doc-id',
          date: '2025-03-01',
          visits: 120,
        }),
        message: 'Shared traffic entry created successfully',
      });
    });

    it('should reject invalid date format', async () => {
      mockAuth.verifyIdToken.mockResolvedValue({ uid: 'test-user-id' });
      mockRequest.body = { date: 'invalid-date', visits: 120 };

      await addTrafficData(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid date format. Required format: YYYY-MM-DD (e.g., "2025-03-01")',
      });
    });

    it('should reject invalid visits value', async () => {
      mockAuth.verifyIdToken.mockResolvedValue({ uid: 'test-user-id' });
      mockRequest.body = { date: '2025-03-01', visits: -1 };

      await addTrafficData(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid visits value. Must be an integer between 0 and 1,000,000',
      });
    });

    it('should reject duplicate date', async () => {
      mockAuth.verifyIdToken.mockResolvedValue({ uid: 'test-user-id' });

      // Mock existing entry - Configure for THIS test specifically
      (mockFirestore.collection as any).mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            get: jest.fn().mockResolvedValue({ empty: false }) // ✅ Changed to false
          })
        })
      });

      await addTrafficData(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Traffic entry for this date already exists',
      });
    });
  });

  describe('updateTrafficData', () => {
    beforeEach(() => {
      mockRequest.method = 'PUT';
      mockRequest.query = { id: 'existing-doc-id' };
      mockRequest.body = { date: '2025-03-01', visits: 150 };
    });

    it('should update existing traffic entry', async () => {
      mockAuth.verifyIdToken.mockResolvedValue({ uid: 'test-user-id' });

      // Mock existing document and no conflict
      (mockFirestore.collection as any).mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({
            exists: true,
            data: () => ({ date: '2025-03-01', visits: 120 })
          }),
          update: jest.fn().mockResolvedValue({})
        }),
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            get: jest.fn().mockResolvedValue({ empty: true })
          })
        })
      });

      await updateTrafficData(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          id: 'existing-doc-id',
          date: '2025-03-01',
          visits: 150,
        }),
        message: 'Shared traffic entry updated successfully',
      });
    });

    it('should return 404 for non-existent entry', async () => {
      mockAuth.verifyIdToken.mockResolvedValue({ uid: 'test-user-id' });

      // Mock non-existent document - Configure for THIS test specifically
      (mockFirestore.collection as any).mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({ exists: false }) // ✅ Changed to false
        })
      });

      await updateTrafficData(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Traffic entry not found',
      });
    });

    it('should require entry ID', async () => {
      mockAuth.verifyIdToken.mockResolvedValue({ uid: 'test-user-id' });
      mockRequest.query = {}; // No ID provided

      await updateTrafficData(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Entry ID required',
      });
    });
  });

  describe('deleteTrafficData', () => {
    beforeEach(() => {
      mockRequest.method = 'DELETE';
      mockRequest.query = { id: 'existing-doc-id' };
    });

    it('should delete existing traffic entry', async () => {
      mockAuth.verifyIdToken.mockResolvedValue({ uid: 'test-user-id' });

      // Mock existing document
      (mockFirestore.collection as any).mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({ exists: true }),
          delete: jest.fn().mockResolvedValue({})
        })
      });

      await deleteTrafficData(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Shared traffic entry deleted successfully',
      });
    });

    it('should return 404 for non-existent entry', async () => {
      mockAuth.verifyIdToken.mockResolvedValue({ uid: 'test-user-id' });

      // Mock non-existent document - Configure for THIS test specifically
      (mockFirestore.collection as any).mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({ exists: false }) 
        })
      });

      await deleteTrafficData(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Traffic entry not found',
      });
    });

    it('should require entry ID', async () => {
      mockAuth.verifyIdToken.mockResolvedValue({ uid: 'test-user-id' });
      mockRequest.query = {}; // No ID provided

      await deleteTrafficData(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Entry ID required',
      });
    });
  });
}); 