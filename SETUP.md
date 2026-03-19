# UnicornXMedia - Complete Setup Guide

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Video Setup](#video-setup)
3. [Email Integration Setup](#email-integration-setup)
4. [File Structure](#file-structure)
5. [Configuration](#configuration)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Step 1: Download Videos
1. Navigate to `Photos-3-001 (7)/` folder
2. Download these videos:
   - `Img 1358.mp4` → Rename to `event-video-1.mp4`
   - `Img 6545.mp4` → Rename to `event-video-2.mp4`
3. Place them in `assets/videos/` folder

### Step 2: Setup Google Apps Script (for email notifications)
1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project
3. Copy code from `google-apps-script.js`
4. Replace `YOUR_EMAIL@example.com` with your email
5. Deploy as Web App
6. Copy the Web App URL
7. Update `assets/js/main.js` with the URL

### Step 3: Open the Website
Simply open `index.html` in your browser!

---

## 📹 Video Setup

### Required Videos

Place these videos in `assets/videos/` folder:

| File Name | Source | Purpose |
|-----------|--------|---------|
| `event-video-1.mp4` | `Photos-3-001 (7)/Img 1358.mp4` | Primary event video |
| `event-video-2.mp4` | `Photos-3-001 (7)/Img 6545.mp4` | Secondary event video |

### Video Behavior
- Videos automatically switch every 10 seconds
- Smooth fade transitions between videos
- Mobile-optimized (9:16 aspect ratio)
- Autoplay with mute enabled
- Loop continuously

### Alternative Videos
You can also use:
- `Video.mp4`
- `Sponsors Sample_1.mp4`
- `Sponsors Sample_2.mp4`

Just rename them to `event-video-1.mp4` and `event-video-2.mp4`

---

## 📧 Email Integration Setup

### Step-by-Step Guide

#### 1. Create Google Apps Script Project

1. Go to https://script.google.com
2. Click **"New Project"**
3. Name it "UnicornXMedia Email Handler"

#### 2. Add the Script Code

1. Delete any existing code
2. Copy entire content from `google-apps-script.js`
3. Paste into the script editor

#### 3. Configure Email Address

Find this line in the script:
```javascript
RECIPIENT_EMAIL: 'YOUR_EMAIL@example.com',
```

Replace with your actual email:
```javascript
RECIPIENT_EMAIL: 'contact@unicornxmedia.com',
```

#### 4. Deploy as Web App

1. Click **"Deploy"** → **"New deployment"**
2. Click gear icon → Select **"Web app"**
3. Configure:
   - **Description**: "UnicornXMedia Form Handler"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. Click **"Deploy"**
5. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/...`)

#### 5. Update Website Code

Open `assets/js/main.js` and find these lines:

**Line ~160 (Newsletter Form):**
```javascript
const scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```

**Line ~210 (Application Form):**
```javascript
const scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```

Replace both with your Web App URL:
```javascript
const scriptURL = 'https://script.google.com/macros/s/YOUR_ACTUAL_URL/exec';
```

#### 6. Test Email Integration

1. Open `index.html` in browser
2. Scroll to newsletter section
3. Enter test email
4. Click "Subscribe"
5. Check your email inbox

### Optional: Google Sheets Logging

To log all submissions to Google Sheets:

1. Create a new Google Sheet
2. Copy the Spreadsheet ID from URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```
3. In Google Apps Script, update:
   ```javascript
   SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID_HERE',
   ```

---

## 📁 File Structure

```
PR-AGENT/pr-ai-agent/
├── index.html                      # Main homepage
├── contact.html                    # Contact page (to be created)
├── archive.html                    # Archive page (to be created)
├── google-apps-script.js          # Email integration script
├── SETUP.md                       # This file
├── README.md                      # Project documentation
│
├── assets/
│   ├── css/
│   │   └── style.css              # Main stylesheet
│   ├── js/
│   │   └── main.js                # Main JavaScript
│   └── videos/
│       ├── README.md              # Video setup instructions
│       ├── event-video-1.mp4      # Download from Photos folder
│       └── event-video-2.mp4      # Download from Photos folder
│
└── Photos-3-001 (7)/              # Source images and videos
    ├── Events-1.jpg               # Used in archive section
    ├── Events-2.jpg               # Used in archive section
    ├── Events-3.jpg               # Used in archive section
    ├── Events-4.jpg               # Used in archive section
    ├── Events-5.jpg               # Used in archive section
    ├── IMG_5250.jpg               # Used in archive section
    ├── Img 1358.mp4               # Source for event-video-1.mp4
    └── Img 6545.mp4               # Source for event-video-2.mp4
```

---

## ⚙️ Configuration

### Changing Video Switch Interval

Edit `assets/js/main.js` (around line 140):

```javascript
const switchInterval = 10000; // 10 seconds (in milliseconds)
```

Change to desired interval:
- 5 seconds: `5000`
- 15 seconds: `15000`
- 30 seconds: `30000`

### Changing Event Date

Edit `assets/js/main.js` (around line 270):

```javascript
const eventDate = new Date('2026-03-25'); // Pinkvilla event date
```

Update to your event date:
```javascript
const eventDate = new Date('2026-04-15'); // New date
```

### Customizing Colors

Edit `index.html` Tailwind config (in `<head>` section):

```javascript
colors: {
    dark: '#0a0a0a',      // Change dark color
    light: '#ffffff',     // Change light color
    accent: '#2563eb',    // Change accent color
    surface: '#171717',   // Change surface color
    border: '#262626'     // Change border color
}
```

---

## 🔧 Troubleshooting

### Videos Not Playing

**Problem**: Videos don't load or play

**Solutions**:
1. Check file names match exactly: `event-video-1.mp4` and `event-video-2.mp4`
2. Ensure videos are in `assets/videos/` folder
3. Check browser console for errors (F12)
4. Try different video format/codec
5. Check file paths in `main.js` are correct

### Email Forms Not Working

**Problem**: Forms submit but no email received

**Solutions**:
1. Verify Google Apps Script is deployed as Web App
2. Check "Who has access" is set to "Anyone"
3. Confirm Web App URL is correctly pasted in `main.js`
4. Check spam folder for emails
5. Test with Google Apps Script test function:
   ```javascript
   function testEmailSending() { ... }
   ```

### Custom Cursor Not Showing

**Problem**: Custom cursor doesn't appear

**Solutions**:
1. Check if on mobile device (cursor disabled on mobile)
2. Verify `cursor-dot` and `cursor-outline` elements exist in HTML
3. Check browser console for JavaScript errors
4. Ensure `main.js` is properly linked

### Images Not Loading

**Problem**: Archive images don't display

**Solutions**:
1. Verify `Photos-3-001 (7)/` folder exists
2. Check image file names match exactly
3. Ensure relative paths are correct
4. Check browser console for 404 errors

---

## 📞 Support

For issues or questions:
1. Check browser console (F12) for errors
2. Review this setup guide
3. Check `assets/videos/README.md` for video-specific help
4. Verify all file paths are correct

---

## ✅ Setup Checklist

- [ ] Downloaded and placed videos in `assets/videos/`
- [ ] Created Google Apps Script project
- [ ] Configured email address in script
- [ ] Deployed script as Web App
- [ ] Updated Web App URL in `main.js` (2 places)
- [ ] Tested newsletter form
- [ ] Tested application form
- [ ] Verified videos are switching
- [ ] Checked all images load correctly
- [ ] Tested on mobile device

---

**Last Updated**: March 19, 2026
**Version**: 1.0.0