# Red Exit Buttons — Admin Panel Visual Tweak

> **For agentic workers:** Single atomic task — edit 7 files, rebuild, redeploy.

**Goal:** Change all close/X/exit buttons on admin modals from gray to red for visual consistency.

**Files Affected:**

| # | File | Line | Change |
|---|------|------|--------|
| 1 | `src/pages/admin/AdminCategories.jsx` | 68 | X close button on modal |
| 2 | `src/pages/admin/AdminProducts.jsx` | 162 | X close button on modal |
| 3 | `src/pages/admin/AdminOrders.jsx` | 103 | Eye toggle button (order details) |
| 4 | `src/pages/admin/AdminOrders.jsx` | 166 | XCircle close button on order detail modal |
| 5 | `src/components/admin/AdminLayout.jsx` | 107 | X close button on mobile sidebar |
| 6 | `src/components/admin/SectionEditorModal.jsx` | 903 | X close button on modal |
| 7 | `src/components/admin/ImagePicker.jsx` | 56 | X close button on modal |

**Pattern change (all 7):**
```diff
- className="p-1 hover:bg-gray-100 rounded"
+ className="p-1 hover:bg-red-50 rounded text-red-400 hover:text-red-600"
```
Adjust `p-1.5` / `p-1` to match each existing padding. For `AdminOrders.jsx:166` (already uses XCircle icon, just needs color change):
```diff
- className="text-gray-400 hover:text-gray-600"
+ className="text-red-400 hover:text-red-600"
```

---

### Task 1: Apply red styling to 7 exit buttons

- [ ] Edit each file listed above — apply the `text-red-400 hover:text-red-600 hover:bg-red-50` classes
- [ ] Run `npm run build` to verify zero errors
- [ ] Run `$env:CLOUDFLARE_API_TOKEN="cfut_...token..."; wrangler deploy` to deploy
