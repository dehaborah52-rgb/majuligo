import test from 'node:test';
import assert from 'node:assert/strict';
import { createBackendServer } from './server.js';

test('Fastify server starts and serves /health', async () => {
  const app = await createBackendServer();
  await app.ready();

  const response = await app.inject({
    method: 'GET',
    url: '/health',
  });

  assert.equal(response.statusCode, 200);
  const body = JSON.parse(response.body);
  assert.equal(body.status, 'ok');
  assert.equal(body.service, 'MajuliGo API Backend');

  await app.close();
});

test('Fastify server returns brand info at /api/v1/info', async () => {
  const app = await createBackendServer();
  await app.ready();

  const response = await app.inject({
    method: 'GET',
    url: '/api/v1/info',
  });

  assert.equal(response.statusCode, 200);
  const body = JSON.parse(response.body);
  assert.equal(body.brand, 'MajuliGo');

  await app.close();
});

test('Auth route handles OTP request and verification', async () => {
  const app = await createBackendServer();
  await app.ready();

  // Send OTP
  const sendRes = await app.inject({
    method: 'POST',
    url: '/api/v1/auth/send-otp',
    payload: {
      phone: '9876543210',
    },
  });
  assert.equal(sendRes.statusCode, 200);
  const sendBody = JSON.parse(sendRes.body);
  assert.equal(sendBody.success, true);
  assert.equal(sendBody.devOtpHint, '123456');

  // Verify OTP
  const verifyRes = await app.inject({
    method: 'POST',
    url: '/api/v1/auth/verify-otp',
    payload: {
      phone: '9876543210',
      otp: '123456',
    },
  });
  assert.equal(verifyRes.statusCode, 200);
  const verifyBody = JSON.parse(verifyRes.body);
  assert.equal(verifyBody.success, true);
  assert.ok(verifyBody.token);

  await app.close();
});

test('Rides route estimates fare between two points', async () => {
  const app = await createBackendServer();
  await app.ready();

  const response = await app.inject({
    method: 'POST',
    url: '/api/v1/rides/estimate-fare',
    payload: {
      pickup: {
        latitude: 26.8872,
        longitude: 94.1843,
        name: 'Kamalabari Ghat',
      },
      destination: {
        latitude: 26.9634,
        longitude: 94.2181,
        name: 'Garamur Satra',
      },
    },
  });

  assert.equal(response.statusCode, 200);
  const body = JSON.parse(response.body);
  assert.equal(body.success, true);
  assert.ok(body.fare.totalFare > 0);
  assert.equal(body.fare.currency, '₹');

  await app.close();
});
