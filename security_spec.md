# Security Specification: GameIn Pro

## 1. Data Invariants
- A user document at `/users/{userId}` can only be created or modified by the authenticated user (`request.auth.uid == userId`) or an admin.
- Sensitive user role privilege escalation (`role: 'admin'`) cannot be self-assigned.
- Tournaments at `/tournaments/{tournamentId}` can only be created by signed-in users or admins.
- Updating tournament details or status requires the user to be the tournament host (`resource.data.hostId == request.auth.uid`) or an admin, or joining/leaving the tournament with controlled array mutations (`registeredPlayerIds`).
- Chat messages at `/messages/{messageId}` must have `userId == request.auth.uid` to prevent identity spoofing, and message length must not exceed 500 characters.
- Quests at `/quests/{questDocId}` can only be read and updated by their owner (`userId == request.auth.uid`).

## 2. The Dirty Dozen Payloads
1. **Ghost Field Injection**: User profile update with injected malicious field `isMasterSuperUser: true`.
2. **Impersonated Chat**: Message with `userId: "admin-victim-id"` posted by an attacker.
3. **Denial-of-Wallet String Poisoning**: Chat text with 500,000 characters.
4. **Host Hijack**: Attacker updates `hostId` of a high-stakes tournament to their own UID.
5. **Prize Pool Tampering**: Non-host user updating the `prizePool` or `winner` field.
6. **Self-Role Escalation**: New user profile creation sending `role: "admin"`.
7. **Cross-User Quest Claiming**: User attempting to claim XP from another gamer's quest doc.
8. **Invalid Path Injection**: Creating a document at `/tournaments/../../evil_doc`.
9. **Fake Email Verification Bypass**: Read or write attempting to spoof verified admin privileges without `email_verified == true`.
10. **Terminal State Mutation**: Changing a completed tournament back to live status without admin privileges.
11. **Negative Level / Negative Trophy Exploit**: Submitting negative numbers for `trophies` or `xp`.
12. **Orphaned Registration**: Non-authenticated client attempting to mass-delete tournament records.

## 3. Security Assertions
- All writes enforce authentication `request.auth != null`.
- String inputs have strict character length guards (`.size() <= MAX`).
- Role elevation and terminal outcomes are protected.
