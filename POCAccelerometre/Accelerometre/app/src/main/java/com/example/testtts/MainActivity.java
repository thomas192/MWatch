package com.example.testtts;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.util.Log;

public class MainActivity extends AppCompatActivity implements SensorEventListener {


    private static final String TAG = "MainActivity";
    
    private SensorManager sensorManager;
    Sensor accelerometer;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Log.d(TAG, "onCreate: Initialisation" );

        sensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);

        accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        sensorManager.registerListener(MainActivity.this, accelerometer, SensorManager.SENSOR_DELAY_NORMAL);
        Log.d(TAG, "Donnée enrengistrer" );

    }
    @Override
    public void onAccuracyChanged(Sensor sensor, int i){

    }
    @Override
    public void onSensorChanged(SensorEvent sensorEvent){
            Log.d(TAG," Variable X: " + sensorEvent.values[0] + "Variable Y:  " + sensorEvent.values[1] + "Variable Z:  " +sensorEvent.values[2]);
            if (sensorEvent.values[0] < -8 )
        {
            Log.d(TAG, "Téléphone tourner à droite");
        }
        if (sensorEvent.values[0] > -2 && sensorEvent.values[0] < 2 && sensorEvent.values[1] > 9)
        {
            Log.d(TAG, "Téléphone droit");
        }
        if (sensorEvent.values[0] > 8 )
        {
            Log.d(TAG, "Téléphone tourner à gauche");
        }
        if (sensorEvent.values[0] > -2 && sensorEvent.values[0] < 2 && sensorEvent.values[1] < -9)
        {
            Log.d(TAG, "Téléphone à l'envers ");
        }
    }


}