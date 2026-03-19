/* ============================================
   UnicornXMedia - Google Apps Script
   Email Integration for Forms
   ============================================
   
   SETUP INSTRUCTIONS:
   1. Go to https://script.google.com
   2. Create a new project
   3. Copy this entire code
   4. Replace YOUR_EMAIL@example.com with your actual email
   5. Deploy as Web App:
      - Execute as: Me
      - Who has access: Anyone
   6. Copy the Web App URL
   7. Paste it in assets/js/main.js (replace YOUR_GOOGLE_APPS_SCRIPT_URL_HERE)
   
   ============================================ */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  // Replace with your email address
  RECIPIENT_EMAIL: 'YOUR_EMAIL@example.com',
  
  // Email subject prefixes
  NEWSLETTER_SUBJECT: '[UnicornXMedia] New Newsletter Subscription',
  APPLICATION_SUBJECT: '[UnicornXMedia] New Application Submission',
  CONTACT_SUBJECT: '[UnicornXMedia] New Contact Form Submission',
  PODCAST_SUBJECT: '[UnicornXMedia] New Podcast Request',
  
  // Spreadsheet ID (optional - for logging submissions)
  SPREADSHEET_ID: '', // Leave empty if not using Google Sheets logging
};

// ============================================
// MAIN HANDLER - Processes all form submissions
// ============================================
function doPost(e) {
  try {
    const formData = e.parameter;
    const submissionType = formData.type || 'unknown';
    
    // Log to console
    Logger.log('Received submission: ' + submissionType);
    Logger.log('Data: ' + JSON.stringify(formData));
    
    // Process based on type
    let result;
    switch(submissionType) {
      case 'newsletter':
        result = handleNewsletterSubmission(formData);
        break;
      case 'application':
        result = handleApplicationSubmission(formData);
        break;
      case 'contact':
        result = handleContactSubmission(formData);
        break;
      case 'podcast':
        result = handlePodcastSubmission(formData);
        break;
      default:
        result = { success: false, message: 'Unknown submission type' };
    }
    
    // Log to Google Sheets (optional)
    if (CONFIG.SPREADSHEET_ID) {
      logToSheet(formData, submissionType);
    }
    
    // Return JSON response
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// NEWSLETTER SUBSCRIPTION HANDLER
// ============================================
function handleNewsletterSubmission(data) {
  const email = data.email;
  const timestamp = data.timestamp || new Date().toISOString();
  
  // Email body
  const emailBody = `
New Newsletter Subscription

Email: ${email}
Timestamp: ${timestamp}

---
This is an automated message from UnicornXMedia website.
  `;
  
  // Send email
  MailApp.sendEmail({
    to: CONFIG.RECIPIENT_EMAIL,
    subject: CONFIG.NEWSLETTER_SUBJECT,
    body: emailBody
  });
  
  return { success: true, message: 'Newsletter subscription received' };
}

// ============================================
// APPLICATION FORM HANDLER
// ============================================
function handleApplicationSubmission(data) {
  const fullName = data.fullName || 'N/A';
  const company = data.company || 'N/A';
  const email = data.email || 'N/A';
  const stage = data.stage || 'N/A';
  const budget = data.budget || 'N/A';
  const goal = data.goal || 'N/A';
  const timestamp = data.timestamp || new Date().toISOString();
  
  // Email body
  const emailBody = `
New Application Submission

Full Name: ${fullName}
Company/Brand: ${company}
Email: ${email}
Company Stage: ${stage}
Budget: ${budget}
Primary Goal: ${goal}
Timestamp: ${timestamp}

---
This is an automated message from UnicornXMedia website.
  `;
  
  // Send email
  MailApp.sendEmail({
    to: CONFIG.RECIPIENT_EMAIL,
    subject: CONFIG.APPLICATION_SUBJECT,
    body: emailBody
  });
  
  return { success: true, message: 'Application submitted successfully' };
}

// ============================================
// CONTACT FORM HANDLER
// ============================================
function handleContactSubmission(data) {
  const name = data.name || 'N/A';
  const email = data.email || 'N/A';
  const subject = data.subject || 'N/A';
  const message = data.message || 'N/A';
  const timestamp = data.timestamp || new Date().toISOString();
  
  // Email body
  const emailBody = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}
Message: ${message}
Timestamp: ${timestamp}

---
This is an automated message from UnicornXMedia website.
  `;
  
  // Send email
  MailApp.sendEmail({
    to: CONFIG.RECIPIENT_EMAIL,
    subject: CONFIG.CONTACT_SUBJECT,
    body: emailBody
  });
  
  return { success: true, message: 'Contact form submitted successfully' };
}

// ============================================
// PODCAST REQUEST HANDLER
// ============================================
function handlePodcastSubmission(data) {
  const name = data.name || 'N/A';
  const email = data.email || 'N/A';
  const phone = data.phone || 'N/A';
  const company = data.company || 'N/A';
  const role = data.role || 'N/A';
  const industry = data.industry || 'N/A';
  const story = data.story || 'N/A';
  const topics = data.topics || 'N/A';
  const timestamp = data.timestamp || new Date().toISOString();
  
  // Email body
  const emailBody = `
New Podcast Request Submission

Full Name: ${name}
Email: ${email}
Phone: ${phone}
Company: ${company}
Role/Title: ${role}
Industry: ${industry}
Story: ${story}
Preferred Topics: ${topics}
Timestamp: ${timestamp}

---
This is an automated message from UnicornXMedia website.
  `;
  
  // Send email
  MailApp.sendEmail({
    to: CONFIG.RECIPIENT_EMAIL,
    subject: CONFIG.PODCAST_SUBJECT,
    body: emailBody
  });
  
  return { success: true, message: 'Podcast request submitted successfully' };
}

// ============================================
// LOG TO GOOGLE SHEETS (Optional)
// ============================================
function logToSheet(data, type) {
  try {
    if (!CONFIG.SPREADSHEET_ID) return;
    
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    let sheet = ss.getSheetByName(type);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(type);
      // Add headers based on type
      if (type === 'newsletter') {
        sheet.appendRow(['Timestamp', 'Email']);
      } else if (type === 'application') {
        sheet.appendRow(['Timestamp', 'Full Name', 'Company', 'Email', 'Stage', 'Budget', 'Goal']);
      } else if (type === 'contact') {
        sheet.appendRow(['Timestamp', 'Name', 'Email', 'Subject', 'Message']);
      } else if (type === 'podcast') {
        sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Company', 'Role', 'Industry', 'Story', 'Topics']);
      }
    }
    
    // Add data row
    const timestamp = new Date();
    if (type === 'newsletter') {
      sheet.appendRow([timestamp, data.email]);
    } else if (type === 'application') {
      sheet.appendRow([
        timestamp,
        data.fullName,
        data.company,
        data.email,
        data.stage,
        data.budget,
        data.goal
      ]);
    } else if (type === 'contact') {
      sheet.appendRow([
        timestamp,
        data.name,
        data.email,
        data.subject,
        data.message
      ]);
    } else if (type === 'podcast') {
      sheet.appendRow([
        timestamp,
        data.name,
        data.email,
        data.phone,
        data.company,
        data.role,
        data.industry,
        data.story,
        data.topics
      ]);
    }
    
  } catch (error) {
    Logger.log('Sheet logging error: ' + error.toString());
  }
}

// ============================================
// TEST FUNCTION (Run this to test email sending)
// ============================================
function testEmailSending() {
  const testData = {
    type: 'newsletter',
    email: 'test@example.com',
    timestamp: new Date().toISOString()
  };
  
  const result = handleNewsletterSubmission(testData);
  Logger.log('Test result: ' + JSON.stringify(result));
}

// Made with Bob
