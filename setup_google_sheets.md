# Setting up Google Apps Script for Multiple Spreadsheets

This guide explains how to set up a centralized Google Apps Script to securely receive frontend form submissions and distribute the data across four distinct Google Sheets based on the submission `applicationType` or `type`.

## Prerequisites
1. A Google Account.
2. Four newly created Google Spreadsheets (e.g., "PR Campaigns", "Event Hosting", "Podcast Applications", "Attend Event").

## Step 1: Create the Spreadsheets
1. Create four new Google Spreadsheets and name them appropriately for your 4 target tabs.
2. For each spreadsheet, add the exact column headers in Row 1 that correspond to your data payload.
   - **Attend Event**: `Timestamp`, `fullName`, `email`, `phone`, `company`
   - **PR Campaigns**: `Timestamp`, `fullName`, `email`, `phone`, `company`, `prGoal`, `prStory`
   - **Host an Event**: `Timestamp`, `fullName`, `email`, `phone`, `company`, `eventType`, `attendees`, `eventDate`, `eventDetails`
   - **Podcast**: `Timestamp`, `fullName`, `email`, `phone`, `company`, `role`, `industry`, `podcastStory`, `topics`
3. Identify the **Spreadsheet ID** for each of the four sheets. The ID is the long string of characters in the URL between `/d/` and `/edit`.
   *(Example: `https://docs.google.com/spreadsheets/d/1BxiMVs0X_x_your_id_here/edit` -> ID is `1BxiMVs0X_x_your_id_here`)*

## Step 2: Create the Google Apps Script
1. Go to [script.google.com](https://script.google.com/) and create a new project.
2. Name the project (e.g., "UnicornXMedia Forms Setup").
3. Delete any code in the `Code.gs` file and paste the following script:

```javascript
const SHEET_IDS = {
  'pr': 'YOUR_PR_SHEET_ID_HERE',
  'event': 'YOUR_EVENT_HOSTING_SHEET_ID_HERE',
  'podcast': 'YOUR_PODCAST_SHEET_ID_HERE',
  'attend': 'YOUR_ATTEND_EVENT_SHEET_ID_HERE',
  'contact': 'YOUR_CONTACT_US_SHEET_ID_HERE', // Optional
  'newsletter': 'YOUR_NEWSLETTER_SHEET_ID_HERE' // Optional
};

function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    const type = data.applicationType || data.type; 
    
    // Check if the type exists in our mapped spreadsheets
    if (!SHEET_IDS[type]) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Invalid form type or no spreadsheet mapped.'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Open the corresponding spreadsheet based on the mapped ID
    const sheet = SpreadsheetApp.openById(SHEET_IDS[type]).getActiveSheet();
    
    // Get headers to match incoming data dynamically
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Create an array for the new row matching the header order
    const rowData = headers.map(header => {
      if (header.toLowerCase() === 'timestamp') {
        return new Date();
      }
      return data[header] || '';
    });
    
    // Append the row
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
// Allow OPTION requests for CORS
function doOptions(e) {
  return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
}
```

## Step 3: Configure and Deploy
1. Replace the `YOUR_..._SHEET_ID_HERE` placeholders in the script with the actual Spreadsheet IDs from Step 1.
2. Click **Deploy** -> **New deployment**.
3. For the "Select type" gear icon, choose **Web app**.
4. Set the following:
   - **Description**: Initial form deployment
   - **Execute as**: "Me"
   - **Who has access**: "Anyone" (This is required so the public frontend can send data).
5. Click **Deploy**.
6. Google will ask for Authorization. Click **Authorize access**, select your Google account, click **Advanced**, and then click **Go to [Project Name] (unsafe)** to allow it to edit your spreadsheets.
7. Copy the generated **Web App URL**.

## Step 4: Integrate with the Website
1. Open the project code files (`assets/js/main.js`, `archive.html`, `podcasts.html`).
2. Search for the text `YOUR_GOOGLE_APPS_SCRIPT_URL` where fetch requests are made.
3. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL` with the Web App URL you just copied.
4. Save the files and test the forms. The data will automatically route to the correct spreadsheets!
