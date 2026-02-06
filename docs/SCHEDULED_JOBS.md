# Scheduled Jobs

This document describes all automated scheduled jobs in the Z-HR application.

## Overview

The application uses GitHub Actions to run scheduled maintenance and evaluation tasks nightly. These jobs ensure data consistency, user state accuracy, and content synchronization.

## Nightly State Evaluation Workflow

**Workflow File:** `.github/workflows/state-evaluation.yml`

**Schedule:** Daily at 2:00 AM UTC

**Purpose:** Perform nightly maintenance tasks including user state evaluation, verification reminders, and content synchronization.

### Jobs

#### 1. Evaluate Dormant Users

**Endpoint:** `GET /api/user-states/evaluate`

**Description:** Evaluates user activity and updates user states (e.g., marking users as dormant based on inactivity thresholds).

**Frequency:** Daily

**Required Secrets:**
- `APP_URL` - Base URL of the application
- `ADMIN_TOKEN` - Admin authentication token

---

#### 2. Check Verification Reminders

**Endpoint:** `GET /api/auth/verification/check`

**Description:** Checks for users requiring email verification reminders and sends notification emails.

**Frequency:** Daily

**Required Secrets:**
- `APP_URL` - Base URL of the application
- `ADMIN_TOKEN` - Admin authentication token

---

#### 3. Sync Learning Hub

**Endpoint:** `GET /api/learning-hub/sync`

**Description:** Synchronizes learning hub content with external sources, updates course data, and refreshes cached content.

**Frequency:** Daily

**Required Secrets:**
- `APP_URL` - Base URL of the application
- `ADMIN_TOKEN` - Admin authentication token

---

## Manual Triggering

All scheduled workflows can be manually triggered via the GitHub Actions UI using the `workflow_dispatch` event. This is useful for:

- Testing workflow changes
- Running jobs outside the regular schedule
- Troubleshooting issues

### Steps to Manually Trigger:

1. Navigate to the **Actions** tab in GitHub
2. Select the **Nightly State Evaluation** workflow
3. Click **Run workflow**
4. Select the branch and click **Run workflow** button

---

## Required GitHub Secrets

The following secrets must be configured in the GitHub repository settings:

| Secret Name | Description | Example |
|------------|-------------|---------|
| `APP_URL` | Base URL of the deployed application | `https://z-hr.example.com` |
| `ADMIN_TOKEN` | Authentication token for admin API access | `eyJhbGciOiJIUzI1Ni...` |

### Setting Up Secrets:

1. Go to repository **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret**
3. Add each required secret with its value
4. Save the secrets

---

## Monitoring and Troubleshooting

### Viewing Workflow Runs

1. Navigate to the **Actions** tab in GitHub
2. Select the **Nightly State Evaluation** workflow
3. View the list of recent runs and their status

### Common Issues

**Issue:** Workflow fails with 401 Unauthorized

**Solution:** Verify that the `ADMIN_TOKEN` secret is correctly set and has not expired.

---

**Issue:** Workflow fails with connection timeout

**Solution:** Check that the `APP_URL` secret is correct and the application is accessible.

---

**Issue:** Jobs complete but no changes observed

**Solution:** Check application logs to ensure the API endpoints are processing requests correctly.

---

## Timing Considerations

The workflow runs at **2:00 AM UTC** to minimize impact on:

- User traffic (typically low during this time)
- Database load
- API rate limits

If you need to adjust the schedule, modify the `cron` expression in `.github/workflows/state-evaluation.yml`.

### Cron Expression Format

```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of the month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
│ │ │ │ │
* * * * *
```

**Current:** `0 2 * * *` = Every day at 2:00 AM UTC

---

## Future Scheduled Jobs

Additional scheduled jobs may be added in the future, such as:

- Weekly analytics aggregation
- Monthly report generation
- Periodic data cleanup and archival
- Content recommendation updates

---

## Related Documentation

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cron Expression Reference](https://crontab.guru/)
- API endpoint documentation (see respective API route files)
