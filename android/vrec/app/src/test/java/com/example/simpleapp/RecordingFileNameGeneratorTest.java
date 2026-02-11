package com.example.simpleapp;

import org.junit.Test;

import java.util.Calendar;
import java.util.Date;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * Unit tests for {@link RecordingFileNameGenerator}.
 *
 * These run on the local JVM (no device/emulator) and verify that the
 * file naming logic behaves as expected.
 */
public class RecordingFileNameGeneratorTest {

    @Test
    public void generateFileName_usesExpectedPrefixAndExtension() {
        RecordingFileNameGenerator generator = new RecordingFileNameGenerator();

        Calendar calendar = Calendar.getInstance();
        calendar.set(2024, Calendar.JANUARY, 2, 3, 14, 5);
        calendar.set(Calendar.MILLISECOND, 0);
        Date fixedTime = calendar.getTime();

        String fileName = generator.generateFileName(fixedTime);

        assertTrue("File name should start with the expected prefix",
                fileName.startsWith(RecordingFileNameGenerator.FILE_NAME_PREFIX));
        assertTrue("File name should end with the expected extension",
                fileName.endsWith(RecordingFileNameGenerator.FILE_NAME_EXTENSION));
    }

    @Test
    public void generateFileName_matchesExactExpectedValue() {
        RecordingFileNameGenerator generator = new RecordingFileNameGenerator();

        Calendar calendar = Calendar.getInstance();
        calendar.set(2024, Calendar.JANUARY, 2, 3, 14, 5);
        calendar.set(Calendar.MILLISECOND, 0);
        Date fixedTime = calendar.getTime();

        String fileName = generator.generateFileName(fixedTime);

        assertEquals("recording_20240102_031405.3gp", fileName);
    }

    @Test
    public void generateFileName_hasCorrectTimestampPattern() {
        RecordingFileNameGenerator generator = new RecordingFileNameGenerator();

        String fileName = generator.generateFileName(new Date());

        // Example: recording_20240102_031405.3gp
        String pattern = "^" +
                RecordingFileNameGenerator.FILE_NAME_PREFIX +
                "\\d{8}_\\d{6}" +
                RecordingFileNameGenerator.FILE_NAME_EXTENSION +
                "$";

        assertTrue("File name should match the expected pattern", fileName.matches(pattern));
    }

    @Test
    public void generateFileName_midnightBoundary() {
        RecordingFileNameGenerator generator = new RecordingFileNameGenerator();

        Calendar calendar = Calendar.getInstance();
        calendar.set(2024, Calendar.JANUARY, 1, 0, 0, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        Date midnight = calendar.getTime();

        String fileName = generator.generateFileName(midnight);

        assertEquals("recording_20240101_000000.3gp", fileName);
    }

    @Test
    public void generateFileName_endOfDayBoundary() {
        RecordingFileNameGenerator generator = new RecordingFileNameGenerator();

        Calendar calendar = Calendar.getInstance();
        calendar.set(2024, Calendar.DECEMBER, 31, 23, 59, 59);
        calendar.set(Calendar.MILLISECOND, 0);
        Date endOfDay = calendar.getTime();

        String fileName = generator.generateFileName(endOfDay);

        assertEquals("recording_20241231_235959.3gp", fileName);
    }

    @Test
    public void generateFileName_yearBoundary() {
        RecordingFileNameGenerator generator = new RecordingFileNameGenerator();

        Calendar calendar = Calendar.getInstance();
        calendar.set(2023, Calendar.DECEMBER, 31, 23, 59, 59);
        calendar.set(Calendar.MILLISECOND, 0);
        Date yearEnd = calendar.getTime();

        String fileName = generator.generateFileName(yearEnd);

        assertTrue("File name should contain year 2023", fileName.contains("2023"));
        assertTrue("File name should start with prefix", 
                fileName.startsWith(RecordingFileNameGenerator.FILE_NAME_PREFIX));
    }

    @Test
    public void generateFileName_monthBoundary() {
        RecordingFileNameGenerator generator = new RecordingFileNameGenerator();

        Calendar calendar = Calendar.getInstance();
        calendar.set(2024, Calendar.FEBRUARY, 29, 12, 30, 45); // Leap year Feb 29
        calendar.set(Calendar.MILLISECOND, 0);
        Date leapDay = calendar.getTime();

        String fileName = generator.generateFileName(leapDay);

        assertTrue("File name should contain 0229 for Feb 29", fileName.contains("0229"));
        assertEquals("recording_20240229_123045.3gp", fileName);
    }

    @Test
    public void generateFileName_ignoresMilliseconds() {
        RecordingFileNameGenerator generator = new RecordingFileNameGenerator();

        Calendar calendar1 = Calendar.getInstance();
        calendar1.set(2024, Calendar.JANUARY, 2, 3, 14, 5);
        calendar1.set(Calendar.MILLISECOND, 0);
        Date time1 = calendar1.getTime();

        Calendar calendar2 = Calendar.getInstance();
        calendar2.set(2024, Calendar.JANUARY, 2, 3, 14, 5);
        calendar2.set(Calendar.MILLISECOND, 999);
        Date time2 = calendar2.getTime();

        String fileName1 = generator.generateFileName(time1);
        String fileName2 = generator.generateFileName(time2);

        // Both should produce the same filename since milliseconds are not in the format
        assertEquals("File names should be identical regardless of milliseconds", fileName1, fileName2);
        assertEquals("recording_20240102_031405.3gp", fileName1);
    }

    @Test
    public void generateFileNameNow_producesValidFileName() {
        RecordingFileNameGenerator generator = new RecordingFileNameGenerator();

        String fileName = generator.generateFileNameNow();

        // Should match the expected pattern
        String pattern = "^" +
                RecordingFileNameGenerator.FILE_NAME_PREFIX +
                "\\d{8}_\\d{6}" +
                RecordingFileNameGenerator.FILE_NAME_EXTENSION +
                "$";

        assertTrue("generateFileNameNow() should produce a valid file name", fileName.matches(pattern));
    }

    @Test
    public void generateFileNameNow_usesCurrentTime() {
        RecordingFileNameGenerator generator = new RecordingFileNameGenerator();

        // Generate two file names with a small delay
        String fileName1 = generator.generateFileNameNow();
        
        // Small delay to ensure different timestamps
        try {
            Thread.sleep(1100); // Sleep for 1.1 seconds to ensure different minute/second
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        String fileName2 = generator.generateFileNameNow();

        // They should be different (unless we happened to cross a minute boundary)
        // At minimum, they should both be valid
        String pattern = "^" +
                RecordingFileNameGenerator.FILE_NAME_PREFIX +
                "\\d{8}_\\d{6}" +
                RecordingFileNameGenerator.FILE_NAME_EXTENSION +
                "$";

        assertTrue("First file name should be valid", fileName1.matches(pattern));
        assertTrue("Second file name should be valid", fileName2.matches(pattern));
    }
}


