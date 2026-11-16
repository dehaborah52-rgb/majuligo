import test from 'node:test';
import assert from 'node:assert/strict';
import { buildServer } from './server.js';
import { generateAccessToken, verifyAuthToken } from './auth/jwt.js';
import { UserRole } from '@majuligo/shared';

test('Fastify server starts and serves /health', async () => {
  const { app } = buildServer();
  const response = await app.inject({
    method: 'GET',
    url: '/health',
  });

  assert.equal(response.statusCode, 200);
  const json = JSON.parse(response.body);
  assert.equal(json.status, 'ok');
  assert.equal(json.service, 'MajuliGo API Backend');
});

test('JWT signing and verification works as expected', async () => {
  const token = await generateAccessToken({
    userId: 'usr_test_123',
    phoneNumber: '+919876543210',
    role: UserRole.RIDER,
  });

  assert.ok(token);
  assert.equal(typeof token, 'string');

  const verified = await verifyAuthToken(token);
  assert.ok(verified);
  assert.equal(verified?.userId, 'usr_test_123');
  assert.equal(verified?.phoneNumber, '+919876543210');
  assert.equal(verified?.role, UserRole.RIDER);
  assert.equal(verified?.tokenType, 'access');
});

test('Auth route handles OTP request and verification with real JWT tokens', async () => {
  const { app } = buildServer();

  // 1. Request OTP
  const sendRes = await app.inject({
    method: 'POST',
    url: '/api/v1/auth/send-otp',
    payload: { phone: '9876543210' },
  });
  assert.equal(sendRes.statusCode, 200);

  // 2. Verify OTP
  const verifyRes = await app.inject({
    method: 'POST',
    url: '/api/v1/auth/verify-otp',
    payload: { phone: '9876543210', otp: '123456', role: 'RIDER' },
  });

  assert.equal(verifyRes.statusCode, 200);
  const data = JSON.parse(verifyRes.body);
  assert.equal(data.success, true);
  assert.ok(data.token);
  assert.ok(data.refreshToken);
  assert.equal(data.user.phoneNumber, '9876543210');
  assert.equal(data.user.role, 'RIDER');
});

test('Rides route estimates fare between two points', async () => {
  const { app } = buildServer();

  const response = await app.inject({
    method: 'POST',
    url: '/api/v1/rides/estimate-fare',
    payload: {
      pickup: {
        latitude: 26.9602,
        longitude: 94.1751,
        address: 'Kamalabari Ghat, Majuli',
      },
      destination: {
        latitude: 26.9834,
        longitude: 94.2052,
        address: 'Garamur Satra, Majuli',
      },
    },
  });

  assert.equal(response.statusCode, 200);
  const json = JSON.parse(response.body);
  assert.equal(json.success, true);
  assert.ok(json.estimation.fare.totalFare > 0);
  assert.ok(json.estimation.distanceKm > 0);
});

test('User Profile and Account Deletion endpoints work securely', async () => {
  const { app } = buildServer();

  const token = await generateAccessToken({
    userId: 'usr_delete_test',
    phoneNumber: '+919876543299',
    role: UserRole.RIDER,
  });

  const deleteRes = await app.inject({
    method: 'DELETE',
    url: '/api/v1/users/me',
    headers: { authorization: `Bearer ${token}` },
  });

  assert.equal(deleteRes.statusCode, 200);
  const deleteJson = JSON.parse(deleteRes.body);
  assert.equal(deleteJson.success, true);
});
