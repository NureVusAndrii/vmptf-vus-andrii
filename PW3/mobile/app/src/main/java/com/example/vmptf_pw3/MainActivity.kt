package com.example.vmptf_pw3

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val btnLevel1 = findViewById<Button>(R.id.btnLevel1)
        val btnLevel2 = findViewById<Button>(R.id.btnLevel2)
        val btnLevel4 = findViewById<Button>(R.id.btnLevel4)

        btnLevel1.setOnClickListener {
            startActivity(Intent(this, Level1Activity::class.java))
        }

        btnLevel2.setOnClickListener {
            startActivity(Intent(this, Level2Activity::class.java))
        }

        btnLevel4.setOnClickListener {
            startActivity(Intent(this, Level4Activity::class.java))
        }
    }
}