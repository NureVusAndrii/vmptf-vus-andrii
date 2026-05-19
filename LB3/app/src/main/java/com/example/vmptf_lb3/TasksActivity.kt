package com.example.vmptf_lb3

import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.vmptf_lb3.api.ApiService
import com.example.vmptf_lb3.models.*
import kotlinx.coroutines.*
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.math.BigDecimal
import java.util.*

class TasksActivity : AppCompatActivity() {
    private lateinit var adapter: TaskAdapter
    private var usersList = listOf<User>()
    private var selectedDateTime: String? = null

    private val api by lazy {
        Retrofit.Builder()
            .baseUrl("http://10.10.20.89:3000")
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_tasks)

        val prefs = getSharedPreferences("auth_prefs", MODE_PRIVATE)
        val token = prefs.getString("jwt_token", "") ?: ""
        val role = prefs.getString("user_role", "user")

        findViewById<TextView>(R.id.tvUserStatus).text = "Logged in as: $role"

        val spinner = findViewById<Spinner>(R.id.spinnerUsers)
        if (role == "admin") {
            spinner.visibility = View.VISIBLE
            setupUserSpinner(token)
        } else {
            spinner.visibility = View.GONE
        }

        findViewById<Button>(R.id.btnLogout).setOnClickListener {
            prefs.edit().clear().apply()
            startActivity(Intent(this, MainActivity::class.java))
            finish()
        }

        findViewById<TextView>(R.id.tvSelectedDate).setOnClickListener { showDateTimePicker() }

        setupRecyclerView(token)
        findViewById<Button>(R.id.btnCreateTask).setOnClickListener { createNewTask(token, role == "admin") }

        loadData(token)
    }

    private fun showDateTimePicker() {
        val c = Calendar.getInstance()
        DatePickerDialog(this, { _, year, month, day ->
            TimePickerDialog(this, { _, hour, minute ->
                selectedDateTime = String.format("%04d-%02d-%02d %02d:%02d", year, month + 1, day, hour, minute)
                findViewById<TextView>(R.id.tvSelectedDate).text = "Due: $selectedDateTime"
            }, c.get(Calendar.HOUR_OF_DAY), c.get(Calendar.MINUTE), true).show()
        }, c.get(Calendar.YEAR), c.get(Calendar.MONTH), c.get(Calendar.DAY_OF_MONTH)).show()
    }

    private fun loadData(token: String) {
        val auth = "Bearer $token"
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val tasksRes = api.getTasks(auth)
                val statsRes = api.getAnalytics(auth)

                withContext(Dispatchers.Main) {
                    if (tasksRes.isSuccessful) {
                        adapter.update(tasksRes.body() ?: emptyList())
                    } else {
                        Log.e("API_ERROR", "Tasks load failed: ${tasksRes.errorBody()?.string()}")
                    }

                    if (statsRes.isSuccessful) {
                        statsRes.body()?.let { s ->
                            findViewById<TextView>(R.id.statTotal).text = "${s.total}\nTotal"
                            findViewById<TextView>(R.id.statDone).text = "${s.completed}\nDone"
                            findViewById<TextView>(R.id.statPending).text = "${s.pending}\nPending"
                            findViewById<TextView>(R.id.statOverdue).text = "${s.overdue}\nOverdue"
                        }
                    }
                }
            } catch (e: Exception) {
                Log.e("API_ERROR", "Exception: ${e.message}")
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@TasksActivity, "Connection Error", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun setupUserSpinner(token: String) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val res = api.getUsers("Bearer $token")
                if (res.isSuccessful) {
                    val apiUsers = res.body() ?: emptyList()

                    val spinnerNames = mutableListOf("Myself")
                    spinnerNames.addAll(apiUsers.map { it.username })

                    usersList = apiUsers

                    withContext(Dispatchers.Main) {
                        val spinner = findViewById<Spinner>(R.id.spinnerUsers)
                        val spinnerAdapter = ArrayAdapter(
                            this@TasksActivity,
                            android.R.layout.simple_spinner_dropdown_item,
                            spinnerNames
                        )
                        spinner.adapter = spinnerAdapter
                    }
                }
            } catch (e: Exception) {
                Log.e("API_ERROR", "Users fetch failed: ${e.message}")
            }
        }
    }

    private fun createNewTask(token: String, isAdmin: Boolean) {
        val title = findViewById<EditText>(R.id.etNewTaskTitle).text.toString()
        val spinner = findViewById<Spinner>(R.id.spinnerUsers)
        if (title.isEmpty()) return

        val taskData = mutableMapOf<String, String>()
        taskData["title"] = title
        selectedDateTime?.let { taskData["dueDate"] = it }

        if (isAdmin) {
            val selectedPos = spinner.selectedItemPosition
            if (selectedPos > 0) {
                val selectedUser = usersList[selectedPos - 1]

                val rawId = selectedUser.id.toString()
                val cleanId = java.math.BigDecimal(rawId).toPlainString().replace(".0", "")

                taskData["assignedTo"] = cleanId
            }
        }

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val res = api.createTask("Bearer $token", taskData)
                if (res.isSuccessful) {
                    withContext(Dispatchers.Main) {
                        findViewById<EditText>(R.id.etNewTaskTitle).setText("")
                        selectedDateTime = null
                        findViewById<TextView>(R.id.tvSelectedDate).text = "Select Date & Time"
                        loadData(token)
                    }
                }
            } catch (e: Exception) {
                Log.e("API_ERROR", "Error: ${e.message}")
            }
        }
    }

    private fun setupRecyclerView(token: String) {
        val rv = findViewById<RecyclerView>(R.id.rvTasks)
        rv.layoutManager = LinearLayoutManager(this)
        adapter = TaskAdapter(emptyList(),
            onToggle = { task ->
                val cleanId = task.id.toString().replace(".0", "")
                CoroutineScope(Dispatchers.IO).launch {
                    api.updateTask("Bearer $token", cleanId, mapOf("completed" to !task.completed))
                    loadData(token)
                }
            },
            onDelete = { task ->
                val cleanId = task.id.toString().replace(".0", "")
                CoroutineScope(Dispatchers.IO).launch {
                    api.deleteTask("Bearer $token", cleanId)
                    loadData(token)
                }
            }
        )
        rv.adapter = adapter
    }
}