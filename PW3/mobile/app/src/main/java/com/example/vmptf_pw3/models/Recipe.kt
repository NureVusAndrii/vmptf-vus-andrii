package com.example.vmptf_pw3.models

data class Recipe(
    val id: Long,
    val title: String,
    val ingredients: List<String>,
    val instructions: String
)