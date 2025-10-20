# JENSAR Distillery - Quick Reference Card

## 🚀 Quick Start

### Add New Record
1. Click the **green button** with "+" icon ("Record Sale", "New Order", "Start Batch", or "Add Supplier")
2. Fill in the form fields
3. Click **"Save"** button
4. Done! Your data is saved and appears in the table

### Edit Record
1. Find the row in the table
2. Click the **"Edit"** button in the Actions column
3. Update the fields
4. Click **"Save"**

### Delete Record
1. Find the row in the table
2. Click the **red "Delete"** button in the Actions column
3. Confirm the deletion when prompted
4. Record is removed

### Close Modal Without Saving
- Click **"Cancel"** button
- Click the **X** button in the top-right
- Click outside the modal
- Press **Escape** key

---

## 📊 Modules Overview

### Sales Module (`sales.html`)
**Track:** Customer sales and revenue  
**Auto ID:** SAL-001, SAL-002, etc.  
**Fields:** Product, Customer, Quantity, Amount (TZS), Date, Status

### Purchase Orders Module (`purchase.html`)
**Track:** Supplier orders and commitments  
**Auto ID:** PO-2024-001, PO-2024-002, etc.  
**Fields:** Supplier, Item, Quantity, Amount (TZS), Order Date, Status

### Production Module (`production.html`)
**Track:** Distillery batch production  
**Auto ID:** BATCH-001, BATCH-002, etc.  
**Fields:** Product, Materials, Volume, Start Date, Stage, Status

### Suppliers Module (`suppliers.html`)
**Track:** Supplier information  
**Fields:** Name, Contact, Specialty, Status, Rating

---

## 💾 Data Storage

| Module | Storage Key | Location |
|--------|------------|----------|
| Sales | `jensar_sales` | Browser localStorage |
| Purchase | `jensar_purchases` | Browser localStorage |
| Production | `jensar_production` | Browser localStorage |
| Suppliers | `jensar_suppliers` | Browser localStorage |

**All data is saved locally on your device. No cloud sync.**

---

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Close Modal | **Esc** |
| Navigate Tabs | **←/→** Arrow Keys |

---

## 🎨 Button Guide

| Button | Location | Action |
|--------|----------|--------|
| **Record Sale** | Sales page | Add new sale |
| **New Order** | Purchase page | Add new purchase order |
| **Start Batch** | Production page | Start new production batch |
| **Add Supplier** | Suppliers page | Add new supplier |
| **Edit** | Table rows | Edit existing record |
| **Delete** | Table rows (red) | Delete record |
| **Save** | Modal | Save form changes |
| **Cancel** | Modal | Close without saving |

---

## ✅ Form Requirements

All fields marked with **\*** are required.

### Sales Form
- Product: Required (text)
- Customer: Required (text)
- Quantity: Required (text, e.g., "24 bottles")
- Amount: Required (number, e.g., 1200.50)
- Date: Required (date picker)
- Status: Required (Pending or Delivered)

### Purchase Form
- Supplier: Required (text)
- Item: Required (text)
- Quantity: Required (text, e.g., "500 L")
- Amount: Required (number, e.g., 3500.00)
- Date: Required (date picker)
- Status: Required (Pending, In Transit, or Delivered)

### Production Form
- Product: Required (text)
- Materials: Required (text, e.g., "Barley, Yeast")
- Volume: Required (number in liters)
- Date: Required (date picker)
- Stage: Required (Distillation, Fermentation, Aging, or Bottling)
- Status: Required (In Progress, Completed, or On Hold)

### Supplier Form
- Name: Required (text)
- Contact: Required (text, e.g., phone or email)
- Specialty: Required (dropdown selection)
- Status: Required (Active or Inactive)
- Rating: Required (1-5 stars)

---

## 🔍 Search & Filter

**Search is available on all module pages:**
1. Type in the search box at the top of the module
2. Table automatically filters to show matching rows
3. Search works across all columns

---

## 📱 Mobile Compatibility

✅ Fully responsive on:
- Smartphones
- Tablets
- Desktop devices

Modal forms adjust to screen size automatically.

---

## ⚠️ Important Notes

1. **Data is Local Only** - All data saves to your browser's localStorage, not the cloud
2. **Device-Specific** - Data doesn't sync across devices. Each device has its own copy
3. **Cache Impact** - Clearing browser cache will delete all stored data
4. **Offline Mode** - Works completely offline. Changes save when you're back online
5. **No Backup** - Always keep important records backed up

---

## 🆘 Common Issues

**Q: My data disappeared after clearing cache**  
A: Browser cache includes localStorage. Use "Clear specific items" instead of "Clear all."

**Q: Can I see my data on another device?**  
A: Not automatically. Each device has separate localStorage. Plan for cloud sync in future.

**Q: How do I export my data?**  
A: Use browser developer tools (F12) → Application → LocalStorage to view and copy JSON.

**Q: Can I undo a deletion?**  
A: Not yet. Be careful with delete button. This feature will be added soon.

**Q: Forms won't submit - what's wrong?**  
A: Make sure all required fields (with \*) are filled and valid.

---

## 📞 Tips & Tricks

- **Double-check before delete** - There's a confirmation dialog, but data removal is permanent
- **Use consistent date format** - The date picker helps ensure consistency
- **Full names for suppliers** - Makes searching and filtering easier
- **Include quantities with units** - e.g., "24 bottles", "500 L" (helps with clarity)
- **Regular exports** - Copy your localStorage data regularly as backup

---

## 🎯 Workflow Examples

### Example 1: Recording a Sale
1. Go to Sales page
2. Click "Record Sale"
3. Fill: Product="Premium Whiskey", Customer="Premium Spirits Inc", Quantity="48 bottles", Amount="2400", Date="today", Status="Delivered"
4. Click "Save"
5. New row appears in table

### Example 2: Managing Purchase Orders
1. Go to Purchase page
2. Click "New Order"
3. Fill: Supplier="Oak Barrel Specialists", Item="Oak Barrels", Quantity="12 units", Amount="8400", Date="today", Status="In Transit"
4. Click "Save"
5. Track in table, click "Edit" to update status as items arrive

### Example 3: Tracking Production
1. Go to Production page
2. Click "Start Batch"
3. Fill: Product="JENSAR Single Malt", Materials="Barley, Yeast", Volume="500", Date="today", Stage="Distillation", Status="In Progress"
4. Click "Save"
5. Later, click "Edit" to update stage to "Aging" when distillation completes

---

## 📊 Currency Note

All amounts throughout the system use **TZS (Tanzanian Shilling)** format:
- Display: "TZS 1,200"
- Entry: Just enter the number (e.g., 1200)
- Currency symbol added automatically

---

**Last Updated:** 2024  
**Status:** ✅ All Features Ready