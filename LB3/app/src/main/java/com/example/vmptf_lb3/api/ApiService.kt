package com.example.vmptf_lb3.api

import com.example.vmptf_lb3.models.*
import retrofit2.Response
import retrofit2.http.*

interface ApiService {
    @GET("/api/tasks")
    suspend fun getTasks(@Header("Authorization") token: String): Response<List<Task>>

    @GET("/api/tasks/analytics")
    suspend fun getAnalytics(@Header("Authorization") token: String): Response<AnalyticsResponse>

    @POST("/api/tasks")
    suspend fun createTask(@Header("Authorization") token: String, @Body task: Map<String, String>): Response<Void>

    @GET("/api/auth/users")
    suspend fun getUsers(@Header("Authorization") token: String): Response<List<User>>

    @PUT("/api/tasks/{id}")
    suspend fun updateTask(@Header("Authorization") token: String, @Path("id") id: String, @Body body: Map<String, Boolean>): Response<Void>

    @DELETE("/api/tasks/{id}")
    suspend fun deleteTask(@Header("Authorization") token: String, @Path("id") id: String): Response<Void>
}