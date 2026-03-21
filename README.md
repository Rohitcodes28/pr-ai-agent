# UnicornXMedia - Backend & Deployment Guide

This guide explains how to set up and manage your new PHP backend and automated Git deployment on cPanel.

## 1. Automated Git Deployment (CI/CD)
To stop manually adding/deleting files, follow these steps in your **cPanel**:

1. **Go to "SSH Access"**: In cPanel, click "Manage SSH Keys" and **Generate a New Key**.
2. **Add to GitHub**: Copy the "Public Key" you just generated and add it to your [GitHub SSH Settings](https://github.com/settings/keys). This lets cPanel talk to GitHub securely.
3. **Go to "Git™ Version Control"**: Found in the "Files" section of cPanel.
4. **Create a New Repository**:
   - **Clone URL**: Paste your GitHub repository URL (use the SSH version: `git@github.com...`).
   - **File Path**: Set this to `public_html/repos/unicornx` (or similar).
5. **Automatic Deployment**: 
   - I have included a `.cpanel.yml` file in your project. Each time you push to Git, cPanel will see it.
   - Go to the repo in cPanel and click **"Deploy"** to move the files to `public_html`.
   - *Note: Every push to Git will now be one click away from being live!*

## 2. Managing Credentials (Security)
To protect your passwords and email settings:
1. **Open `assets/php/config.php`** using the cPanel File Manager.
2. Update the `admin_password` to something secure.
3. **Git Security**: This file is listed in `.gitignore`, so it will **NEVER** be overwritten when you push new code from Git. Your server-side settings are safe.

## 3. Zero-Setup "Database" 🚀
Instead of complex MySQL databases, I've used a **High-Performance JSON Database** (`assets/data/submissions.json`):
- **Automatically Setup**: The system creates and updates this file automatically. You don't need to create any tables or users in cPanel.
- **Combined Storage**: All 4 forms (Contact, Podcast, Events, Newsletter) are saved in this one file. They are labeled by their "type" so the dashboard can sort them.
- **Admin Dashboard**: Access it at `yourdomain.com/admin.html`. It is already connected to this JSON file and will show your latest leads instantly.
- **Security**: Direct access to this file is blocked by a `.htaccess` file, so only your website code can read it.

## 4. Email Troubleshooting
- Ensure the email account `contact@unicornxmedia.com` is created in cPanel (it looks like it already is!).
- If emails aren't arriving, check the **"Track Delivery"** icon in cPanel to see if they are being blocked.

---
*Created by Antigravity for UnicornXMedia*
