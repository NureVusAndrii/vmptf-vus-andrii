package com.example.vmptf_pw3

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.vmptf_pw3.models.Task
import android.content.Context
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

class Level2Activity : AppCompatActivity() {

    private lateinit var recyclerTasks: RecyclerView
    private lateinit var editTask: EditText
    private lateinit var btnAdd: Button

    private lateinit var adapter: ToDoAdapter

    private val tasks = mutableListOf<Task>()
    private val gson = Gson()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_level2)

        recyclerTasks = findViewById(R.id.recyclerTasks)
        editTask = findViewById(R.id.editTask)
        btnAdd = findViewById(R.id.btnAdd)

        loadTasks()

        adapter = ToDoAdapter(tasks) {
            saveTasks()
        }

        recyclerTasks.layoutManager = LinearLayoutManager(this)
        recyclerTasks.adapter = adapter

        btnAdd.setOnClickListener {

            val text = editTask.text.toString().trim()

            if (text.isNotEmpty()) {

                tasks.add(Task(text))

                adapter.notifyItemInserted(tasks.size - 1)

                saveTasks()

                editTask.text.clear()
            }
        }
    }

    private fun saveTasks() {

        val sharedPreferences =
            getSharedPreferences("todo_prefs", Context.MODE_PRIVATE)

        val json = gson.toJson(tasks)

        sharedPreferences
            .edit()
            .putString("tasks", json)
            .apply()
    }

    private fun loadTasks() {

        val sharedPreferences =
            getSharedPreferences("todo_prefs", Context.MODE_PRIVATE)

        val json = sharedPreferences.getString("tasks", null)

        if (json != null) {

            val type = object : TypeToken<MutableList<Task>>() {}.type

            val savedTasks: MutableList<Task> =
                gson.fromJson(json, type)

            tasks.clear()
            tasks.addAll(savedTasks)
        }
    }
}