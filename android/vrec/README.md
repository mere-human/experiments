# Audio Recording Android App

A simple Android application built with Java that records audio from the device microphone.

## Project Overview

This app demonstrates audio recording capabilities using Android's MediaRecorder API. Users can start and stop audio recordings, which are saved as timestamped files in the app's internal storage.

## Requirements

- Android Studio
- JDK 8 or higher
- Android SDK (API 24 minimum, API 34 target)

## Build Instructions

1. Open the project in Android Studio
2. Sync Gradle files
3. Build the project using `Build > Make Project` or run `./gradlew build`
4. Run the app on an emulator or connected device

## Features

- **Audio Recording**: Record audio from device microphone
- **Timestamped Files**: Recordings saved with date/time in filename (e.g., `recording_20240107_143022.3gp`)
- **Simple UI**: One-button interface to start/stop recording
- **Runtime Permissions**: Properly handles microphone permission requests

## Project Structure

- `app/src/main/java/com/example/simpleapp/` - Main application code (MainActivity.java handles recording)
- `app/src/main/res/` - Resources (layouts, strings, colors)
- `app/src/main/AndroidManifest.xml` - App configuration and permissions
- `app/build.gradle` - App-level build configuration

## Finding Recorded Files

Recordings are saved to the app's internal storage directory. To access them:

1. **Using Android Studio**: 
   - View > Tool Windows > Device File Explorer
   - Navigate to `/data/data/com.example.simpleapp/files/`
   - Right-click files and select "Save As..." to download

2. **Using ADB**:
   ```bash
   adb pull /data/data/com.example.simpleapp/files/recording_*.3gp ./
   ```

Files are in 3GP format and can be played with most media players (VLC, Windows Media Player, etc.).

For more detailed information, see [explainer.md](explainer.md).

## Dependencies

- AndroidX AppCompat
- Material Design Components
- ConstraintLayout

## Minimum SDK

- Minimum SDK: 24 (Android 7.0)
- Target SDK: 34 (Android 14)

