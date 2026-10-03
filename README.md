# 🏆 Sports Club Management System

A unified digital platform for managing the day-to-day operations of a modern sports club.

The system is designed for **The Champions Club**, a sports club with tennis and cricket courts, a sports gear shop, and a bar/cafeteria.

## 📌 Project Overview

The Sports Club Management System brings club operations into one platform instead of relying on WhatsApp, Excel sheets, paper receipts, and phone calls.

The system covers:

- 👥 Membership management
- 🎾 Court booking
- 🛒 Sports shop and inventory
- 🍔 Bar and cafeteria management
- 🌐 Public website
- 📩 Enquiries and trial bookings
- 💰 Financial management
- 📊 Owner-level reporting and visibility

## 🎯 Objectives

- Manage members and membership plans
- Track membership expiry and benefits
- Manage court availability and bookings
- Prevent overlapping court bookings
- Manage sports shop products and stock
- Manage cafeteria orders, tables, and tabs
- Apply member discounts
- Capture and follow up on enquiries
- Manage trial sessions
- Track revenue from courts, shop, and bar
- Provide the owner with daily, weekly, and monthly visibility

## 👥 Membership Management

The club has three membership tiers:

| Plan | Description |
|---|---|
| 🥇 Gold | Premium / Full Access |
| 🥈 Silver | Standard |
| 🧒 Junior | Under 18 / Discounted |

The system should store:

- Member identity
- Membership plan
- Plan entitlements
- Court rates
- Shop discounts
- Bar/cafeteria discounts
- Membership expiry
- Member history

## 🎾 Court Booking

The booking system should manage court availability and prevent double-booking.

### Booking Rules

- Sessions last **1 hour**
- A new slot opens every **30 minutes**
- Each member can play at most **twice per day**
- Members can have different rates depending on their plan
- Walk-ins can use the courts
- Bookings can be cancelled
- Friday social play can allow multiple people on one court
- Two people must never end up on the same court at the same time

## 🛒 Sports Shop & Inventory

The club shop sells:

- Rackets
- Balls
- Shoes
- Accessories
- Apparel

### Features

- Product management
- Stock tracking
- Low-stock visibility
- Counter sales
- Online orders
- Club pickup
- Delivery
- Member discounts

Counter and online sales should use the **same inventory**.

## 🍔 Bar & Cafeteria

The cafeteria/bar should support:

- Table tracking
- Food and drink orders
- Member identification
- Automatic member discounts
- Running tabs
- Bill settlement
- Cash payments
- Card payments
- UPI payments
- Staff shifts
- Daily bar revenue

The system should make it clear who ordered what and help staff manage busy periods.

## 🌐 Public Website

The public website should allow visitors to discover the club and view:

- Club information
- Membership plans
- Prices
- Court availability
- Sports shop products
- Trial session options

Visitors should be able to make a trial-session enquiry or booking.

## 📩 Enquiry & Lead Management

Enquiries should be captured and followed up instead of being lost.

### Enquiry Flow

```text
Visitor
   ↓
Enquiry
   ↓
Follow-up
   ↓
Quote
   ↓
Trial Session
   ↓
New Member
```

## 💰 Finance Management

The club receives revenue from:

- Memberships
- Court bookings
- Sports shop
- Bar/cafeteria

Supported payment sources include:

- Cash
- Card
- Online payments
- UPI

The system also needs to support visibility around:

- Membership invoices
- Business-client invoices
- Employee payments
- Leave approvals
- Taxes
- Amounts owed

## 📊 Owner Dashboard

The owner should be able to see the club's performance for:

- Today
- This week
- This month

The dashboard should provide visibility into:

- Members
- Court bookings
- Court availability
- Shop sales
- Inventory
- Cafeteria sales
- Enquiries
- Trial bookings
- Revenue
- Amounts owed

## 🔄 Complete Club Workflow

```text
🌐 Public Website
       ↓
📩 Enquiry
       ↓
🎯 Trial Session
       ↓
👥 Membership
       ↓
🎾 Court Booking
       ↓
🛒 Shop / 🍔 Cafeteria
       ↓
💳 Payment
       ↓
💰 Financial Records
       ↓
📊 Owner Dashboard
```

## 🏗️ Main Modules

| Module | Purpose |
|---|---|
| 👥 Members | Memberships, benefits, expiry, history |
| 🎾 Courts | Availability and bookings |
| 🛒 Shop | Products, sales, inventory |
| 🍔 Cafeteria | Tables, orders, tabs, payments |
| 🌐 Website | Public club information and discovery |
| 📩 Enquiries | Leads, follow-ups, quotes, trials |
| 💰 Finance | Revenue, invoices, payments |
| 📊 Dashboard | Overall club performance |

## 👤 User Areas

### Member

- View membership
- Check court availability
- Book courts
- View club history
- Purchase shop products
- Use cafeteria services
- Receive applicable discounts

### Front Desk

- Register members
- Manage bookings
- Handle walk-ins
- Manage enquiries
- View member information
- Handle schedules

### Shop Staff

- Manage products
- Track inventory
- Process sales

### Cafeteria/Bar Staff

- Manage tables
- Take orders
- Manage tabs
- Process payments

### Owner/Admin

- Monitor club operations
- View revenue
- Monitor memberships
- Monitor bookings
- Review shop and cafeteria performance
- View financial information

## 🚀 Expected Outcome

The system transforms disconnected manual processes into one connected digital platform.

### Before

```text
WhatsApp → Court Bookings
Excel    → Member Records
Paper    → Bar Orders
Phone    → Court Availability
Separate Records → Revenue
```

### After

```text
          🏆 SPORTS CLUB MANAGEMENT SYSTEM
                       │
        ┌──────────────┼──────────────┐
        │              │              │
     Members         Courts          Shop
        │              │              │
        ├──────────────┼──────────────┤
        │              │              │
    Cafeteria      Enquiries        Finance
        │              │              │
        └──────────────┼──────────────┘
                       │
                 📊 Dashboard
```

## 💡 Project Vision

> **One club. One platform. Complete visibility.**

The goal is to provide a single digital backbone for the club's members, bookings, shop, cafeteria, enquiries, and financial operations.
