package com.example.simpleapp;

import android.Manifest;
import android.content.pm.PackageManager;
import android.media.MediaRecorder;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class MainActivity extends AppCompatActivity {

    private static final int REQUEST_RECORD_AUDIO_PERMISSION = 200;
    
    private TextView statusTextView;
    private Button recordButton;
    private MediaRecorder mediaRecorder;
    private boolean isRecording = false;
    private String currentRecordingPath;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Find the views by their IDs
        statusTextView = findViewById(R.id.textView);
        recordButton = findViewById(R.id.recordButton);

        // Always set up the button - it will check permission when clicked
        setupButton();
        
        // Check if we have permission to record audio
        if (!checkPermission()) {
            // Request permission
            requestPermission();
        }
    }

    /**
     * Check if we have RECORD_AUDIO permission
     */
    private boolean checkPermission() {
        return ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
                == PackageManager.PERMISSION_GRANTED;
    }

    /**
     * Request RECORD_AUDIO permission from the user
     */
    private void requestPermission() {
        ActivityCompat.requestPermissions(this,
                new String[]{Manifest.permission.RECORD_AUDIO},
                REQUEST_RECORD_AUDIO_PERMISSION);
    }

    /**
     * Handle the result of permission request
     */
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        
        if (requestCode == REQUEST_RECORD_AUDIO_PERMISSION) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // Permission granted - button is already set up and ready to use
                statusTextView.setText(R.string.not_recording);
                recordButton.setEnabled(true);
            } else {
                // Permission denied - update UI to reflect this
                Toast.makeText(this, R.string.permission_required, Toast.LENGTH_LONG).show();
                statusTextView.setText(R.string.permission_required);
                // Disable the button since recording won't work without permission
                recordButton.setEnabled(false);
            }
        }
    }

    /**
     * Set up the record button click listener
     * This method always sets up the button, but checks permission before recording
     */
    private void setupButton() {
        recordButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Check permission before attempting to record
                if (!checkPermission()) {
                    // Permission not granted - request it
                    Toast.makeText(MainActivity.this, R.string.permission_required, Toast.LENGTH_SHORT).show();
                    requestPermission();
                    return;
                }
                
                // Permission is granted - proceed with recording/stopping
                if (isRecording) {
                    stopRecording();
                } else {
                    startRecording();
                }
            }
        });
    }

    /**
     * Start recording audio from the microphone
     */
    private void startRecording() {
        try {
            // Create MediaRecorder instance
            mediaRecorder = new MediaRecorder();
            
            // Configure MediaRecorder
            mediaRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
            mediaRecorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
            
            // Generate filename with timestamp
            String fileName = generateFileName();
            File outputFile = new File(getFilesDir(), fileName);
            currentRecordingPath = outputFile.getAbsolutePath();
            
            mediaRecorder.setOutputFile(currentRecordingPath);
            mediaRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);
            
            // Prepare and start recording
            mediaRecorder.prepare();
            mediaRecorder.start();
            
            // Update UI
            isRecording = true;
            recordButton.setText(R.string.button_stop);
            statusTextView.setText(R.string.recording_status);
            
        } catch (IOException e) {
            Toast.makeText(this, "Failed to start recording: " + e.getMessage(), Toast.LENGTH_SHORT).show();
            releaseMediaRecorder();
        }
    }

    /**
     * Stop recording and save the file
     */
    private void stopRecording() {
        if (mediaRecorder != null) {
            try {
                mediaRecorder.stop();
                releaseMediaRecorder();
                
                // Update UI
                isRecording = false;
                recordButton.setText(R.string.button_text);
                statusTextView.setText(getString(R.string.not_recording) + "\nSaved: " + 
                        new File(currentRecordingPath).getName());
                
                Toast.makeText(this, "Recording saved: " + new File(currentRecordingPath).getName(), 
                        Toast.LENGTH_SHORT).show();
                
            } catch (RuntimeException e) {
                // MediaRecorder might throw RuntimeException if stop() is called too early
                Toast.makeText(this, "Failed to stop recording: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                releaseMediaRecorder();
            }
        }
    }

    /**
     * Release MediaRecorder resources
     */
    private void releaseMediaRecorder() {
        if (mediaRecorder != null) {
            mediaRecorder.release();
            mediaRecorder = null;
        }
    }

    /**
     * Generate a filename with current date and time
     * Format: recording_yyyyMMdd_HHmmss.3gp
     */
    private String generateFileName() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault());
        String timestamp = sdf.format(new Date());
        return "recording_" + timestamp + ".3gp";
    }

    /**
     * Clean up resources when activity is destroyed
     */
    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (isRecording) {
            stopRecording();
        }
        releaseMediaRecorder();
    }
}
