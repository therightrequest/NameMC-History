# NameMC History UserScript

## Description

This UserScript enhances the functionality of NameMC profile pages by adding an API Username History table. It fetches data from both the Crafty and Laby APIs, allowing users to view additional username history information for Minecraft accounts.

## Features

- Adds an API Username History table to NameMC profile pages
- Supports two data sources: Crafty API and Laby API
- Allows switching between Crafty and Laby data with the click of a button
- Displays usernames with their change dates and times
- Sorts usernames by date (most recent first)
- Handles special cases like deleted or hidden usernames
- Provides a copy button for each username

## Installation

1. Install a UserScript manager for your browser. Here are some popular options:
   https://www.tampermonkey.net/
   https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/
   https://violentmonkey.github.io/
   
 

3. After installing a UserScript manager, click on the following link to install the NameMC History UserScript:
   [Install NameMC History UserScript](#) (Note: Replace '#' with the actual installation link when available)

4. Your UserScript manager should prompt you to install the script. Click "Install" to proceed.

5. The script is now installed and will automatically run on NameMC profile pages.

## Usage

1. Visit any NameMC profile page (e.g., https://namemc.com/profile/Notch)
2. The script will automatically add the API Username History table below the existing Name History table
3. By default, it will display data from the Crafty API
4. Click the "Laby API" button to switch to data from the Laby API
5. Use the copy button next to each username to copy it to your clipboard

## Compatibility

This script is designed to work on NameMC profile pages (https://namemc.com/profile/*).

## Author

therightrequest (contact@turki.ca)

## Notes

- The script uses a CORS proxy (https://corsproxy.io/?) to bypass CORS restrictions when fetching API data
- If a UUID is not found or not selected on the page, the script will not function
- The script respects the existing styling and layout of the NameMC website

## Troubleshooting

If the API Username History table doesn't appear:
1. Make sure you're on a valid NameMC profile page
2. Check if the UUID is properly selected on the page
3. Look for any error messages in the browser's console

If you're experiencing other issues:
1. Make sure your UserScript manager is up to date
2. Try disabling other UserScripts or extensions that might interfere
3. Clear your browser cache and reload the page

## Contributing

Feel free to fork this script and make improvements. Pull requests are welcome!

## License

This script is provided as-is, without any explicit license. Consider adding a license if you plan to distribute it further.
