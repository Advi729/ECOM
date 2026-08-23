## 🚀 Deployment Checklist

<!-- What needs to happen to get this specific code live and working on Render? -->
<!-- Use this PR when merging major updates or final V2 structures into master. -->

### ⚙️ Environment Variables (Render Config)
- [ ] New `.env` keys need to be added to the **Render Dashboard**.
- [ ] *List keys to add (DO NOT include actual secret values/passwords here):*
  * `NEW_SERVICE_API_KEY`
  * `DATABASE_URL_V2`

### 🏗️ Release Steps
1. [ ] Run database migrations on the live production database instance.
2. [ ] Trigger a manual deployment/clear cache build on Render.
3. [ ] Verify the live application status page and check real-time logs for startup errors.
