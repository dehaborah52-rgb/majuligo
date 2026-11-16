# MajuliGo Security & Privacy Architecture

This document specifies the security controls, authentication standards, role-based authorization rules, location privacy measures, and financial data protections implemented across MajuliGo.

---

## 1. Authentication & Session Security

1. **Phone Number + OTP Verification**:
   * All rider and captain accounts authenticate via 10-digit Indian phone numbers with cryptographic OTP verification.
   * OTPs expire within 5 minutes. Rate limiting prevents brute force attempts (maximum 3 OTP requests per phone per 15 minutes; maximum 5 verification attempts per OTP).
2. **Stateless JWT Tokens**:
   * Authenticated sessions use signed JSON Web Tokens (JWT) containing user ID and Role.
   * Access tokens expire in 7 days; Refresh tokens are stored securely with rotation.
3. **Passwordless Architecture**:
   * Eliminates password reuse and database credential leakage risks.

---

## 2. Server-Side Role-Based Authorization (RBAC)

The system enforces strict role-based access control directly on the backend API layer:

| Role | Permissions & Access Boundaries |
| :--- | :--- |
| **`RIDER`** | Can view own profile, estimate fares, request rides, view assigned captain's live location during active rides, cancel pending rides, and submit ratings. |
| **`CAPTAIN`** | Can toggle online/offline availability, stream own GPS coordinates, view broadcasted ride requests in radius, accept/reject rides, verify rider OTP, complete trips, and view own earnings. Cannot accept rides if status is not `APPROVED`. |
| **`ADMIN`** | Can review captain KYC documents, approve or reject applications with feedback, monitor live trips, configure service areas and fare rates. |
| **`SUPER_ADMIN`** | Full access: create admin accounts, export audit logs, execute manual financial reconciliations, and update platform configuration. |

---

## 3. Location Privacy & Google Play Compliance

1. **Permission Minimization**:
   * **Rider App**: Requests `ACCESS_FINE_LOCATION` and `ACCESS_COARSE_LOCATION` only while the app is in use (`while in use`). No background location is requested.
   * **Captain App**: Requires `ACCESS_BACKGROUND_LOCATION` and `FOREGROUND_SERVICE_LOCATION` with a persistent notification while online, strictly to enable navigation and live trip updates for riders.
2. **In-App Disclosures**:
   * Prior to requesting location permissions on Android, a clear in-app disclosure explains why location is necessary and confirms that coordinates are never shared with third parties or sold to advertising networks.
3. **Data Retention**:
   * Breadcrumb coordinates in `ride_locations` are retained only as needed for dispute resolution and are scrubbed/aggregated periodically.

---

## 4. Financial & Payment Security

1. **No Stored Card Credentials**:
   * MajuliGo never stores raw debit/credit card numbers or CVVs. All electronic transactions run through RBI-compliant payment gateways (Razorpay) or native UPI intent deep-links.
2. **Server-Side Verification**:
   * Client applications are never trusted regarding payment status. Payment status is updated exclusively via signed webhooks and server-to-server gateway queries.
3. **Cash Flow Accountability**:
   * When Cash payment is selected, the platform records the exact cash collected by the captain and automatically balances the platform commission against the captain's digital earnings ledger.

---

## 5. Audit Logging & Non-Repudiation

* Critical operations (such as approving/rejecting a captain's licence, modifying base fare rates, cancelling a ride, or altering user account status) write an immutable record to the `audit_logs` table with actor ID, action type, IP address, and JSON details.
