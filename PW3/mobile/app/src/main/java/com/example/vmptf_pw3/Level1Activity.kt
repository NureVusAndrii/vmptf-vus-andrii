package com.example.vmptf_pw3

import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class Level1Activity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_level1)

        val btnGreeting = findViewById<Button>(R.id.btnGreeting)

        btnGreeting.setOnClickListener {
            Toast.makeText(
                this,
                "Вітаємо з першим додатком на Kotlin!",
                Toast.LENGTH_LONG
            ).show()
        }
    }
}