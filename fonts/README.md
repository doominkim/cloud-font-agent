# Fonts Directory

This directory contains font files organized by provider/vendor.

## Directory Structure

```
fonts/
├── [Provider1]/
│   ├── Font1.ttf
│   ├── Font2.otf
│   └── ...
├── [Provider2]/
│   ├── Font3.ttf
│   └── ...
└── README.md
```

### Example

```
fonts/
├── 피플퍼스트/
│   ├── PeoplefirstFighting-Regular.ttf
│   └── PeoplefirstIL.otf
├── Boritype/
│   ├── BoriHellofluff.ttf
│   └── BoriItsmonday.ttf
└── Kimmin/
    └── Hola-Light.otf
```

## Development Mode

In development mode, the application reads fonts from this directory (`./fonts`).

## Production Mode

In production mode, fonts can be stored in a hidden system directory for security.

## Supported Formats

- `.ttf` (TrueType Font)
- `.otf` (OpenType Font)

## Adding Fonts

1. Create a folder for the font provider/vendor (e.g., `fonts/MyProvider/`)
2. Create an `info.json` file in that folder with metadata:
   ```json
   {
     "provider": "MyProvider",
     "displayName": "My Provider",
     "description": "My Provider font collection",
     "previewFont": "MyFont-Regular.ttf",
     "website": "https://myprovider.com",
     "fonts": [
       {
         "name": "My Font",
         "weight": "Regular",
         "style": "Normal",
         "files": [
           {
             "file": "MyFont-Regular.ttf",
             "format": "truetype"
           },
           {
             "file": "MyFont-Regular.otf",
             "format": "opentype"
           }
         ]
       }
     ]
   }
   ```
3. Place your `.ttf` or `.otf` font files in that folder
4. The application will automatically detect and list them with proper metadata

## info.json Schema

Each provider folder should contain an `info.json` file with the following structure:

```typescript
{
  "provider": string,        // Provider ID (folder name)
  "displayName": string,     // Display name for UI
  "description": string,     // Optional description
  "previewFont": string,     // Font file to use for provider name preview
  "website": string,         // Optional website URL
  "fonts": [
    {
      "name": string,        // Display name for font
      "weight": string,      // Optional: "Light", "Regular", "Bold", etc.
      "style": string,       // Optional: "Normal", "Italic", etc.
      "files": [
        {
          "file": string,    // Font filename
          "format": "truetype" | "opentype"  // Font format
        }
      ]
    }
  ]
}
```

### Notes:

- Multiple file formats (TTF and OTF) for the same font should be grouped under one font entry
- The `format` field distinguishes between TrueType (`truetype`) and OpenType (`opentype`) formats
- If `info.json` is not present, the application will use default values extracted from filenames

## Provider Organization

- Each subfolder represents a font provider/vendor
- Provider names are automatically detected from folder names
- Fonts are grouped by provider in the UI
- You can also place fonts directly in the `fonts/` root (they will be listed under "Unknown" provider)

## File Naming Convention

For best results, use descriptive filenames:

- `FontFamily-Weight.ttf` (e.g., `Roboto-Bold.ttf`)
- `FontFamily_Style.otf` (e.g., `OpenSans_Italic.otf`)

Hyphens and underscores will be converted to spaces in the UI.

## Environment Variables

You can customize font source behavior with environment variables:

- `FONT_SOURCE_MODE`: `local` (default) or `remote`
- `LOCAL_FONT_DIRECTORY`: Custom path to font directory
- `REMOTE_API_URL`: URL for remote font API (when mode is `remote`)

## Example

```bash
# Use custom local directory
LOCAL_FONT_DIRECTORY=/path/to/fonts npm start

# Use remote API
FONT_SOURCE_MODE=remote REMOTE_API_URL=https://api.example.com npm start
```
