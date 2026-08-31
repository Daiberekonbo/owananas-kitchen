---
name: Nested package isolation
description: Replit package installation behavior when a project contains a separate service package.
---

When adding dependencies for a nested service, verify the root package manifests immediately afterward; the package installer may target the workspace root even when the service has its own package manifest.

**Why:** The backend must remain independently packaged without changing the imported frontend's dependency graph.

**How to apply:** Restore any unintended root manifest changes, then install dependencies from the nested service directory and verify both manifests before running the service.