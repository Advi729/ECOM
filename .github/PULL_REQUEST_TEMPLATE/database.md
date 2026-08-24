## 🗄️ Database Changes

<!-- Describe the database changes introduced by this PR. -->
<!-- Explain the schema updates, new indexes, or required data patches. -->

### 📋 Migration Steps
- [ ] **Migration File:** Added a new migration file (`/migrations/xxxx_name.js`).
- [ ] **Up Migration:** Tested running migrations forward successfully.
- [ ] **Down Migration:** Tested rolling back migrations successfully without data loss.

### ⚠️ Performance & Risk Check
- [ ] Query optimization checked (Explain plans reviewed if dealing with massive datasets).
- [ ] This migration can be run safely while the live app is online (no table-locking).
- [ ] **Backup:** Verified production rollback strategy is clear if the migration fails.
