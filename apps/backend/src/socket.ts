import { Server, Socket } from 'socket.io';
import { SOCKET_EVENTS, LocationUpdateSchema } from '@majuligo/shared';

export function setupSocketServer(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Client connected: [${socket.id}]`);

    // Handle authentication / role assignment
    socket.on(SOCKET_EVENTS.AUTHENTICATE, (data: { userId: string; role: string }) => {
      socket.data.userId = data.userId;
      socket.data.role = data.role;
      socket.join(`user:${data.userId}`);
      if (data.role === 'CAPTAIN') {
        socket.join('captains:online');
      }
      console.log(`Authenticated socket [${socket.id}] as ${data.role} (${data.userId})`);
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

      // Broadcast to room of active ride or nearby searchers
      io.emit(SOCKET_EVENTS.CAPTAIN_STATE_CHANGED, update);
    });

    // Handle Captain Toggle Online
    socket.on(SOCKET_EVENTS.CAPTAIN_TOGGLE_ONLINE, (data: { isOnline: boolean }) => {
      if (data.isOnline) {
        socket.join('captains:online');
      } else {
        socket.leave('captains:online');
      }
      console.log(`Captain [${socket.data.userId || socket.id}] is now online=${data.isOnline}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: [${socket.id}]`);
    });
  });
}
