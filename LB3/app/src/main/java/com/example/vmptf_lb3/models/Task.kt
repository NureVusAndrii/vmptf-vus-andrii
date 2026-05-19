package com.example.vmptf_lb3.models

data class Task(
    val id: Double,
    val title: String,
    val completed: Boolean,
    val dueDate: String?,
    val userId: Double
)

data class User(val id: Double, val username: String)

data class AnalyticsResponse(
    val total: Int,
    val completed: Int,
    val pending: Int,
    val overdue: Int
)