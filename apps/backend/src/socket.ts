import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { SOCKET_EVENTS, LocationUpdateSchema } from '@majuligo/shared';

let ioInstance: Server | null = null;

export function initSocketServer(server: HttpServer): Server {
  if (!ioInstance) {
    ioInstance = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    setupSocketServer(ioInstance);
  }
  return ioInstance;
}

export function emitRideEvent(event: string, data: any) {
  if (ioInstance) {
    ioInstance.emit(event, data);
  }
}

export function setupSocketServer(io: Server) {
  io.on('connection', (socket: Socket) => {
    // Handle authentication / role assignment
    socket.on(SOCKET_EVENTS.AUTHENTICATE, (data: { userId: string; role: string }) => {
      socket.data.userId = data.userId;
      socket.data.role = data.role;
      socket.join(`user:${data.userId}`);
      if (data.role === 'CAPTAIN') {
        socket.join('captains:online');
      }
    });

    // Handle Captain Location Updates
    socket.on(SOCKET_EVENTS.CAPTAIN_LOCATION_UPDATE, (payload: unknown) => {
      const parsed = LocationUpdateSchema.safeParse(payload);
      if (!parsed.success) {
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Invalid location payload' });
        return;
      }

      const update = {
        captainId: socket.data.userId || 'unknown',
        ...parsed.data,
        timestamp: Date.now(),
      };

      io.emit(SOCKET_EVENTS.CAPTAIN_STATE_CHANGED, update);
    });

    // Handle Captain Toggle Online
    socket.on(SOCKET_EVENTS.CAPTAIN_TOGGLE_ONLINE, (data: { isOnline: boolean }) => {
      if (data.isOnline) {
        socket.join('captains:online');
      } else {
        socket.leave('captains:online');
      }
    });
  });
}
