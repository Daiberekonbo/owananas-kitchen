---
name: Resend testing sender
description: Delivery restriction for Resend's onboarding sender in this project.
---

Resend's `onboarding@resend.dev` sender can deliver to the connected account email while the account has no verified sending domain; other recipients require a verified domain and matching sender.

**Why:** This prevents confusing failed order retries when the recipient setting is not the Resend account email.

**How to apply:** Use the connected account email for development notification tests, or verify a business domain before sending to customer or staff addresses.