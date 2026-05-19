package com.example.vmptf_lb3.models

data class AuthRequest(val username: String, val password: String, val email: String? = null)
data class AuthResponse(val token: String, val role: String, val message: String?)