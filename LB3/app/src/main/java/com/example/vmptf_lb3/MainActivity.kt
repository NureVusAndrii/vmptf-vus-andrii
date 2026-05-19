package com.example.vmptf_lb3

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.vmptf_lb3.api.AuthService
import com.example.vmptf_lb3.models.AuthRequest
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class MainActivity : AppCompatActivity() {

    private val retrofit = Retrofit.Builder()
        .baseUrl("http://10.10.20.89:3000")
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    private val api = retrofit.create(AuthService::class.java)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val etUsername = findViewById<EditText>(R.id.etUsername)
        val etEmail = findViewById<EditText>(R.id.etEmail)
        val etPassword = findViewById<EditText>(R.id.etPassword)
        val btnLogin = findViewById<Button>(R.id.btnLogin)
        val btnRegister = findViewById<Button>(R.id.btnRegister)

        btnLogin.setOnClickListener {
            val user = etUsername.text.toString()
            val pass = etPassword.text.toString()
            if (user.isNotEmpty() && pass.isNotEmpty()) {
                handleAuth(AuthRequest(user, pass), isLogin = true)
            }
        }

        btnRegister.setOnClickListener {
            val user = etUsername.text.toString()
            val email = etEmail.text.toString()
            val pass = etPassword.text.toString()
            if (user.isNotEmpty() && pass.isNotEmpty() && email.isNotEmpty()) {
                handleAuth(AuthRequest(user, pass, email), isLogin = false)
            }
        }
    }

    private fun handleAuth(request: AuthRequest, isLogin: Boolean) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = if (isLogin) api.login(request) else api.register(request)

                launch(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        val body = response.body()
                        val token = body?.token
                        val role = body?.role

                        val prefs = getSharedPreferences("auth_prefs", MODE_PRIVATE)
                        prefs.edit().apply {
                            putString("jwt_token", token)
                            putString("user_role", role)
                        }.apply()

                        Toast.makeText(this@MainActivity, "Success!", Toast.LENGTH_SHORT).show()

                        val intent = android.content.Intent(this@MainActivity, TasksActivity::class.java)
                        startActivity(intent)
                        finish()
                    } else {
                        Toast.makeText(this@MainActivity, "Error: ${response.code()}", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                launch(Dispatchers.Main) {
                    Toast.makeText(this@MainActivity, "Server unavailable", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
}