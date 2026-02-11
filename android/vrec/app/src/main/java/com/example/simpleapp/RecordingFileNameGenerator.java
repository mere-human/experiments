package com.example.simpleapp;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * Helper class for generating recording file names.
 *
 * This class is Android-independent so we can easily unit test
 * the file naming logic on the local JVM (no emulator/device needed).
 */
public class RecordingFileNameGenerator {

    // Public constants so tests (and other classes) can refer to them
    public static final String FILE_NAME_PREFIX = "recording_";
    public static final String FILE_NAME_EXTENSION = ".3gp";
    public static final String TIMESTAMP_PATTERN = "yyyyMMdd_HHmmss";

    /**
     * Generate a file name for a given point in time.
     *
     * Example format: recording_20240102_031405.3gp
     */
    public String generateFileName(Date when) {
        SimpleDateFormat sdf = new SimpleDateFormat(TIMESTAMP_PATTERN, Locale.getDefault());
        String timestamp = sdf.format(when);
        return FILE_NAME_PREFIX + timestamp + FILE_NAME_EXTENSION;
    }

    /**
     * Convenience helper that uses the current time.
     */
    public String generateFileNameNow() {
        return generateFileName(new Date());
    }
}


